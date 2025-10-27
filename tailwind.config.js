/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'google-blue': '#4285F4',
        'success-green': '#34A853',
        'dark-grey': '#202124',
        'warning-red': '#EA4335',
        'input-border': '#DADCE0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
