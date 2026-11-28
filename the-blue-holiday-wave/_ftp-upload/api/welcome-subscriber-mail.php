<?php
declare(strict_types=1);

/** Welcome email when someone joins Stay Updated on the Holidays Wave site. */

const HOLIDAY_WAVE_LAUNCH_LABEL = '10 December 2026';

function welcome_subscriber_subject(): string
{
    return 'Welcome to the Blue Holidays Wave ✨';
}

function welcome_subscriber_logo_url(string $siteUrl): string
{
    return rtrim($siteUrl, '/') . '/holiday-media/holidays-blue-wave-logo.png';
}

function welcome_subscriber_text(string $email, string $siteUrl): string
{
    $site = rtrim($siteUrl, '/');
    $lines = [
        'Welcome to the Blue Holidays Wave!',
        '',
        "Thank you for joining us — you're on the list with: {$email}",
        '',
        'This season we are gathering the best of Curaçao in one place: Fashion & Lifestyle, Real Estate, and Culinair — real partners, real photos, and stories you can trust for the holidays.',
        '',
        'We go fully live on ' . HOLIDAY_WAVE_LAUNCH_LABEL . '. Until then, you can already wander the guide and see what is coming.',
        '',
        'Open the Holidays Wave:',
        $site . '/',
        '',
        'We will send you a note when new partners and highlights go live. No spam — just the good stuff for the season.',
        '',
        'Warm regards,',
        'The Holidays Blue Wave Team',
        'Curaçao',
        '',
        "© 2026 The Holidays Blue Wave · {$site}",
    ];
    return implode("\n", $lines);
}

function welcome_subscriber_html(string $email, string $siteUrl): string
{
    $safeEmail = mail_e($email);
    $site = rtrim($siteUrl, '/');
    $logo = mail_e(welcome_subscriber_logo_url($site));
    $home = mail_e($site . '/');

    $inner = mail_row(
        '<p style="text-align:center;margin:0;">'
        . '<img src="' . $logo . '" alt="The Holidays Blue Wave" width="300" '
        . 'style="max-width:92%;height:auto;display:block;margin:0 auto;" />'
        . '</p>',
        '0 20px 8px',
    )
        . mail_row(
            '<h1 style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:22px;line-height:1.35;color:#ffffff;text-align:center;">'
            . 'You&rsquo;re on the list for the holidays in Cura&ccedil;ao</h1>',
            '8px 28px 0',
        )
        . mail_row(
            '<p style="margin:0;font-size:16px;line-height:1.65;color:#f7f3ec;">'
            . 'Thank you for joining the <strong style="color:#ffffff;">Blue Holidays Wave</strong>. '
            . 'We registered you with <strong style="color:#d4a84b;">' . $safeEmail . '</strong>.</p>',
            '16px 28px 0',
        )
        . mail_row(
            '<p style="margin:0;font-size:16px;line-height:1.65;color:#cdd6e6;">'
            . 'Think of it as your holiday guide to the island: fashion and lifestyle, homes and stays, and the restaurants '
            . 'worth booking before the season fills up. Real local names — not a generic list.</p>',
            '14px 28px 0',
        )
        . mail_row(
            mail_benefits([
                ['Fashion & Lifestyle', 'Boutiques and brands we photographed for the season.'],
                ['Real Estate', 'Homes and partners for visitors planning a longer stay.'],
                ['Culinair', 'Tables, terraces, and flavours — including spots you may not know yet.'],
            ]),
            '18px 28px 0',
        )
        . mail_row(
            '<p style="margin:0;font-size:15px;line-height:1.6;color:#cdd6e6;">'
            . 'We spotlight the guide on <strong style="color:#ffffff;">' . mail_e(HOLIDAY_WAVE_LAUNCH_LABEL) . '</strong>. '
            . 'You can explore early now; we will email you when big updates land.</p>',
            '18px 28px 0',
        )
        . mail_row('<p style="text-align:center;margin:0;">' . mail_button($home, 'Explore the Holidays Wave') . '</p>', '22px 28px 0')
        . mail_row(
            '<p style="margin:0;font-size:14px;line-height:1.55;color:#8fa0bd;text-align:center;">'
            . 'One list, one season — we keep it useful and easy to read.</p>',
            '20px 28px 0',
        );

  $footer = 'Questions? Reply to this email — a real person reads it.<br>'
        . 'The Holidays Blue Wave Team &middot; Cura&ccedil;ao';

    return mail_shell(
        'Welcome to the Blue Holidays Wave',
        'You are on the list for Fashion, Homes, and Culinair this holiday season in Curaçao.',
        $inner,
        $footer,
    );
}