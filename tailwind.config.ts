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
        // warna layout default
        primary: '#1B211A',
        bgGrey: '#f5f5f5',
        muted: '#777',
        borderGrey: '#ddd',
        // Tambahkan warna admin
        admin: {
          dark: '#021108',   // Latar sangat gelap (hijau hitam)
          surface: '#052112', // Permukaan kartu
          glow: '#10b981',    // Hijau Emerald untuk aksen/text
          border: '#064e3b'   // Hijau gelap untuk border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Tip: Gunakan spacing atau extend screens untuk 1440
      maxWidth: {
        '1440': '1440px',
      }
    },
  },
}