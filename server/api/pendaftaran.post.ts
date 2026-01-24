export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)

    if (!body.nama_lengkap) {
      throw createError({ statusCode: 400, statusMessage: 'Nama lengkap wajib diisi.' })
    }

    // Kirim ke GAS dengan menyertakan action pendaftaran
    // Karena di doPost GAS kita buat default-nya adalah handlePendaftaranSantri,
    // bisa mengirimkan body langsung atau memberikan action eksplisit.
    const response: any = await $fetch(config.gasUrlBackend, {
      method: 'POST',
      body: {
        action: 'submitPendaftaran', // Opsional, sesuai default di doPost
        ...body 
      },
    })

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

/**

// server/api/pendaftaran.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)

    // Fallback: Pastikan minimal ada nama_lengkap (validasi basic)
    if (!body.nama_lengkap) {
      throw createError({ statusCode: 400, statusMessage: 'Nama wajib diisi' })
    }

    // Pembersihan otomatis: Ubah semua tipe data ke String agar GAS tidak error
    const sanitizedBody = Object.fromEntries(
      Object.entries(body).map(([key, val]) => [
        key, 
        val === null || val === undefined ? "" : String(val)
      ])
    )

    // Kirim langsung ke GAS
    return await $fetch(config.gasUrlBackend, {
      method: 'POST',
      body: {
        action: 'submitPendaftaran',
        ...sanitizedBody 
      },
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return {
      success: false,
      message: error.statusMessage || error.message || 'Gagal mengirim data.'
    }
  }
})

 */