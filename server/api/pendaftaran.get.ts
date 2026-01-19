// server/api/pendaftaran.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Ambil query param 'action' dari request Nuxt (misal: ?action=getRekapData)
  const query = getQuery(event)
  const action = query.action || 'getPeriodePsb' // Default tetap periode jika kosong

  if (!config.gasUrlBackend) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Variabel GAS_URL_BACKEND belum terpasang di .env'
    })
  }

  try {
    // URL sekarang dinamis mengikuti action yang dikirim
    return await $fetch(`${config.gasUrlBackend}?action=${action}`, {
      method: 'GET',
      retry: 2,
      retryDelay: 500
    })
  } catch (error: any) {
    console.error('Error fetching from GAS:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data ${action}: ${error.message}`
    })
  }
})