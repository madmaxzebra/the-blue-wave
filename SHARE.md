# The Blue Wave – Share / Tunnel

**Project path:** `g:\projects-2026\wk-magazine\bluewave`

## Share publicly (Cloudflare tunnel)

```bash
cd g:\projects-2026\wk-magazine\bluewave
npm run tunnel
```

This **builds** the frontend, then starts backend + share server + tunnel. The external link uses the built app (not the dev server), so it works correctly through the tunnel. After a few seconds, **Cloudflare prints a real URL** in the terminal, for example:

```
https://a1b2c3d4-e5f6-7890-abcd.trycloudflare.com
```

**Copy that exact URL from the terminal** – don’t type “your-new-url” or any placeholder. Use it like this:

- Landing page: `https://PASTE-THE-REAL-URL-HERE/#stay-tuned`
- Share & Win: `https://PASTE-THE-REAL-URL-HERE/#share-raffle`

---

## Run locally (no tunnel)

```bash
cd g:\projects-2026\wk-magazine\bluewave
npm run dev
```

Then open: http://localhost:5174/#stay-tuned
