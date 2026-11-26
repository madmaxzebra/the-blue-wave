<?php
// Copy this file to config.php on the server (same folder) and fill it in.
// config.php stays on the server only. Never put the real one in GitHub.
return [
    // Long random password for api/admin.php (at least 12 characters)
    'ADMIN_KEY' => 'change-me-to-a-long-random-password',
    // Where claim requests are emailed (leave empty to only store them)
    'ADMIN_EMAIL' => '',
];
