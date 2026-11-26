# Cynbit Technologies — Enterprise Platform 2.0 & AI Workspace Upgrade

> **Full Stack Developer Intern Technical Assessment**
> **Candidate:** Tamiri Sai Vaibhav | **Institution:** Raghu Engineering College, Visakhapatnam
> **Application Reference Code:** `cmwubpppx001107l9g90prbqu` | **Assessment Date:** November 2026

An end-to-end UX, architectural and functional re-engineering of **Cynbit Technologies'** digital platform, preserving the brand's **Mint-Teal (`#056368`)** identity while turning static marketing sections into an interactive Enterprise SaaS showcase, developer playground, BitElevate cohort portal and AI studio.

| Deliverable | Artifact |
| :--- | :--- |
| Source code repository | This repository (React 18 + TypeScript + Vite + Tailwind) |
| Live working prototype | Deployed SPA (Vercel / Netlify) |
| Technical report | [`TECHNICAL_REPORT.md`](./TECHNICAL_REPORT.md) |

## Tech Stack

React 18 · TypeScript · Vite 6 · Tailwind CSS 3 · lucide-react · Google Gemini API (with deterministic offline fallback) · Firebase (optional live sync, falls back to local session)

## Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── netlify.toml / vercel.json
├── .env.example
├── .gitignore
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── vite-env.d.ts
```

## Local Setup

```bash
npm install
cp .env.example .env      # then put your real key inside .env
npm run dev
```

## Environment Variable

| Name | Purpose |
| :--- | :--- |
| `VITE_GEMINI_API_KEY` | Google Gemini API key. If missing, the app uses its built-in fallback responses. |

Never commit `.env`. On Vercel/Netlify, add the variable in the project's Environment Variables settings and redeploy.

## Deployment

**Vercel:** Import the repo → Framework preset *Vite* → add `VITE_GEMINI_API_KEY` → Deploy.
**Netlify:** Import the repo → build settings come from `netlify.toml` → add `VITE_GEMINI_API_KEY` → Deploy.

## Author

**Tamiri Sai Vaibhav** — B.Tech CSE, Raghu Engineering College, Visakhapatnam
Email: `sai1304tamiri@gmail.com` | GitHub: [@saivaibhavtamiri1306](https://github.com/saivaibhavtamiri1306)
