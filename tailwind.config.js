/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flowency-blue': 'hsl(215, 25%, 27%)', // Dark slate blue (primary brand color)
        'flowency-dark': 'hsl(215, 25%, 20%)', // Darker variant
        'flowency-accent': 'hsl(24, 95%, 53%)', // Orange accent
        'flowency-electric': 'hsl(189, 85%, 55%)', // Cyan electric
      },
    },
  },
  plugins: [],
}
