<?php
declare(strict_types=1);

// Shared helpers for the reviews, claims and owner server files.

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

/** Sends the standard JSON headers, loads config.php, and refuses other websites. Returns the config. */
function api_boot(): array
{
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    header('Vary: Origin');

    $config = is_file(__DIR__ . '/config.php') ? (include __DIR__ . '/config.php') : [];
    if (!is_array($config)) {
        $config = [];
    }

    if (!origin_allowed($config)) {
        http_response_code(403);
        echo json_encode(['error' => 'This website is not allowed to use this service.']);
        exit;
    }

    $requestOrigin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($requestOrigin !== '') {
        header('Access-Control-Allow-Origin: ' . $requestOrigin);
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: content-type, x-csrf');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    return $config;
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

/** A unique, easy-to-read claim number such as BHW-26-7F3A9C. Checked against every claim so far. */
function new_claim_number(): string
{
    $taken = array_column(read_list('claims'), 'number');
    do {
        $number = 'BHW-' . gmdate('y') . '-' . strtoupper(bin2hex(random_bytes(3)));
    } while (in_array($number, $taken, true));
    return $number;
}

function body(int $max = MAX_BODY_BYTES): array
{
    $raw = file_get_contents('php://input', false, null, 0, $max + 1);
    if ($raw === false || strlen($raw) > $max) {
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

