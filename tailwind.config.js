/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  content: [
    './src/pages/**/*.{html,js}',
    './src/popup/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'open-sans': ['"Open Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 1s forwards',
      },
      colors: {
        'podium-gold': '#FFD700', // Couleur or
        'podium-silver': '#C0C0C0', // Couleur argent
        'podium-bronze': '#CD7F32', // Couleur bronze
      },
    },
  },
  plugins: [],
};