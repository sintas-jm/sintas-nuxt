export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    const response: any = await $fetch(config.scriptUrl, {
      method: 'POST',
      body: {
        action: 'updateDataSantri',
        payload: body
      }
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal menghubungi database'
    })
  }
})