/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': '#D4BFFF',
        'lavender': '#E6E6FA',
        'muted-purple': '#C3B1E1',
        'dark-pastel-purple': '#A084CA',
      },
    },
  },
  plugins: [],
}