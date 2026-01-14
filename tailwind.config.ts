/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B211A',
        bgGrey: '#f5f5f5',
        muted: '#777',
        borderGrey: '#ddd'
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      // Tip: Gunakan spacing atau extend screens untuk 1440
      maxWidth: {
        '1440': '1440px',
      }
    },
  },
}