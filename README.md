# StatSigCalculator — A/B Test Statistical Significance & Sample Size Calculator

[![React](https://img.shields.io/badge/React-19-%2361DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-%23646CFF?logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive statistical significance calculator for A/B testing. Instantly determine the minimum sample size required for your experiments—no more guessing.

## Features

- **Sample Size Calculation** — Compute required sample size based on baseline conversion rate, minimum detectable effect (MDE), significance level (alpha), and statistical power
- **Real-Time Results** — Parameters update instantly as you adjust sliders
- **Interpretation Guide** — Plain-language explanation of what the numbers mean for your experiment
- **Responsive Design** — Works on desktop and mobile

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

## Project Structure

```
StatSigCalculator/
├── src/
│   ├── App.tsx          # Main application logic
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/
│   └── manifest.json
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## License

MIT
