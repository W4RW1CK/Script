/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light mode
        'script-bg': '#F8F6F2',
        'script-bg-secondary': '#EFEFEA',
        'script-bg-elevated': '#FFFFFF',
        'script-text': '#2D2D2D',
        'script-text-secondary': '#6B6B6B',
        'script-blue': '#A8C5DA',
        'script-green': '#B8DABC',
        'script-peach': '#F2C9B0',
        'script-lavender': '#C4B8DA',
        'script-crisis': '#F5EFEF',
        'script-crisis-soft': '#E8C4C4',
        'script-border': '#E0DDD8',
        // Dark mode
        'script-dark-bg': '#1C1C22',
        'script-dark-secondary': '#26262E',
        'script-dark-blue': '#5A7E92',
        'script-dark-crisis': '#221E1E',
      },
    },
  },
  plugins: [],
}
