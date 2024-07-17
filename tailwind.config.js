/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'playwrite': ['Playwrite CU', 'sans-serif'],
        'shadow' : ['Shadows Into Light', 'cursive'],
        'harry':['Harry Potter','sans-serif'],
        'playfair':['Playfair Display','sans-serif']
      }
    },
  },
  plugins: [],
}

