/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-dark': '#0F5396',
        'blue-medium': '#1E6BB3',
        'blue-light': '#3B96E6',
        'green-dark': '#2A5A30',
        'green-medium': '#327137',
        'green-light': '#51B059',
        'gray-dark': '#333333',
        'gray-light': '#CCCCCC',
      }
    },
  },
  plugins: [],
}

