export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const res: any = await $fetch(config.gasUrlBackend, {
      method: 'GET',
      query: { action: 'getOp3Settings' }
    })

    if (!res.success) throw new Error(res.message || 'Gagal dari GAS')

    const rows = res.data || []
    
    // 1. Parsing Settings (Data ada di Baris 3 & 4)
    // Sesuai rumus Index = Baris - 1, maka Baris 3 = Index 2
    const settings = rows.slice(2, 4).map((r: any) => ({
      id_org: r[0],
      nama_org: r[1],
      kategori: r[2],
      tahun: r[3],
      aktif: String(r[4]).toUpperCase() === 'TRUE'
    }))

    // 2. Parsing Master (Data mulai Baris 8)
    // Sesuai rumus Index = Baris - 1, maka Baris 8 = Index 7
    const masterRows = rows.slice(7)
    
    const data = {
      settings,
      // Ini akan menjadi "Enum" atau daftar pilihan di UI
      jabatan_pa: [] as any[],
      jabatan_pi: [] as any[],
      // Ini akan menjadi daftar "Kandidat" yang bisa dipilih
      personel_pa: [] as any[],
      personel_pi: [] as any[],
      // Daftar Pendamping
      pendamping_pa: [] as any[],
      pendamping_pi: [] as any[],
      pendamping_pa_pi: [] as any[]
    }

      masterRows.forEach((row: any, index: number) => {
      // Tambahkan log ini sebentar untuk melihat apa isi baris pertama yang dibaca
      // if (index === 0) console.log('Data Baris Pertama yang dibaca:', row)

      // Ambil Jabatan PA (Kolom B = index 1)
      if (row[1] && row[1] !== '-') {
        data.jabatan_pa.push({ urut: row[0], nama: row[1] })
      }

      // Ambil Personel PA (ID Santri ada di Kolom C = index 2)
      // Pastikan row[2] (ID) dan row[3] (Nama) tidak kosong
      if (row[2] && row[2] !== '') {
        data.personel_pa.push({ 
          id_santri: row[2], 
          nama_lengkap: row[3], 
          foto_profil: row[4] 
        })
      }
      
      // Ambil Jabatan PI sebagai referensi enum
      if (row[6] && row[6] !== '-') {
        data.jabatan_pi.push({ urut: row[5], nama: row[6] })
      }
      // Ambil Kandidat Santri PI
      if (row[7] && row[7] !== '-') {
        data.personel_pi.push({ 
          id_santri: row[7], 
          nama_lengkap: row[8], 
          foto_profil: row[9] 
        })
      }

      // Ambil Referensi Pendamping
      if (row[10] && row[10] !== '-') data.pendamping_pa.push(row[10])
      if (row[11] && row[11] !== '-') data.pendamping_pi.push(row[11])
      if (row[12] && row[12] !== '-') data.pendamping_pa_pi.push(row[12])
    })

    return data
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message })
  }
})