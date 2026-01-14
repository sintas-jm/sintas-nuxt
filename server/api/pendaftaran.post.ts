export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)

    if (!body.nama_lengkap) {
      throw createError({ statusCode: 400, statusMessage: 'Nama lengkap wajib diisi.' })
    }

    // Kirim ke GAS
    const response: any = await $fetch(config.gasUrlBackend, {
      method: 'POST',
      body: body,
    })

    // GAS mengembalikan { success: true/false, ... }
    if (response.success) {
      return {
        success: true,
        id_pendaftar: response.id_pendaftar,
        message: response.message
      }
    } else {
      throw new Error(response.message || 'Gagal menyimpan ke Spreadsheet')
    }

  } catch (error: any) {
    console.error('API Error:', error)
    return {
      success: false,
      message: error.message || 'Gagal mengirim data ke database.'
    }
  }
})