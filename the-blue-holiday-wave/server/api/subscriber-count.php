<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

/**
 * Public subscriber total for the Stay Updated counter.
 * Combines Render (full list) and Bluehost (local list); returns the higher count.
 */
function fetch_json_count(string $url): ?int
{
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 10,
            'header' => "Accept: application/json\r\n",
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false || $raw === '') {
        return null;
    }
    if ($raw[0] === '<') {
        return null;
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return null;
    }
    $value = $data['count'] ?? $data['subscriberCount'] ?? $data['subscribers'] ?? null;
    if (is_numeric($value)) {
        $n = (int) $value;
        return $n >= 0 ? $n : null;
    }
    return null;
}

$sources = [
    'https://the-blue-wave.onrender.com/api/subscriber-count',
    'https://www.thebluewavefans.com/thebluewave-subscribers/count.php',
];

$counts = [];
foreach ($sources as $source) {
    $n = fetch_json_count($source);
    if ($n !== null && $n >= 1000) {
        $counts[] = $n;
    }
}

if ($counts === []) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'count_unavailable'], JSON_UNESCAPED_UNICODE);
    exit;
}

$best = max($counts);
echo json_encode(
    ['ok' => true, 'count' => $best, 'subscriberCount' => $best],
    JSON_UNESCAPED_UNICODE,
);