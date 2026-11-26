<?php
declare(strict_types=1);

// Reviews and "claim this page" requests for The Blue Holiday Wave.
// Plain PHP + JSON files, so it runs on normal shared hosting (Bluehost).
//   GET  community.php?action=reviews&partner=<id>   -> reviews + average
//   POST community.php?action=review                 -> leave a review (1-5 stars)
//   POST community.php?action=claim                  -> owner asks to claim a page

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Vary: Origin');

$config = is_file(__DIR__ . '/config.php') ? (include __DIR__ . '/config.php') : [];
if (!is_array($config)) {
    $config = [];
}

/**
 * Only this website (same host) may call the server. Other sites, for example the mobile app,
 * must be listed in config.php under ALLOWED_ORIGINS. No Origin header means a plain
 * address-bar or server call, which is fine for reading.
 */
function origin_allowed(array $config): bool
{
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin === '') {
        return true;
    }
    $host = (string) parse_url($origin, PHP_URL_HOST);
    $port = parse_url($origin, PHP_URL_PORT);
    $originHost = $host . ($port ? ':' . $port : '');
    if ($originHost !== '' && strcasecmp($originHost, (string) ($_SERVER['HTTP_HOST'] ?? '')) === 0) {
        return true;
    }
    $list = $config['ALLOWED_ORIGINS'] ?? [];
    return is_array($list) && in_array($origin, $list, true);
}

if (!origin_allowed($config)) {
    http_response_code(403);
    echo json_encode(['error' => 'This website is not allowed to use this service.']);
    exit;
}

$requestOrigin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($requestOrigin !== '') {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Access-Control-Allow-Headers: content-type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const MAX_BODY_BYTES = 8000;
const REVIEWS_KEPT = 2000;

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : (int) preg_match_all('/./su', $value);
}

function text_cut(string $value, int $max): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max);
    }
    preg_match_all('/./su', $value, $m);
    return implode('', array_slice($m[0], 0, $max));
}

function fail(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function data_dir(): string
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
        fail(500, 'Storage is not available.');
    }
    $guard = $dir . '/.htaccess';
    if (!is_file($guard)) {
        @file_put_contents($guard, "Require all denied\nDeny from all\n");
    }
    return $dir;
}

/** Read-modify-write a JSON list under an exclusive lock. */
function mutate(string $name, callable $change): mixed
{
    $path = data_dir() . '/' . $name . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        fail(500, 'Storage is busy, please try again.');
    }
    $raw = stream_get_contents($handle);
    $list = $raw ? json_decode($raw, true) : [];
    if (!is_array($list)) {
        $list = [];
    }
    $result = $change($list);
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($list, JSON_UNESCAPED_UNICODE));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $result;
}

function read_list(string $name): array
{
    $path = data_dir() . '/' . $name . '.json';
    if (!is_file($path)) {
        return [];
    }
    $list = json_decode((string) @file_get_contents($path), true);
    return is_array($list) ? $list : [];
}

function body(): array
{
    $raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
    if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
        fail(413, 'That message is too long.');
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function clean(mixed $value, int $max): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $value = trim(preg_replace('/[ \t]+/u', ' ', $value) ?? '');
    return text_cut($value, $max);
}

function one_line(string $value): string
{
    return trim(preg_replace('/\s+/u', ' ', $value) ?? '');
}

function partner_id(mixed $value): string
{
    $id = is_string($value) ? strtolower(trim($value)) : '';
    if (!preg_match('/^[a-z0-9][a-z0-9-]{0,59}$/', $id)) {
        fail(400, 'Unknown page.');
    }
    return $id;
}

function visitor_hash(): string
{
    $saltFile = data_dir() . '/.salt';
    if (!is_file($saltFile)) {
        @file_put_contents($saltFile, bin2hex(random_bytes(16)));
    }
    $salt = (string) @file_get_contents($saltFile);
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . $salt);
}

/** A short-lived signed code the page asks for when the form opens. A script that posts blindly has none. */
function form_token(): string
{
    $issued = (string) time();
    $saltFile = data_dir() . '/.salt';
    visitor_hash();
    $secret = (string) @file_get_contents($saltFile);
    return $issued . '.' . hash_hmac('sha256', $issued, $secret);
}

function form_token_ok(mixed $token): bool
{
    if (!is_string($token) || !preg_match('/^(\d{9,12})\.([a-f0-9]{64})$/', $token, $m)) {
        return false;
    }
    visitor_hash();
    $secret = (string) @file_get_contents(data_dir() . '/.salt');
    if (!hash_equals(hash_hmac('sha256', $m[1], $secret), $m[2])) {
        return false;
    }
    $age = time() - (int) $m[1];
    return $age >= 2 && $age <= 43200;
}

function too_many(string $bucket, int $limit, int $windowSeconds, string $who): bool
{
    return (bool) mutate('ratelimit', function (array &$list) use ($bucket, $limit, $windowSeconds, $who) {
        $now = time();
        foreach ($list as $key => $times) {
            $list[$key] = array_values(array_filter($times, fn ($t) => $t > $now - 86400));
            if (!$list[$key]) {
                unset($list[$key]);
            }
        }
        $key = $bucket . ':' . $who;
        $recent = array_filter($list[$key] ?? [], fn ($t) => $t > $now - $windowSeconds);
        if (count($recent) >= $limit) {
            return true;
        }
        $list[$key][] = $now;
        return false;
    });
}

function summary(string $partner): array
{
    $all = array_values(array_filter(read_list('reviews'), fn ($r) => ($r['partner'] ?? '') === $partner));
    $count = count($all);
    $sum = array_sum(array_map(fn ($r) => (int) ($r['rating'] ?? 0), $all));
    usort($all, fn ($a, $b) => strcmp((string) $b['created'], (string) $a['created']));
    $shown = array_map(fn ($r) => [
        'id' => $r['id'],
        'name' => $r['name'],
        'rating' => (int) $r['rating'],
        'text' => $r['text'],
        'created' => $r['created'],
    ], array_slice($all, 0, 30));
    return [
        'count' => $count,
        'average' => $count ? round($sum / $count, 1) : 0,
        'reviews' => $shown,
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string) ($_GET['action'] ?? '');

if ($method === 'GET' && $action === 'token') {
    echo json_encode(['token' => form_token()]);
    exit;
}

if ($method === 'GET' && $action === 'reviews') {
    echo json_encode(summary(partner_id($_GET['partner'] ?? '')), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method !== 'POST') {
    fail(405, 'Not supported.');
}

$input = body();

if (clean($input['website'] ?? '', 200) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if (!form_token_ok($input['token'] ?? null)) {
    fail(400, 'Please reload the page and try again.');
}

if ($action === 'review') {
    $partner = partner_id($input['partner'] ?? '');
    $rating = filter_var($input['rating'] ?? null, FILTER_VALIDATE_INT);
    if ($rating === false || $rating < 1 || $rating > 5) {
        fail(400, 'Please choose 1 to 5 stars.');
    }
    $text = clean($input['text'] ?? '', 500);
    if (text_length($text) < 3) {
        fail(400, 'Please write a short review.');
    }
    if (preg_match('~(https?://|www\.|\.com\b|\.net\b|\.org\b)~i', $text)) {
        fail(400, 'Please leave out web links.');
    }
    $name = one_line(clean($input['name'] ?? '', 40)) ?: 'Visitor';
    $who = visitor_hash();

    if (too_many('review-any', 6, 3600, $who)) {
        fail(429, 'Too many reviews from your connection. Please try again later.');
    }
    if (too_many('review-' . $partner, 1, 86400, $who)) {
        fail(429, 'You already reviewed this page today. Thank you!');
    }

    mutate('reviews', function (array &$list) use ($partner, $rating, $name, $text) {
        $list[] = [
            'id' => bin2hex(random_bytes(6)),
            'partner' => $partner,
            'name' => $name,
            'rating' => $rating,
            'text' => $text,
            'created' => gmdate('c'),
        ];
        if (count($list) > REVIEWS_KEPT) {
            $list = array_slice($list, -REVIEWS_KEPT);
        }
    });

    http_response_code(201);
    echo json_encode(summary($partner), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'claim') {
    $partner = partner_id($input['partner'] ?? '');
    $partnerName = one_line(clean($input['partnerName'] ?? '', 80));
    $ownerName = one_line(clean($input['ownerName'] ?? '', 80));
    $email = one_line(clean($input['email'] ?? '', 120));
    $phone = one_line(clean($input['phone'] ?? '', 40));
    $message = clean($input['message'] ?? '', 800);
    if ($ownerName === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail(400, 'Please add your name and a valid email address.');
    }
    if (too_many('claim', 3, 86400, visitor_hash())) {
        fail(429, 'Too many requests from your connection. Please try again tomorrow.');
    }

    $entry = [
        'id' => bin2hex(random_bytes(6)),
        'partner' => $partner,
        'partnerName' => $partnerName,
        'ownerName' => $ownerName,
        'email' => $email,
        'phone' => $phone,
        'message' => $message,
        'created' => gmdate('c'),
    ];
    mutate('claims', function (array &$list) use ($entry) {
        $list[] = $entry;
    });

    require_once __DIR__ . '/claim-mail.php';
    $sent = send_claim_confirmation($entry, $config);
    mutate('claims', function (array &$list) use ($entry, $sent) {
        foreach ($list as $i => $row) {
            if (($row['id'] ?? '') === $entry['id']) {
                $list[$i]['confirmationSent'] = $sent;
            }
        }
    });

    $to = (string) ($config['ADMIN_EMAIL'] ?? '');
    if ($to !== '' && filter_var($to, FILTER_VALIDATE_EMAIL)) {
        $subject = 'Claim request: ' . ($partnerName ?: $partner);
        $text = "Someone wants to claim a page on The Blue Holiday Wave.\n\n"
            . "Page: {$partnerName} ({$partner})\nName: {$ownerName}\nEmail: {$email}\nPhone: {$phone}\n\n{$message}\n";
        @mail($to, $subject, $text, "Reply-To: {$email}\r\nContent-Type: text/plain; charset=utf-8\r\n");
    }

    http_response_code(201);
    echo json_encode(['ok' => true, 'confirmationSent' => $sent]);
    exit;
}

fail(400, 'Unknown request.');
