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
      ]
    }
  },

  runtimeConfig: {
      // Properti di dalam sini hanya tersedia di Server-side
      gasUrlBackend: process.env.GAS_URL_BACKEND, // Abaikan error merah jika masih muncul di editor
      
      // Jika ingin tersedia di Client-side juga, taruh di dalam 'public'
      public: {
        // data publik di sini
      }
    },
  modules: [
      '@nuxtjs/tailwindcss'
    ],
})
