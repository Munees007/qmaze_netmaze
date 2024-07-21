/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes:{
        scale: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1)' },
          
          '100%':{transform:'scale(0.8)'}
        },
      },
      animation:{
        scale: 'scale 1s ease-in-out  infinite',
      },
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

