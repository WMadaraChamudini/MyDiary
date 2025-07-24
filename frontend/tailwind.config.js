/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors (lighter shades)
        'pastel-purple-bg': '#D4BFFF',
        'lavender-bg': '#E6E6FA',
        'muted-purple-bg': '#C3B1E1',
        'dark-pastel-purple-bg': '#A084CA',
        // Text colors (darker)
        'pastel-purple-text': '#B19CD9',
        'lavender-text': '#D4C4E4',
        'muted-purple-text': '#A68BC7',
        'dark-pastel-purple-text': '#8A6BB1',
      },
    },
  },
  plugins: [],
}