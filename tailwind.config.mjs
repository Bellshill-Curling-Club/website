/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,md,mdx,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ice: '#e8f1f8',
        stone: '#1f3a5f',
        accent: '#c2410c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
