<?php
declare(strict_types=1);

// Page owners: activate an approved claim, log in, edit their own page (text, logo, photos).
//   GET  owner.php?action=content                 -> public: what owners changed, for every page
//   GET  owner.php?action=activation&token=...    -> who this activation link is for
//   POST owner.php?action=activate                -> choose username + password (needs the emailed link)
//   POST owner.php?action=login | logout
//   GET  owner.php?action=me                      -> the logged-in owner's page content
//   POST owner.php?action=save                    -> save text fields
//   POST owner.php?action=upload (multipart)      -> upload a logo or photo
//   POST owner.php?action=remove-photo            -> remove a photo
// Every change is limited to the owner's own page and needs the session's secret code (X-CSRF header).

require __DIR__ . '/common.php';
$config = api_boot();

const TEXT_FIELDS = [
    'tagline' => 140,
    'intro' => 700,
    'heroTitle' => 100,
    'heroText' => 400,
    'quote' => 200,
    'shopNote' => 400,
    'lifestyleTitle' => 100,
    'lifestyleText' => 600,
    'openingHours' => 200,
    'phone' => 40,
    'email' => 80,
];
const ITEMS_MAX = 6;
const GALLERY_MAX = 12;
const IMAGE_SLOTS = ['logo', 'hero', 'highlight', 'lifestyle', 'item0', 'item1', 'item2', 'item3', 'item4', 'item5'];
const UPLOAD_MAX_BYTES = 6 * 1024 * 1024;
const SAVE_MAX_BYTES = 20000;

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

function start_owner_session(bool $https): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('bhw_owner');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
}

function ok(array $data = [], int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data + ['ok' => true], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function public_content(array $entry): array
{
    $out = [];
    foreach (array_keys(TEXT_FIELDS) as $key) {
        if (isset($entry[$key]) && $entry[$key] !== '') {
            $out[$key] = $entry[$key];
        }
    }
    foreach (['whatsapp', 'websiteUrl', 'websiteLabel'] as $key) {
        if (!empty($entry[$key])) {
            $out[$key] = $entry[$key];
        }
    }
    if (!empty($entry['items']) && is_array($entry['items'])) {
        $out['items'] = $entry['items'];
    }
    if (!empty($entry['images']) && is_array($entry['images'])) {
        $out['images'] = $entry['images'];
    }
    if (!empty($entry['gallery']) && is_array($entry['gallery'])) {
        $out['gallery'] = array_values($entry['gallery']);
    }
    return $out;
}

function find_owner(string $username): ?array
{
    foreach (read_list('owners') as $owner) {
        if (($owner['username'] ?? '') === $username) {
            return $owner;
        }
    }
    return null;
}

function require_owner(bool $https): array
{
    start_owner_session($https);
    $username = (string) ($_SESSION['owner'] ?? '');
    $owner = $username !== '' ? find_owner($username) : null;
    if (!$owner || (time() - (int) ($_SESSION['seen'] ?? 0)) > 7200) {
        $_SESSION = [];
        fail(401, 'Please log in.');
    }
    $_SESSION['seen'] = time();
    return $owner;
}

function require_csrf(): void
{
    $sent = (string) ($_SERVER['HTTP_X_CSRF'] ?? '');
    if ($sent === '' || !hash_equals((string) ($_SESSION['csrf'] ?? ''), $sent)) {
        fail(403, 'Please reload the page and try again.');
    }
}

function login_session(array $owner): string
{
    session_regenerate_id(true);
    $csrf = bin2hex(random_bytes(24));
    $_SESSION = ['owner' => $owner['username'], 'csrf' => $csrf, 'seen' => time()];
    return $csrf;
}

function good_username(mixed $value): string
{
    $name = is_string($value) ? strtolower(trim($value)) : '';
    if (!preg_match('/^[a-z0-9][a-z0-9._-]{2,29}$/', $name)) {
        fail(400, 'Choose a username of 3 to 30 characters: letters, numbers, dot, dash or underscore.');
    }
    return $name;
}

function good_password(mixed $value, string $username): string
{
    $pw = is_string($value) ? $value : '';
    if (strlen($pw) < 10 || strlen($pw) > 100) {
        fail(400, 'Choose a password of at least 10 characters.');
    }
    if (strtolower($pw) === $username || preg_match('/^(.)\1+$/', $pw) || in_array(strtolower($pw), ['password123', '1234567890', 'qwertyuiop', 'password12'], true)) {
        fail(400, 'That password is too easy to guess. Please choose another.');
    }
    return $pw;
}

function claim_by_token(string $token): ?array
{
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
        return null;
    }
    $hash = hash('sha256', $token);
    foreach (read_list('claims') as $claim) {
        if (hash_equals((string) ($claim['tokenHash'] ?? str_repeat('0', 64)), $hash)
            && ($claim['status'] ?? '') === 'approved'
            && empty($claim['activatedAt'])
            && (int) ($claim['tokenExpires'] ?? 0) > time()) {
            return $claim;
        }
    }
    return null;
}

function uploads_dir(string $partner): string
{
    $base = __DIR__ . '/uploads';
    if (!is_dir($base)) {
        @mkdir($base, 0755, true);
    }
    $guard = $base . '/.htaccess';
    if (!is_file($guard)) {
        @file_put_contents($guard, "Options -Indexes -ExecCGI\nRemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phps .pl .cgi\nRemoveType .php\n<FilesMatch \"\\.(?i:php|phtml|phar|pl|cgi|sh|html?)$\">\n  Require all denied\n</FilesMatch>\n");
    }
    $dir = $base . '/' . $partner;
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        fail(500, 'Photo storage is not available.');
    }
    return $dir;
}

function drop_file(string $partner, string $relative): void
{
    $prefix = 'api/uploads/' . $partner . '/';
    if (strpos($relative, $prefix) === 0 && preg_match('~^[a-z0-9-]+-[a-f0-9]{12}\.(jpg|png)$~', substr($relative, strlen($prefix)))) {
        @unlink(__DIR__ . '/uploads/' . $partner . '/' . substr($relative, strlen($prefix)));
    }
}

/** Re-draws the uploaded picture, so only a clean image is ever stored (no hidden code, no metadata). */
function store_image(string $tmp, string $partner, string $slot): string
{
    if (!function_exists('imagecreatefromstring')) {
        fail(503, 'Photo upload is not available on this server yet.');
    }
    $info = @getimagesize($tmp);
    if (!$info || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
        fail(400, 'Please upload a JPG, PNG or WebP photo.');
    }
    if ($info[0] < 50 || $info[1] < 50 || $info[0] > 9000 || $info[1] > 9000) {
        fail(400, 'That photo has an unusual size. Please use a photo between 50 and 9000 pixels wide.');
    }
    $image = @imagecreatefromstring((string) file_get_contents($tmp));
    if (!$image) {
        fail(400, 'We could not read that photo. Please try another one.');
    }
    $isLogo = $slot === 'logo';
    $max = $isLogo ? 900 : 1600;
    $w = imagesx($image);
    $h = imagesy($image);
    $scale = min(1, $max / max($w, $h));
    $nw = max(1, (int) round($w * $scale));
    $nh = max(1, (int) round($h * $scale));
    $out = imagecreatetruecolor($nw, $nh);
    if ($isLogo) {
        imagealphablending($out, false);
        imagesavealpha($out, true);
        imagefill($out, 0, 0, imagecolorallocatealpha($out, 0, 0, 0, 127));
    } else {
        imagefill($out, 0, 0, imagecolorallocate($out, 255, 255, 255));
    }
    imagecopyresampled($out, $image, 0, 0, 0, 0, $nw, $nh, $w, $h);
    $ext = $isLogo ? 'png' : 'jpg';
    $name = $slot . '-' . bin2hex(random_bytes(6)) . '.' . $ext;
    $path = uploads_dir($partner) . '/' . $name;
    $saved = $isLogo ? imagepng($out, $path, 6) : imagejpeg($out, $path, 84);
    if (!$saved) {
        fail(500, 'We could not save that photo. Please try again.');
    }
    @chmod($path, 0644);
    return 'api/uploads/' . $partner . '/' . $name;
}

function https_url(mixed $value): string
{
    $url = is_string($value) ? trim($value) : '';
    if ($url === '') {
        return '';
    }
    if (!preg_match('~^https://[a-z0-9.-]+\.[a-z]{2,}(/[^\s<>"\']*)?$~i', $url) || strlen($url) > 200) {
        fail(400, 'Please enter the website as a full address starting with https://');
    }
    return $url;
}

function plain(mixed $value, int $max): string
{
    $text = is_string($value) ? strip_tags($value) : '';
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
    return text_cut(trim(preg_replace('/[ \t]+/u', ' ', $text) ?? ''), $max);
}

function own_entry(string $partner): array
{
    $all = read_list('content');
    return is_array($all[$partner] ?? null) ? $all[$partner] : [];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string) ($_GET['action'] ?? '');
$who = visitor_hash();

if ($method === 'GET' && $action === 'content') {
    $out = [];
    foreach (read_list('content') as $partner => $entry) {
        if (is_array($entry) && ($pub = public_content($entry))) {
            $out[$partner] = $pub;
        }
    }
    header('Cache-Control: no-cache');
    ok(['content' => (object) $out]);
}

if ($method === 'GET' && $action === 'activation') {
    if (too_many('activation-look', 30, 3600, $who)) {
        fail(429, 'Too many tries. Please try again later.');
    }
    $claim = claim_by_token((string) ($_GET['token'] ?? ''));
    if (!$claim) {
        fail(404, 'This activation link is not valid any more. It may have been used already or it has expired. Reply to your approval email and we will send a new one.');
    }
    ok(['partner' => $claim['partner'], 'partnerName' => $claim['partnerName'] ?: $claim['partner']]);
}

if ($method === 'GET' && $action === 'me') {
    $owner = require_owner($https);
    $entry = own_entry($owner['partner']);
    ok([
        'username' => $owner['username'],
        'partner' => $owner['partner'],
        'csrf' => $_SESSION['csrf'],
        'content' => (object) public_content($entry),
    ]);
}

if ($method !== 'POST') {
    fail(405, 'Not supported.');
}

if ($action === 'upload') {
    $owner = require_owner($https);
    require_csrf();
    if (too_many('upload-' . $owner['username'], 40, 3600, $who)) {
        fail(429, 'Too many photos in a short time. Please try again in a while.');
    }
    if (empty($_POST) && empty($_FILES) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
        fail(413, 'That photo is too big. Please use one under 6 MB.');
    }
    $slot = (string) ($_POST['slot'] ?? '');
    if ($slot !== 'gallery' && !in_array($slot, IMAGE_SLOTS, true)) {
        fail(400, 'Unknown photo place.');
    }
    $file = $_FILES['photo'] ?? null;
    if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file((string) $file['tmp_name'])) {
        fail(400, ($file['error'] ?? 0) === UPLOAD_ERR_INI_SIZE ? 'That photo is too big. Please use one under 6 MB.' : 'Please choose a photo to upload.');
    }
    if ((int) $file['size'] > UPLOAD_MAX_BYTES) {
        fail(400, 'That photo is too big. Please use one under 6 MB.');
    }
    $partner = (string) $owner['partner'];
    $path = store_image((string) $file['tmp_name'], $partner, $slot);
    $entry = mutate('content', function (array &$all) use ($partner, $slot, $path) {
        $entry = is_array($all[$partner] ?? null) ? $all[$partner] : [];
        if ($slot === 'gallery') {
            $gallery = array_values($entry['gallery'] ?? []);
            if (count($gallery) >= GALLERY_MAX) {
                drop_file($partner, $path);
                return ['error' => 'You can add up to ' . GALLERY_MAX . ' extra photos. Remove one first.'];
            }
            $gallery[] = $path;
            $entry['gallery'] = $gallery;
        } else {
            $old = $entry['images'][$slot] ?? '';
            if ($old) {
                drop_file($partner, (string) $old);
            }
            $entry['images'][$slot] = $path;
        }
        $entry['updated'] = gmdate('c');
        $all[$partner] = $entry;
        return $entry;
    });
    if (isset($entry['error'])) {
        fail(400, $entry['error']);
    }
    ok(['content' => (object) public_content($entry)], 201);
}

$input = body(SAVE_MAX_BYTES);

if ($action === 'activate') {
    if (!form_token_ok($input['formToken'] ?? null)) {
        fail(400, 'Please reload the page and try again.');
    }
    if (too_many('activate', 10, 3600, $who)) {
        fail(429, 'Too many tries. Please try again later.');
    }
    $claim = claim_by_token((string) ($input['token'] ?? ''));
    if (!$claim) {
        fail(404, 'This activation link is not valid any more. It may have been used already or it has expired. Reply to your approval email and we will send a new one.');
    }
    $username = good_username($input['username'] ?? '');
    $password = good_password($input['password'] ?? '', $username);
    $partner = (string) $claim['partner'];

    $owner = mutate('owners', function (array &$list) use ($username, $password, $partner, $claim) {
        foreach ($list as $existing) {
            if (($existing['username'] ?? '') === $username) {
                return 'That username is taken. Please choose another one.';
            }
            if (($existing['partner'] ?? '') === $partner) {
                return 'This page already has an owner account. Please contact us.';
            }
        }
        $row = [
            'username' => $username,
            'hash' => password_hash($password, PASSWORD_DEFAULT),
            'partner' => $partner,
            'claimId' => $claim['id'],
            'created' => gmdate('c'),
        ];
        $list[] = $row;
        return $row;
    });
    if (is_string($owner)) {
        fail(409, $owner);
    }
    mutate('claims', function (array &$list) use ($claim, $username) {
        foreach ($list as $i => $row) {
            if (($row['id'] ?? '') === $claim['id']) {
                $list[$i]['activatedAt'] = gmdate('c');
                $list[$i]['activatedUser'] = $username;
                unset($list[$i]['tokenHash'], $list[$i]['tokenExpires']);
            }
        }
    });
    start_owner_session($https);
    $csrf = login_session($owner);
    ok(['username' => $username, 'partner' => $partner, 'csrf' => $csrf], 201);
}

if ($action === 'login') {
    if (too_many('owner-login', 8, 900, $who)) {
        fail(429, 'Too many tries. Please wait 15 minutes.');
    }
    $username = strtolower(trim((string) ($input['username'] ?? '')));
    $owner = find_owner($username);
    $hash = $owner['hash'] ?? password_hash('not-a-real-password', PASSWORD_DEFAULT);
    $valid = password_verify((string) ($input['password'] ?? ''), $hash) && $owner;
    if (!$valid) {
        fail(403, 'Wrong username or password.');
    }
    start_owner_session($https);
    $csrf = login_session($owner);
    ok(['username' => $owner['username'], 'partner' => $owner['partner'], 'csrf' => $csrf]);
}

if ($action === 'logout') {
    start_owner_session($https);
    $_SESSION = [];
    session_destroy();
    ok();
}

$owner = require_owner($https);
require_csrf();
$partner = (string) $owner['partner'];

if ($action === 'save') {
    $clean = [];
    foreach (TEXT_FIELDS as $key => $max) {
        $clean[$key] = plain($input[$key] ?? '', $max);
    }
    if ($clean['email'] !== '' && filter_var($clean['email'], FILTER_VALIDATE_EMAIL) === false) {
        fail(400, 'Please enter a valid email address.');
    }
    $wa = preg_replace('/\D+/', '', (string) ($input['whatsapp'] ?? '')) ?? '';
    if ($wa !== '' && (strlen($wa) < 8 || strlen($wa) > 15)) {
        fail(400, 'Please enter the WhatsApp number with country code, for example 59997353131.');
    }
    $clean['whatsapp'] = $wa;
    $clean['websiteUrl'] = https_url($input['websiteUrl'] ?? '');
    $clean['websiteLabel'] = $clean['websiteUrl'] !== '' ? text_cut(preg_replace('~^https://(www\.)?~i', '', $clean['websiteUrl']) ?? '', 60) : '';
    $items = [];
    foreach (array_slice(is_array($input['items'] ?? null) ? $input['items'] : [], 0, ITEMS_MAX) as $item) {
        $items[] = ['title' => plain($item['title'] ?? '', 80), 'text' => plain($item['text'] ?? '', 300)];
    }
    $entry = mutate('content', function (array &$all) use ($partner, $clean, $items) {
        $entry = is_array($all[$partner] ?? null) ? $all[$partner] : [];
        $entry = array_merge($entry, $clean);
        $entry['items'] = $items;
        $entry['updated'] = gmdate('c');
        $all[$partner] = $entry;
        return $entry;
    });
    ok(['content' => (object) public_content($entry)]);
}

if ($action === 'remove-photo') {
    $slot = (string) ($input['slot'] ?? '');
    $url = (string) ($input['url'] ?? '');
    $entry = mutate('content', function (array &$all) use ($partner, $slot, $url) {
        $entry = is_array($all[$partner] ?? null) ? $all[$partner] : [];
        if ($slot === 'gallery') {
            $gallery = array_values($entry['gallery'] ?? []);
            if (in_array($url, $gallery, true)) {
                drop_file($partner, $url);
                $entry['gallery'] = array_values(array_filter($gallery, fn ($g) => $g !== $url));
            }
        } elseif (in_array($slot, IMAGE_SLOTS, true) && !empty($entry['images'][$slot])) {
            drop_file($partner, (string) $entry['images'][$slot]);
            unset($entry['images'][$slot]);
        }
        $entry['updated'] = gmdate('c');
        $all[$partner] = $entry;
        return $entry;
    });
    ok(['content' => (object) public_content($entry)]);
}

fail(400, 'Unknown request.');
