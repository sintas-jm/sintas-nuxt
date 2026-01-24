export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    return await $fetch(config.gasUrlBackend, {
      method: 'POST',
      body: {
        action: 'uploadFotoSantri',
        ...body
      }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Upload Gagal' })
  }
})