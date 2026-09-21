# StatSigCalculator — A/B Test Statistical Significance & Sample Size Calculator

[![Live](https://img.shields.io/badge/Live-tewei02.github.io%2FStatSigCalculator-6366f1?logo=github)](https://tewei02.github.io/StatSigCalculator/)
[![React](https://img.shields.io/badge/React-19-%2361DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-%23646CFF?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive statistical significance calculator for A/B testing. Instantly determine the minimum sample size required for your experiments—no more guessing.

**Live app:** <https://tewei02.github.io/StatSigCalculator/>

## Features

- **Sample Size Calculation** — Compute required sample size based on baseline conversion rate, minimum detectable effect (MDE), significance level (alpha), and statistical power
- **Real-Time Results** — Parameters update instantly as you adjust sliders
- **Interpretation Guide** — Plain-language explanation of what the numbers mean for your experiment
- **Responsive Design** — Works on desktop and mobile
- **Installable PWA** — Add to home screen and use it offline; the calculator is fully client-side, so no data ever leaves the device

## Statistical Parameters

| Parameter | Description | Typical Value |
|-----------|-------------|----------------|
| Alpha (α) | Type I error rate — probability of false positive | 0.05 |
| Power (1-β) | Probability of detecting a true effect | 0.80 |
| Baseline Rate | Current conversion rate | e.g. 10% |
| MDE | Minimum detectable effect (absolute lift) | e.g. 2% |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Processing | PostCSS + Autoprefixer |
| Delivery | GitHub Pages + Service Worker (offline shell) |

## Quick Start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deployment

Every push to `main` triggers `.github/workflows/pages.yml`, which builds the app with Vite and publishes the `dist/` output to GitHub Pages. The Vite `base` is set to `/StatSigCalculator/` to match the repository name; the manifest and service worker use relative paths so they keep working under that sub-path.

## Project Structure

```
StatSigCalculator/
├── src/
│   ├── App.tsx          # Main application logic
│   ├── main.tsx         # Entry point + service worker registration
│   └── index.css        # Global styles
├── public/
│   ├── icons/           # PWA + favicon assets (192/512/apple-touch/32)
│   ├── favicon.svg
│   ├── manifest.json    # Web app manifest
│   └── sw.js            # Offline-first service worker
├── .github/workflows/
│   ├── ci.yml           # Lint + build check
│   └── pages.yml        # Build & deploy to GitHub Pages
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## License

MIT
