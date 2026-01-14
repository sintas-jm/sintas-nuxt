export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  if (!config.gasUrlBackend) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Variabel GAS_URL_PENDAFTARAN belum terpasang di .env'
    })
  }

  try {
    return await $fetch(config.gasUrlBackend, {
      method: 'GET',
      // Google Apps Script sering melakukan redirect (302), ofetch (built-in Nuxt) biasanya menanganinya, 
      // tapi kita tambahkan retry untuk stabilitas.
      retry: 2,
      retryDelay: 500
    })
  } catch (error: any) {
    console.error('Error fetching from GAS:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data: ${error.message}`
    })
  }
})