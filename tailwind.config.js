/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flowency-blue': '#0066CC',
        'flowency-dark': '#1a1a2e',
      },
    },
  },
  plugins: [],
}
