export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    // Kita panggil GAS dengan dua action sekaligus untuk efisiensi
    // Atau jika GAS Anda mendukung action dinamis, kita kirim params-nya
    const [santriData, periodeData]: any = await Promise.all([
      $fetch(config.gasUrlBackend, {
        method: 'GET',
        params: { action: 'getMasterSantri' }
      }),
      $fetch(config.gasUrlBackend, {
        method: 'GET',
        params: { action: 'getPeriodeTp' }
      })
    ])

    // Pastikan data yang dikirim balik ke frontend rapi
    return {
      success: true,
      santri: Array.isArray(santriData) ? santriData : [],
      periode: Array.isArray(periodeData) ? periodeData : []
    }

  } catch (error: any) {
    console.error('API Santri Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data master santri dari database.'
    })
  }
})