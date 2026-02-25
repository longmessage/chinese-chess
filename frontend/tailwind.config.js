/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chinese-red': '#C03027',
        'chinese-gold': '#D4AF37',
        'chinese-black': '#1A1A1A',
        'chinese-white': '#F5F5F0',
        'chinese-wood': '#8B4513',
        'chinese-bamboo': '#2D5A27',
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'SimSun', 'serif'],
        'sans': ['Noto Sans SC', 'sans-serif'],
      },
      backgroundImage: {
        'cloud-pattern': "url('/patterns/cloud.png')",
        'weave-pattern': "url('/patterns/weave.png')",
      }
    },
  },
  plugins: [],
}
