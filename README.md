<div align="center">

# TechRoad Portfolio
Minimal, dark bento-grid portfolio — smooth animations, canvas grain, direct-send contact form. No third-party service, no limits.

![storage](https://img.shields.io/badge/storage-JSON-f2f3f5)
[![Programming Used](https://skillicons.dev/icons?i=html,css,js,nodejs)](https://skillicons.dev)
![contact](https://img.shields.io/badge/contact-direct%20SMTP-c0392b)

</div>

<div align="center">

## Screenshots
</div>

| | |
|---|---|
| ![Hero](public/assets/avatar.png) | ![Cover](public/assets/cover.jpg) |
| ![Contact](public/assets/cover.jpg) | ![Theme](public/assets/avatar.png) |

<div align="center">

## Features
</div>

**Bento Grid** — avatar (span 2 rows), about, cover, stack marquee, links. Fully responsive.

**Animations** — fade-in on scroll (`IntersectionObserver`), card lift + shadow, chip micro-interactions, infinite tech marquee, theme transition.

**Theme** — dark / light toggle, `localStorage`, canvas re-draw per theme.

**Contact Form** — Name (required), Email (required), Phone (optional), Message (required), inline validation, loader, success/error states. Sends via your Gmail SMTP with custom HTML.

**Demo Mode** — runs without config for local testing.

<div align="center">

## Setup
</div>

```bash
git clone <your-repo-url>
cd updated_version
npm install
cp config.example.js config.js   # then edit it
npm start
```

Enable in Gmail:

- **2-Step Verification** (https://myaccount.google.com/signinoptions/two-step-verification)
- **App Password** (https://myaccount.google.com/apppasswords) → Mail → Other → "Portfolio" → Generate

<div align="center">

## Configuration
</div>

`config.js`

| Key | Description |
|---|---|
| `EMAIL` | Your Gmail — where you receive messages |
| `APP_PASSWORD` | 16-letter Gmail App Password — never commit the real one |
| `PORT` | Server port (default `3000`, auto tries `3001` if busy) |

`public/` is served statically. `GET /api/config` returns your email for the footer.

<div align="center">

## Storage
</div>

No database. Everything is flat files. `public/` holds the frontend, `config.js` holds your credentials (gitignored). Back up the folder and you backed up the site.

<div align="center">

## Notes
</div>

- Port `3000` busy → auto tries `3001`, `3002`... check console for actual URL.
- Demo mode if `config.js` not filled — form shows `demo mode` and logs to console.
- Email: `From: "Visitor via Portfolio" <you@gmail.com>`, `Reply-To: visitor@email.com`, custom HTML + text.
- Add `config.js` to `.gitignore` — use env vars in production (`process.env.EMAIL`).

<div align="center">

## Credits

Made by **TechRoad Inc.** © 2026/2027 — All Rights Reserved.

</div>
