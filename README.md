# Canary Cove navbar structure

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/enzo-design-prisms-projects/v0-canary-cove-navbar-structure)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/nmVYxB63RfA)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/enzo-design-prisms-projects/v0-canary-cove-navbar-structure](https://vercel.com/enzo-design-prisms-projects/v0-canary-cove-navbar-structure)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/nmVYxB63RfA](https://v0.app/chat/nmVYxB63RfA)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local Development

Even though the project syncs from v0, contributors often iterate locally before pushing updates. Common workflow:

```bash
pnpm install
pnpm dev
```

If you prefer `npm`:

```bash
npm install
npm run dev
```

- The dev server may pick a different port if `3000` is occupied; watch the CLI output.
- Fonts are loaded via `next/font/local` from `font/`. Ensure those files exist before running `next build`.
- Navigation content is defined in `lib/nav-items.ts` inside the `NAV_ITEMS` array. Edit that array when IA changes instead of touching JSX directly.
- Desktop and mobile navs live in `components/navigation/desktop-nav.tsx` and `components/navigation/mobile-nav.tsx`, while `components/header.tsx` just composes them. Desktop dropdowns rely on internal hover state (no Radix), so labels must stay unique.
- All leaf pages (Stay, Dining, etc.) render through `components/basic-page.tsx`, which includes the header, shared carousel, and footer. To add a new page, create `app/<segment>/page.tsx` that returns `<BasicPage title="Your Title" />`.
- Both `app/globals.css` and `styles/globals.css` define color tokens; change them in tandem if you adjust the Canary-yellow palette.
- The hero section streams a Cloudinary video—if you are offline, swap in a local MP4 or update the `poster` image so the section still renders.
