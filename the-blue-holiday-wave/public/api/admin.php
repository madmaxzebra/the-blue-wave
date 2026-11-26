<?php
declare(strict_types=1);

// Simple owner page: see claim requests and reviews, delete a review.
// Open:  https://<site>/holidayseason/api/admin.php?key=YOUR_ADMIN_KEY
// The key lives in api/config.php on the server (copy config.sample.php). Without it this page is off.

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

$config = is_file(__DIR__ . '/config.php') ? (include __DIR__ . '/config.php') : [];
$adminKey = is_array($config) ? (string) ($config['ADMIN_KEY'] ?? '') : '';
$given = (string) ($_GET['key'] ?? $_POST['key'] ?? '');

if (strlen($adminKey) < 12) {
    http_response_code(503);
    exit('Admin is off. Create api/config.php with an ADMIN_KEY of at least 12 characters.');
}
if (!hash_equals($adminKey, $given)) {
    http_response_code(403);
    exit('Wrong key.');
}

function read_list(string $name): array
{
    $path = __DIR__ . '/data/' . $name . '.json';
    $list = is_file($path) ? json_decode((string) file_get_contents($path), true) : [];
    return is_array($list) ? $list : [];
}

function h(mixed $v): string
{
    return htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['delete'] ?? '') !== '') {
    $id = (string) $_POST['delete'];
    $path = __DIR__ . '/data/reviews.json';
    $handle = fopen($path, 'c+');
    if ($handle && flock($handle, LOCK_EX)) {
        $list = json_decode((string) stream_get_contents($handle), true);
        $list = array_values(array_filter(is_array($list) ? $list : [], fn ($r) => ($r['id'] ?? '') !== $id));
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($list, JSON_UNESCAPED_UNICODE));
        flock($handle, LOCK_UN);
        fclose($handle);
    }
    header('Location: admin.php?key=' . rawurlencode($adminKey));
    exit;
}

$claims = array_reverse(read_list('claims'));
$reviews = array_reverse(read_list('reviews'));
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Blue Holiday Wave - owner page</title>
<style>
  body { font-family: system-ui, sans-serif; background: #061833; color: #f7f3ec; margin: 0; padding: 1rem; }
  h1 { color: #d4a84b; } h2 { color: #d4a84b; margin-top: 2rem; }
  .card { background: #0e284f; border: 1px solid rgba(212,168,75,.3); border-radius: 12px; padding: .8rem 1rem; margin: .6rem 0; }
  .muted { color: rgba(247,243,236,.7); font-size: .85rem; }
  button { background: #8b2344; color: #fff; border: 0; border-radius: 999px; padding: .35rem .9rem; cursor: pointer; }
  a { color: #d4a84b; }
</style>
</head>
<body>
<h1>Blue Holiday Wave - owner page</h1>

<h2>Claim requests (<?= count($claims) ?>)</h2>
<?php if (!$claims): ?><p class="muted">No requests yet.</p><?php endif; ?>
<?php foreach ($claims as $c): ?>
  <div class="card">
    <strong><?= h($c['partnerName'] ?: $c['partner']) ?></strong>
    <span class="muted"> - <?= h($c['partner']) ?> - <?= h($c['created']) ?></span><br>
    <?= h($c['ownerName']) ?> -
    <a href="mailto:<?= h($c['email']) ?>"><?= h($c['email']) ?></a>
    <?php if ($c['phone']): ?> - <?= h($c['phone']) ?><?php endif; ?>
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
    <form method="post" onsubmit="return confirm('Delete this review?')">
      <input type="hidden" name="key" value="<?= h($adminKey) ?>">
      <input type="hidden" name="delete" value="<?= h($r['id']) ?>">
      <button type="submit">Delete</button>
    </form>
  </div>
<?php endforeach; ?>
</body>
</html>
