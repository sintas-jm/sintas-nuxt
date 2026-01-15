export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    // Teruskan payload ke Google Apps Script
    const response = await $fetch(config.gasUrlBackend, {
      method: 'POST',
      body: {
        action: 'updatePiketImam',
        payload: body.payload // Data id, imam_1, imam_2, keterangan
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal menghubungi backend Google Sheets',
    })
  }
})