/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{html,js}',
    './src/popup/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
      },
      colors: {
        'refectory-green': '#4CAF50',
        'refectory-green-dark': '#2E7D32',
        'refectory-orange': '#FF6B35',
        'refectory-beige': '#F5F3EE',
        'refectory-gold': '#FFD700',
        'podium-gold': '#FFD700',
        'podium-silver': '#C0C0C0',
        'podium-bronze': '#CD7F32',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};