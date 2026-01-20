// server/api/pendaftaran.put.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    // Teruskan ke GAS dengan menyertakan action update
    return await $fetch(config.gasUrlBackend, {
      method: 'POST',
      body: {
        action: 'updatePendaftar',
        ...body
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Gagal menghubungi server database (GAS)'
    })
  }
})