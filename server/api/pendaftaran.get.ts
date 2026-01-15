export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  if (!config.gasUrlBackend) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Variabel GAS_URL_BACKEND belum terpasang di .env'
    })
  }

  try {
    // Menambahkan query param ?action=getPeriodePsb sesuai switch-case di Code.gs
    return await $fetch(`${config.gasUrlBackend}?action=getPeriodePsb`, {
      method: 'GET',
      retry: 2,
      retryDelay: 500
    })
  } catch (error: any) {
    console.error('Error fetching from GAS:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data periode: ${error.message}`
    })
  }
})