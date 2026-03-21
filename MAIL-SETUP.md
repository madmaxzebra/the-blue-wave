# Blue Wave – Mail Setup

## Option 0: Use Manus (no local mail config)

Set in `backend/.env`:
```
MANUS_API_URL=https://bluewave-ygrtexhd.manus.space
```

The subscribe form is proxied to Manus; they send the thank you and confirmation emails. No Gmail or Resend needed.

## Option 1: Gmail (easiest)

1. Enable 2-step verification on your Gmail: [Google Account Security](https://myaccount.google.com/security)

2. Create an App Password: [App Passwords](https://myaccount.google.com/apppasswords)  
   - Select "Mail" and your device, then copy the 16-character password

3. In `backend/.env`, comment out Resend and set Gmail (use your real Gmail and App Password):
   ```
   # RESEND_API_KEY=...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yourname@gmail.com
   SMTP_PASS=abcdefghijklmnop
   ADMIN_EMAIL=yourname@gmail.com
   ```
   Use the 16-character App Password (spaces optional). Not your normal Gmail password.

4. Restart the tunnel.

## Option 2: Resend (requires domain verification)

1. Get an API key from [resend.com](https://resend.com) and add to `backend/.env`

2. Verify your domain at [resend.com/domains](https://resend.com/domains) – add the DNS records to your domain

3. Set `RESEND_FROM="The Blue Wave <hello@zebra-onlinedesign.com>"`

## Troubleshooting

- **Gmail: "Invalid credentials"** – Use an App Password, not your normal Gmail password.
- **Check backend logs** – Look for `[Mail]` messages when subscribing.
