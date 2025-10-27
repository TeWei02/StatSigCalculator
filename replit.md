# A/B Test Sample Size Calculator

## Overview
A professional web-based calculator that helps determine the required number of participants for statistically significant A/B test experiments. The calculator features a clean, Google-inspired interface with real-time calculations and helpful tooltips.

## Purpose & Goals
- Provide accurate sample size calculations for A/B testing experiments
- Offer an intuitive, user-friendly interface inspired by Google's design language
- Display real-time results as users adjust parameters
- Educate users about statistical assumptions and best practices

## Features
1. **Input Parameters**
   - Baseline Conversion Rate (%)
   - Minimum Detectable Effect (%)
   - Statistical Power (%)
   - Significance Level (%)

2. **Real-time Calculations**
   - Sample size per variation
   - Total participants needed
   - Automatic recalculation on input change

3. **User Experience**
   - Interactive tooltips explaining each parameter
   - Clean, centered form layout
   - Prominent result display with gradient background
   - Detailed explanation of statistical assumptions

4. **Design System**
   - Primary Color: #4285F4 (Google blue)
   - Secondary Color: #34A853 (success green)
   - Background: #FFFFFF (white)
   - Text: #202124 (dark grey)
   - Accent: #EA4335 (warning red)
   - Input Borders: #DADCE0 (light grey)
   - Typography: Inter font family
   - Spacing: 24px standard spacing

## Technical Architecture

### Tech Stack
- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.1.12
- **Styling**: Tailwind CSS 4.1.16
- **Font**: Inter (Google Fonts)

### Project Structure
```
/
├── src/
│   ├── App.tsx          # Main calculator component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind theme customization
├── postcss.config.js    # PostCSS with Tailwind plugin
└── package.json         # Dependencies and scripts
```

### Statistical Methodology
The calculator uses the **two-proportion z-test** formula to determine sample size:

- **Formula**: Based on pooled variance approach
- **Test Type**: Two-tailed test (detects both positive and negative effects)
- **Assumptions**:
  - Independent observations
  - Binomial distribution
  - Equal sample size allocation
  - Fixed significance level (alpha) and power (1-beta)

### Key Implementation Details
1. **Z-score Calculation**: Uses inverse error function for precise z-scores
2. **Real-time Updates**: useEffect hook recalculates on input changes
3. **Input Validation**: Ensures values are numeric and non-negative
4. **Responsive Design**: Grid layout adapts to mobile and desktop screens

## Development

### Available Scripts
- `npm run dev` - Start development server on port 5000
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Configuration Notes
- Server binds to 0.0.0.0:5000 for Replit compatibility
- Tailwind CSS v4 uses @import syntax and @tailwindcss/postcss plugin
- TypeScript strict mode enabled for type safety

## Recent Changes
- **October 27, 2025**: Initial project creation
  - Set up React + TypeScript + Vite + Tailwind CSS
  - Implemented calculator with statistical formulas
  - Created Google-inspired UI with custom color scheme
  - Added interactive tooltips and explanations
  - Configured development workflow

## Future Enhancements (Potential)
- Export results to PDF or CSV
- Historical calculations saved in local storage
- Multiple test variations (not just A/B, but A/B/C/D)
- Advanced statistical options (one-tailed tests, unequal allocation)
- Sample size calculator for other metrics (mean differences, proportions)
- Interactive graphs showing power curves
- Integration with analytics platforms
