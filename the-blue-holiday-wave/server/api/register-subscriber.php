<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';

$config = api_boot();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Use POST with JSON: {"email":"you@example.com","source":"holidays-blue-wave"}');
}

$data = body();
$email = strtolower(trim((string) ($data['email'] ?? '')));
$source = trim((string) ($data['source'] ?? 'holidays-blue-wave'));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(400, 'Please enter a valid email address.');
}

/**
 * @return list<string>
 */
function subscriber_store_paths(): array
{
    $docRoot = (string) ($_SERVER['DOCUMENT_ROOT'] ?? '');
    $paths = [
        $docRoot . '/thebluewave-subscribers/data/subscribers.json',
        $docRoot . '/thebluewave-subscribers/subscribers.json',
        dirname($docRoot) . '/thebluewave-subscribers/data/subscribers.json',
    ];
    $out = [];
    foreach ($paths as $path) {
        if ($path !== '' && !in_array($path, $out, true)) {
            $out[] = $path;
        }
    }
    return $out;
}

function is_test_subscriber_email(string $email): bool
{
    $tests = [
        'madmax.zebra@gmail.com',
        'madmax@zebra-onlinedesign.com',
        'madmax1@zebra-onlinedesign.com',
        'bluenation@thebluewavefans.com',
        'verify-test@thebluewavefans.com',
        'welcome-diagnostic-test@example.com',
        'welcome-diagnostic-test2@example.com',
    ];
    if (in_array($email, $tests, true)) {
        return true;
    }
    return str_ends_with($email, '@example.com') || str_ends_with($email, '@thebluewavefans.com');
}

/**
 * @return array{path:string,subscribers:list<array<string,mixed>>}|null
 */
function load_subscriber_store(): ?array
{
    foreach (subscriber_store_paths() as $path) {
        if (!is_file($path)) {
            continue;
        }
        $raw = @file_get_contents($path);
        if ($raw === false || $raw === '') {
            return ['path' => $path, 'subscribers' => []];
        }
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return ['path' => $path, 'subscribers' => []];
        }
        if (isset($decoded['subscribers']) && is_array($decoded['subscribers'])) {
            return ['path' => $path, 'subscribers' => $decoded['subscribers']];
        }
        if (array_is_list($decoded)) {
            return ['path' => $path, 'subscribers' => $decoded];
        }
        return ['path' => $path, 'subscribers' => []];
    }
    return null;
}

/**
 * @param list<array<string,mixed>> $subscribers
 */
function save_subscriber_store(string $path, array $subscribers): bool
{
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $payload = json_encode(
        ['subscribers' => $subscribers, 'updatedAt' => gmdate('c')],
        JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT,
    );
    if ($payload === false) {
        return false;
    }
    $tmp = $path . '.tmp-' . bin2hex(random_bytes(4));
    if (@file_put_contents($tmp, $payload, LOCK_EX) === false) {
        return false;
    }
    return @rename($tmp, $path);
}

function fetch_bluehost_public_count(): ?int
{
    $url = 'https://www.thebluewavefans.com/thebluewave-subscribers/count.php';
    $raw = @file_get_contents($url);
    if ($raw === false || $raw === '') {
        return null;
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return null;
    }
    $value = $data['count'] ?? $data['subscriberCount'] ?? null;
    return is_numeric($value) ? (int) $value : null;
}

$store = load_subscriber_store();
if ($store === null) {
    fail(503, 'Subscriber list not reachable from this server. Use thebluewave-subscribers/register.php or upload register fix.');
}

$subscribers = $store['subscribers'];
$added = true;
foreach ($subscribers as $row) {
    if (!is_array($row)) {
        continue;
    }
    $existing = strtolower(trim((string) ($row['email'] ?? '')));
    if ($existing === $email) {
        $added = false;
        break;
    }
}

if ($added) {
  if ($source === '') {
      $source = 'holidays-blue-wave';
  }
    $subscribers[] = [
        'email' => $email,
        'createdAt' => gmdate('c'),
        'source' => $source,
    ];
    if (!is_test_subscriber_email($email)) {
        if (!save_subscriber_store($store['path'], $subscribers)) {
            fail(500, 'Could not save subscriber.');
        }
    }
}

$count = fetch_bluehost_public_count();
if ($count === null) {
    $real = 0;
    foreach ($subscribers as $row) {
        if (!is_array($row)) {
            continue;
        }
        $rowEmail = strtolower(trim((string) ($row['email'] ?? '')));
        if ($rowEmail !== '' && !is_test_subscriber_email($rowEmail)) {
            $real++;
        }
    }
    $count = 5155 + $real;
}

echo json_encode([
    'ok' => true,
    'added' => $added,
    /** Holidays welcome is sent by api/send-welcome.php (not the old World Cup mail). */
    'welcomeSent' => false,
    'count' => $count,
    'subscriberCount' => $count,
], JSON_UNESCAPED_UNICODE);