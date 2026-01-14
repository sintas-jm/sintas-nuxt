// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: [
    
  ],

  app: {
    head: {
      title: 'Sintas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap' 
        },
        { rel: 'icon', type: 'image/x-icon', href: '/S3w.ico' }
      ]
    }
  },

  runtimeConfig: {
      // Properti di dalam sini hanya tersedia di Server-side  // Variabel RAHASIA (Hanya bisa dibaca oleh folder server/)
      gasUrlBackend: process.env.GAS_URL_BACKEND, // Abaikan error merah jika masih muncul di editor
      
      // Jika ingin tersedia di Client-side juga, taruh di dalam 'public'
      public: {
        // data publik di sini
        // Variabel PUBLIK (Bisa dibaca oleh browser & server)
        // Kosongkan jika URL GAS tidak ingin diketahui publik sama sekali
      }
    },
  modules: [
      '@nuxtjs/tailwindcss'
    ],
})
