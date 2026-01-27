// server/api/auth.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  try {
    // 1. Panggil fungsi getPasskey dari GAS
    const response: any = await $fetch(`${config.gasUrlBackend}?action=getPasskey`)
    
    // Sesuaikan dengan struktur return GAS: response.passkey.pass
    const correctPassword = response.passkey?.pass?.toString()

    // 2. Bandingkan input (body.password) dengan data dari GS
    if (body.password === correctPassword) {
      
      // 3. SET COOKIE DI SINI (Penting agar middleware tahu staff sudah login)
      setCookie(event, 'auth_pin', 'verified_access_granted', {
        httpOnly: false,       // Aman dari JS Browser
        secure: !import.meta.dev, 
        maxAge: 60 * 60 * 24, // Berlaku 1 hari
        path: '/'
      })

      return { success: true }
    }
    
    // Jika tidak cocok
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Unauthorized', 
      message: 'Password salah!' 
    })

  } catch (error: any) {
    // Teruskan error 401 jika password salah, atau 500 jika GAS bermasalah
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Gagal verifikasi ke server GAS' 
    })
  }
})