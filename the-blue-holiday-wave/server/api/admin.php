<?php
declare(strict_types=1);

// Dashboard for the site owner: see who claimed a page, approve or deny the claim,
// send the approved or denied email, and see which pages owners have edited.
// Open https://<site>/holidayseason/api/admin.php and log in with the ADMIN_KEY from api/config.php.
// The password is only ever sent in the login form (never in the address or the page), the login
// lasts in a private cookie, and every change needs a secret one-time code from your own session.

$nonce = base64_encode(random_bytes(16));
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-{$nonce}'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");

require __DIR__ . '/common.php';
require __DIR__ . '/claim-mail.php';

const LOGIN_MAX_TRIES = 5;
const LOGIN_WINDOW_SECONDS = 900;
const IDLE_LIMIT_SECONDS = 1800;
const ACTIVATION_DAYS = 14;

$config = is_file(__DIR__ . '/config.php') ? (include __DIR__ . '/config.php') : [];
$config = is_array($config) ? $config : [];
$adminKey = (string) ($config['ADMIN_KEY'] ?? '');

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

function login_blocked(string $adminKey): bool
{
    return too_many('admin-login', LOGIN_MAX_TRIES, LOGIN_WINDOW_SECONDS, hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . $adminKey));
}

function page_start(string $title): void
{
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">'
        . '<title>' . h($title) . '</title><style>'
        . 'body{font-family:system-ui,sans-serif;background:#061833;color:#f7f3ec;margin:0;padding:1rem;max-width:900px;margin-inline:auto}'
        . 'h1,h2{color:#d4a84b}h2{margin-top:2rem}'
        . '.card{background:#0e284f;border:1px solid rgba(212,168,75,.3);border-radius:12px;padding:.8rem 1rem;margin:.7rem 0}'
        . '.muted{color:rgba(247,243,236,.7);font-size:.85rem}'
        . 'input[type=password]{padding:.6rem;border-radius:8px;border:1px solid #6b5a2e;background:#061833;color:#f7f3ec;font-size:1rem;width:100%;max-width:20rem}'
        . 'button{background:#8b2344;color:#fff;border:0;border-radius:999px;padding:.5rem 1rem;cursor:pointer;font-size:.92rem;margin:.2rem .3rem .2rem 0}'
        . 'button.gold{background:#d4a84b;color:#2a1c00;font-weight:700}button.green{background:#1f7a4d}button.plain{background:#27456f}'
        . 'a{color:#d4a84b}.err{color:#ff9aa8}.ok{color:#9fe3b4}.top{display:flex;justify-content:space-between;align-items:center;gap:1rem}'
        . '.badge{display:inline-block;border-radius:999px;padding:.05rem .65rem;font-size:.75rem;font-weight:700;margin-left:.4rem}'
        . '.b-pending{background:#d4a84b;color:#2a1c00}.b-approved{background:#1f7a4d}.b-denied{background:#8b2344}'
        . '.checks label{display:inline-block;margin:.5rem 1.2rem .3rem 0;cursor:pointer}'
        . '.checks input{width:1.15rem;height:1.15rem;vertical-align:-3px;margin-right:.35rem}'
        . '.flash{padding:.7rem 1rem;border-radius:10px;margin:.7rem 0;background:#123a33;border:1px solid #1f7a4d}'
        . '.flash.bad{background:#3a1220;border-color:#8b2344}'
        . '</style></head><body>';
}

function page_end(string $nonce): void
{
    echo '<script nonce="' . h($nonce) . '">'
        . 'document.querySelectorAll("form[data-confirm],button[data-confirm]").forEach(function(el){'
        . 'var f=el.tagName==="FORM"?el:null;(f||el).addEventListener(f?"submit":"click",function(e){if(!confirm(el.getAttribute("data-confirm"))){e.preventDefault();}});});'
        . 'document.querySelectorAll("input.exclusive").forEach(function(box){box.addEventListener("change",function(){'
        . 'if(box.checked){var other=box.form.querySelector("input.exclusive:not([name=\""+box.name+"\"])");if(other){other.checked=false;}}});});'
        . '</script></body></html>';
}

function login_form(string $self, string $error = ''): void
{
    page_start('Owner page - log in');
    echo '<h1>Owner page</h1><p class="muted">The Holidays Blue Wave</p>';
    if ($error !== '') {
        echo '<p class="err">' . h($error) . '</p>';
    }
    echo '<form method="post" action="' . h($self) . '"><input type="hidden" name="action" value="login">'
        . '<p><input type="password" name="password" autocomplete="current-password" placeholder="Password" required autofocus></p>'
        . '<p><button class="gold" type="submit">Log in</button></p></form></body></html>';
    exit;
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
    if (login_blocked($adminKey)) {
        http_response_code(429);
        login_form($self, 'Too many tries. Please wait 15 minutes.');
    }
    if (hash_equals($adminKey, (string) ($_POST['password'] ?? ''))) {
        session_regenerate_id(true);
        $_SESSION = ['ok' => true, 'seen' => time(), 'csrf' => bin2hex(random_bytes(24))];
        header('Location: ' . $self, true, 303);
        exit;
    }
    http_response_code(403);
    login_form($self, 'Wrong password.');
}

if (!$loggedIn) {
    login_form($self);
}

$csrf = (string) $_SESSION['csrf'];

function find_claim(string $id): ?array
{
    foreach (read_list('claims') as $row) {
        if (($row['id'] ?? '') === $id) {
            return $row;
        }
    }
    return null;
}

function update_claim(string $id, callable $change): void
{
    mutate('claims', function (array &$list) use ($id, $change) {
        foreach ($list as $i => $row) {
            if (($row['id'] ?? '') === $id) {
                $list[$i] = $change($row);
            }
        }
    });
}

function flash(string $text, bool $bad = false): void
{
    $_SESSION['flash'] = ['text' => $text, 'bad' => $bad];
}

if ($method === 'POST') {
    if (!hash_equals($csrf, (string) ($_POST['csrf'] ?? ''))) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        exit('Request refused. Please go back, reload the page and try again.');
    }
    $action = (string) ($_POST['action'] ?? '');
    $id = (string) ($_POST['id'] ?? '');
    $wantsApproved = ($_POST['approved'] ?? '') === '1';
    $wantsDenied = ($_POST['denied'] ?? '') === '1';

    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: ' . $self, true, 303);
        exit;
    }

    if ($action === 'delete') {
        mutate('reviews', function (array &$list) use ($id) {
            $list = array_values(array_filter($list, fn ($r) => ($r['id'] ?? '') !== $id));
        });
    } elseif (in_array($action, ['decide', 'send_approved', 'send_denied', 'revoke'], true)) {
        $claim = find_claim($id);
        if (!$claim) {
            flash('That claim was not found.', true);
        } elseif ($action === 'revoke') {
            mutate('owners', function (array &$list) use ($claim) {
                $list = array_values(array_filter($list, fn ($o) => ($o['claimId'] ?? '') !== $claim['id'] && ($o['partner'] ?? '') !== $claim['partner']));
            });
            update_claim($id, function (array $row) {
                unset($row['activatedAt'], $row['activatedUser'], $row['tokenHash'], $row['tokenExpires']);
                return $row;
            });
            flash('Owner access removed for ' . page_name($claim) . '. Their page content stays as it is.');
        } elseif ($wantsApproved && $wantsDenied) {
            flash('Please tick only one: approved or denied.', true);
        } elseif ($action === 'decide') {
            $status = $wantsApproved ? 'approved' : ($wantsDenied ? 'denied' : 'pending');
            update_claim($id, function (array $row) use ($status) {
                $row['status'] = $status;
                return $row;
            });
            flash('Saved: ' . page_name($claim) . ' is now ' . $status . '.');
        } elseif ($action === 'send_approved') {
            if (!$wantsApproved) {
                flash('Tick "Claim approved" first, then press the button.', true);
            } elseif (!empty($claim['activatedAt'])) {
                flash('This owner already activated the page, so no new approval email is needed.', true);
            } else {
                $token = bin2hex(random_bytes(32));
                $url = site_url($config) . '/activate/' . $token;
                $sent = send_approved_email($claim, $config, $url);
                update_claim($id, function (array $row) use ($token, $sent) {
                    $row['status'] = 'approved';
                    $row['tokenHash'] = hash('sha256', $token);
                    $row['tokenExpires'] = time() + ACTIVATION_DAYS * 86400;
                    if ($sent) {
                        $row['approvedEmailAt'] = gmdate('c');
                    }
                    return $row;
                });
                $sent ? flash('Approved email sent to ' . $claim['email'] . '.') : flash('Approved, but the email could not be sent. Check MAIL_FROM in config.php, then press the button again.', true);
            }
        } elseif ($action === 'send_denied') {
            if (!$wantsDenied) {
                flash('Tick "Claim denied" first, then press the button.', true);
            } else {
                $sent = send_denied_email($claim, $config);
                update_claim($id, function (array $row) use ($sent) {
                    $row['status'] = 'denied';
                    unset($row['tokenHash'], $row['tokenExpires']);
                    if ($sent) {
                        $row['deniedEmailAt'] = gmdate('c');
                    }
                    return $row;
                });
                $sent ? flash('Denied email sent to ' . $claim['email'] . '.') : flash('Denied, but the email could not be sent. Check MAIL_FROM in config.php, then press the button again.', true);
            }
        }
    }
    header('Location: ' . $self, true, 303);
    exit;
}

$claims = array_reverse(read_list('claims'));
$reviews = array_reverse(read_list('reviews'));
$owners = read_list('owners');
$content = read_list('content');
$ownerByPartner = [];
foreach ($owners as $o) {
    $ownerByPartner[$o['partner']] = $o['username'];
}
$counts = ['pending' => 0, 'approved' => 0, 'denied' => 0];
foreach ($claims as $c) {
    $counts[$c['status'] ?? 'pending'] = ($counts[$c['status'] ?? 'pending'] ?? 0) + 1;
}
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);

function ago(string $iso): string
{
    $t = strtotime($iso);
    return $t ? gmdate('j M Y H:i', $t) . ' UTC' : '';
}

page_start('Holidays Blue Wave - owner dashboard');
?>
<div class="top">
  <h1>Owner dashboard</h1>
  <form method="post" action="<?= h($self) ?>">
    <input type="hidden" name="action" value="logout">
    <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
    <button type="submit" class="plain">Log out</button>
  </form>
</div>
<p class="muted">The Holidays Blue Wave &middot;
  <?= $counts['pending'] ?> waiting &middot; <?= $counts['approved'] ?> approved &middot; <?= $counts['denied'] ?> denied</p>

<?php if ($flash): ?>
  <div class="flash<?= $flash['bad'] ? ' bad' : '' ?>"><?= h($flash['text']) ?></div>
<?php endif; ?>

<h2>Claim requests (<?= count($claims) ?>)</h2>
<?php if (!$claims): ?><p class="muted">No requests yet.</p><?php endif; ?>
<?php foreach ($claims as $c):
    $status = (string) ($c['status'] ?? 'pending');
    $activated = !empty($c['activatedAt']);
    $partnerOwner = $ownerByPartner[$c['partner']] ?? null;
    ?>
  <form class="card" method="post" action="<?= h($self) ?>">
    <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
    <input type="hidden" name="id" value="<?= h($c['id']) ?>">
    <strong><?= h($c['partnerName'] ?: $c['partner']) ?></strong>
    <span class="muted">&middot; <?= h(claim_number($c)) ?></span>
    <span class="badge b-<?= h($status) ?>"><?= h(strtoupper($status)) ?></span>
    <?php if ($activated): ?><span class="badge b-approved">PAGE ACTIVATED</span><?php endif; ?>
    <div class="muted"><?= h($c['partner']) ?> &middot; asked on <?= h(ago((string) $c['created'])) ?></div>
    <p style="margin:.5rem 0 0">
      <?= h($c['ownerName']) ?> &middot;
      <a href="mailto:<?= h($c['email']) ?>"><?= h($c['email']) ?></a>
      <?php if ($c['phone']): ?> &middot; <?= h($c['phone']) ?><?php endif; ?>
    </p>
    <?php if ($c['message']): ?><p style="margin:.4rem 0 0"><?= nl2br(h($c['message'])) ?></p><?php endif; ?>
    <p class="muted" style="margin:.4rem 0 0">
      Thank-you email: <?= !empty($c['confirmationSent']) ? 'sent' : 'NOT sent' ?>
      <?php if (!empty($c['approvedEmailAt'])): ?> &middot; Approved email sent <?= h(ago((string) $c['approvedEmailAt'])) ?><?php endif; ?>
      <?php if (!empty($c['deniedEmailAt'])): ?> &middot; Denied email sent <?= h(ago((string) $c['deniedEmailAt'])) ?><?php endif; ?>
      <?php if ($activated): ?> &middot; Username: <strong><?= h($c['activatedUser'] ?? $partnerOwner) ?></strong>, activated <?= h(ago((string) $c['activatedAt'])) ?><?php endif; ?>
    </p>
    <div class="checks">
      <label><input class="exclusive" type="checkbox" name="approved" value="1" <?= $status === 'approved' ? 'checked' : '' ?>>Claim approved</label>
      <label><input class="exclusive" type="checkbox" name="denied" value="1" <?= $status === 'denied' ? 'checked' : '' ?>>Claim denied</label>
    </div>
    <div>
      <button type="submit" name="action" value="decide" class="plain">Save decision</button>
      <button type="submit" name="action" value="send_approved" class="green"
        data-confirm="Send the APPROVED email to <?= h($c['email']) ?>? It includes the fee and a link to activate the page.">Send approved email</button>
      <button type="submit" name="action" value="send_denied"
        data-confirm="Send the DENIED email to <?= h($c['email']) ?>?">Send denied email</button>
      <?php if ($activated || $partnerOwner): ?>
        <button type="submit" name="action" value="revoke" class="plain"
          data-confirm="Remove owner access for this page? The owner can no longer log in.">Remove owner access</button>
      <?php endif; ?>
    </div>
  </form>
<?php endforeach; ?>

<h2>Pages edited by owners (<?= count($content) ?>)</h2>
<?php if (!$content): ?><p class="muted">No owner has changed a page yet.</p><?php endif; ?>
<?php foreach ($content as $partner => $entry): ?>
  <div class="card">
    <strong><?= h($partner) ?></strong>
    <span class="muted"> &middot; owner: <?= h($ownerByPartner[$partner] ?? 'none') ?> &middot; last change <?= h(ago((string) ($entry['updated'] ?? ''))) ?>
      &middot; <?= count($entry['gallery'] ?? []) ?> extra photos</span>
  </div>
<?php endforeach; ?>

<h2>Reviews (<?= count($reviews) ?>)</h2>
<?php if (!$reviews): ?><p class="muted">No reviews yet.</p><?php endif; ?>
<?php foreach ($reviews as $r): ?>
  <div class="card">
    <strong><?= h($r['partner']) ?></strong> - <?= str_repeat('★', (int) $r['rating']) . str_repeat('☆', 5 - (int) $r['rating']) ?>
    <span class="muted"> - <?= h($r['name']) ?> - <?= h($r['created']) ?></span>
    <p><?= nl2br(h($r['text'])) ?></p>
    <form method="post" action="<?= h($self) ?>" data-confirm="Delete this review?">
      <input type="hidden" name="action" value="delete">
      <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
      <input type="hidden" name="id" value="<?= h($r['id']) ?>">
      <button type="submit">Delete</button>
    </form>
  </div>
<?php endforeach; ?>
<?php page_end($nonce); ?>
