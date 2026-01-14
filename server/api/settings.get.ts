// server/api/settings.get.ts
/*
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = config.gasUrlBackend // Pastikan URL GAS kamu bisa handle action=getSettings

  try {
    const response = await $fetch(url, {
      query: { action: 'getSettings' }
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data dari Google Sheet',
    })
  }
})*/

// server/api/settings.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Memanggil GAS dengan parameter action
  const data = await $fetch(`${config.gasUrlBackend}?action=getSettings`)
  return data
})