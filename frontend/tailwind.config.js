/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'pastel-purple-bg': '#D4BFFF',
        'lavender-bg': '#E6E6FA',
        'muted-purple-bg': '#C3B1E1',
        'dark-pastel-purple-bg': '#A084CA',
        // Text colors (lighter)
        'pastel-purple-tex': '#B19CD9',
        'lavender-tex': '#D4C4E4',
        'muted-purple-tex': '#A68BC7',
        'dark-pastel-purple-tex': '#8A6BB1',
        // Darker text colors
        'pastel-purple-text': '#8A5CC7',
        'lavender-text': '#A07BC7',
        'muted-purple-text': '#7A54B4',
        'dark-pastel-purple-text': '#6A428F',
      },
    },
  },
  plugins: [],
}