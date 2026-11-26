<?php
declare(strict_types=1);

// Owner page: see claim requests and reviews, delete a review.
// Open https://<site>/holidayseason/api/admin.php and log in with the ADMIN_KEY from api/config.php.
// The password is only ever sent in a login form (never in the web address or the page), the login
// lasts in a private cookie, and every change needs a secret one-time code from your own session.

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");

const LOGIN_MAX_TRIES = 5;
const LOGIN_WINDOW_SECONDS = 900;
const IDLE_LIMIT_SECONDS = 1800;

$config = is_file(__DIR__ . '/config.php') ? (include __DIR__ . '/config.php') : [];
$adminKey = is_array($config) ? (string) ($config['ADMIN_KEY'] ?? '') : '';

function admin_off(): never
{
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    exit('Owner page is off. Create api/config.php (copy config.sample.php) and set your own ADMIN_KEY of at least 12 characters.');
}

if (strlen($adminKey) < 12 || stripos($adminKey, 'change-me') !== false) {
    admin_off();
}

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
session_name('bhw_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $https,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

function h(mixed $v): string
{
    return htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function data_dir(): string
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    if (!is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
    }
    return $dir;
}

function read_list(string $name): array
{
    $path = data_dir() . '/' . $name . '.json';
    $list = is_file($path) ? json_decode((string) file_get_contents($path), true) : [];
    return is_array($list) ? $list : [];
}

function login_blocked(): bool
{
    $path = data_dir() . '/admin-attempts.json';
    $handle = fopen($path, 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) {
        return true;
    }
    $list = json_decode((string) stream_get_contents($handle), true);
    $list = is_array($list) ? $list : [];
    $who = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . $GLOBALS['adminKey']);
    $now = time();
    $recent = array_values(array_filter($list[$who] ?? [], fn ($t) => $t > $now - LOGIN_WINDOW_SECONDS));
    $blocked = count($recent) >= LOGIN_MAX_TRIES;
    if (!$blocked) {
        $recent[] = $now;
    }
    $list[$who] = $recent;
    foreach ($list as $key => $times) {
        if (!array_filter($times, fn ($t) => $t > $now - LOGIN_WINDOW_SECONDS)) {
            unset($list[$key]);
        }
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($list));
    flock($handle, LOCK_UN);
    fclose($handle);
    return $blocked;
}

function page_start(string $title): void
{
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">'
        . '<title>' . h($title) . '</title><style>'
        . 'body{font-family:system-ui,sans-serif;background:#061833;color:#f7f3ec;margin:0;padding:1rem}'
        . 'h1,h2{color:#d4a84b}h2{margin-top:2rem}'
        . '.card{background:#0e284f;border:1px solid rgba(212,168,75,.3);border-radius:12px;padding:.8rem 1rem;margin:.6rem 0}'
        . '.muted{color:rgba(247,243,236,.7);font-size:.85rem}'
        . 'input[type=password]{padding:.6rem;border-radius:8px;border:1px solid #6b5a2e;background:#061833;color:#f7f3ec;font-size:1rem;width:100%;max-width:20rem}'
        . 'button{background:#8b2344;color:#fff;border:0;border-radius:999px;padding:.45rem 1rem;cursor:pointer;font-size:.95rem}'
        . 'button.gold{background:#d4a84b;color:#2a1c00;font-weight:700}'
        . 'a{color:#d4a84b}.err{color:#ff9aa8}.top{display:flex;justify-content:space-between;align-items:center;gap:1rem}'
        . '</style></head><body>';
}

$self = basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'admin.php'));
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$loggedIn = isset($_SESSION['ok']) && (time() - (int) ($_SESSION['seen'] ?? 0)) < IDLE_LIMIT_SECONDS;
if ($loggedIn) {
    $_SESSION['seen'] = time();
} elseif (isset($_SESSION['ok'])) {
    $_SESSION = [];
}

if ($method === 'POST' && ($_POST['action'] ?? '') === 'login') {
    $error = '';
    if (login_blocked()) {
        http_response_code(429);
        $error = 'Too many tries. Please wait 15 minutes.';
    } elseif (hash_equals($adminKey, (string) ($_POST['password'] ?? ''))) {
        session_regenerate_id(true);
        $_SESSION = ['ok' => true, 'seen' => time(), 'csrf' => bin2hex(random_bytes(24))];
        header('Location: ' . $self, true, 303);
        exit;
    } else {
        http_response_code(403);
        $error = 'Wrong password.';
    }
    page_start('Owner page - log in');
    echo '<h1>Owner page</h1><p class="err">' . h($error) . '</p>';
    echo '<form method="post" action="' . h($self) . '"><input type="hidden" name="action" value="login">'
        . '<p><input type="password" name="password" autocomplete="current-password" placeholder="Password" required autofocus></p>'
        . '<p><button class="gold" type="submit">Log in</button></p></form></body></html>';
    exit;
}

if (!$loggedIn) {
    page_start('Owner page - log in');
    echo '<h1>Owner page</h1><p class="muted">The Blue Holiday Wave</p>'
        . '<form method="post" action="' . h($self) . '"><input type="hidden" name="action" value="login">'
        . '<p><input type="password" name="password" autocomplete="current-password" placeholder="Password" required autofocus></p>'
        . '<p><button class="gold" type="submit">Log in</button></p></form></body></html>';
    exit;
}

$csrf = (string) $_SESSION['csrf'];

if ($method === 'POST') {
    if (!hash_equals($csrf, (string) ($_POST['csrf'] ?? ''))) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        exit('Request refused. Please go back, reload the page and try again.');
    }
    $action = (string) ($_POST['action'] ?? '');
    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: ' . $self, true, 303);
        exit;
    }
    if ($action === 'delete') {
        $id = (string) ($_POST['id'] ?? '');
        $handle = fopen(data_dir() . '/reviews.json', 'c+');
        if ($handle && flock($handle, LOCK_EX)) {
            $list = json_decode((string) stream_get_contents($handle), true);
            $list = array_values(array_filter(is_array($list) ? $list : [], fn ($r) => ($r['id'] ?? '') !== $id));
            ftruncate($handle, 0);
            rewind($handle);
            fwrite($handle, json_encode($list, JSON_UNESCAPED_UNICODE));
            flock($handle, LOCK_UN);
            fclose($handle);
        }
        header('Location: ' . $self, true, 303);
        exit;
    }
}

$claims = array_reverse(read_list('claims'));
$reviews = array_reverse(read_list('reviews'));

page_start('Blue Holiday Wave - owner page');
?>
<div class="top">
  <h1>Blue Holiday Wave - owner page</h1>
  <form method="post" action="<?= h($self) ?>">
    <input type="hidden" name="action" value="logout">
    <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
    <button type="submit">Log out</button>
  </form>
</div>

<h2>Claim requests (<?= count($claims) ?>)</h2>
<?php if (!$claims): ?><p class="muted">No requests yet.</p><?php endif; ?>
<?php foreach ($claims as $c): ?>
  <div class="card">
    <strong><?= h($c['partnerName'] ?: $c['partner']) ?></strong>
    <span class="muted"> - <?= h($c['partner']) ?> - <?= h($c['created']) ?></span><br>
    <?= h($c['ownerName']) ?> -
    <a href="mailto:<?= h($c['email']) ?>"><?= h($c['email']) ?></a>
    <?php if ($c['phone']): ?> - <?= h($c['phone']) ?><?php endif; ?>
    <span class="muted"> - thank-you email <?= !empty($c['confirmationSent']) ? 'sent' : 'NOT sent' ?></span>
    <?php if ($c['message']): ?><p><?= nl2br(h($c['message'])) ?></p><?php endif; ?>
  </div>
<?php endforeach; ?>

<h2>Reviews (<?= count($reviews) ?>)</h2>
<?php if (!$reviews): ?><p class="muted">No reviews yet.</p><?php endif; ?>
<?php foreach ($reviews as $r): ?>
  <div class="card">
    <strong><?= h($r['partner']) ?></strong> - <?= str_repeat('★', (int) $r['rating']) . str_repeat('☆', 5 - (int) $r['rating']) ?>
    <span class="muted"> - <?= h($r['name']) ?> - <?= h($r['created']) ?></span>
    <p><?= nl2br(h($r['text'])) ?></p>
    <form method="post" action="<?= h($self) ?>" onsubmit="return confirm('Delete this review?')">
      <input type="hidden" name="action" value="delete">
      <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
      <input type="hidden" name="id" value="<?= h($r['id']) ?>">
      <button type="submit">Delete</button>
    </form>
  </div>
<?php endforeach; ?>
</body>
</html>
