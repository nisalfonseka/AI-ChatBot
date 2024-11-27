/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        abstract: 'abstract-animation 8s ease infinite',
      },
      keyframes: {
        'abstract-animation': {
          '0%': { background: 'radial-gradient(circle, #7247e9, transparent 60%)', transform: 'scale(1) rotate(0deg)' },
          '25%': { background: 'radial-gradient(circle, #da0e7f, transparent 60%)', transform: 'scale(1.2) rotate(90deg)' },
          '50%': { background: 'radial-gradient(circle, #7247e9, transparent 70%)', transform: 'scale(1.4) rotate(180deg)' },
          '75%': { background: 'radial-gradient(circle, #da0e7f, transparent 60%)', transform: 'scale(1.2) rotate(270deg)' },
          '100%': { background: 'radial-gradient(circle, #7247e9, transparent 60%)', transform: 'scale(1) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}

