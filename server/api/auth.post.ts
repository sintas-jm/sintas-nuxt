// server/api/auth.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  try {
    // Ambil data settings terbaru dari GAS
    const response: any = await $fetch(`${config.gasUrlBackend}?action=getSettings`)
    
    // Ambil PIN dari baris 5 yang sudah kita set di GAS tadi
    const correctPin = response.settings.internalPin?.toString()

    if (body.pin === correctPin) {
      return { success: true }
    }
    
    throw createError({ statusCode: 401, message: 'PIN salah' })
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Gagal verifikasi ke server' })
  }
})
