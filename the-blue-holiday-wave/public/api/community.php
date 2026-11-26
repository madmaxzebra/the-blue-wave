<?php
declare(strict_types=1);

// Reviews and "claim this page" requests for The Blue Holiday Wave.
// Plain PHP + JSON files, so it runs on normal shared hosting (Bluehost).
//   GET  community.php?action=reviews&partner=<id>   -> reviews + average
//   POST community.php?action=review                 -> leave a review (1-5 stars)
//   POST community.php?action=claim                  -> owner asks to claim a page

require __DIR__ . '/common.php';
$config = api_boot();

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
