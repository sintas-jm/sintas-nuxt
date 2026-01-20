// app/composables/usePendaftaran.ts
export const usePendaftaran = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const kirimPendaftaran = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/pendaftaran', {
        method: 'POST',
        body: payload
      })
      return { success: true, data }
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Gagal mengirim data'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  // FUNGSI BARU UNTUK UPDATE (MATCHING STYLE)
  const updatePendaftar = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/pendaftaran', {
        method: 'PUT', // Gunakan PUT untuk membedakan pendaftaran baru (POST)
        body: payload
      })
      return { success: true, data }
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Gagal memperbarui data'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  // State Global: Nama properti disesuaikan dengan kolom spreadsheet Anda
  const periodeInfo = useState('periode_psb', () => ({
    id_psb: '',
    nama_psb: 'Memuat...',
    status_aktif: true,
    note_status: '',
    first_header: 'PSB',
    mid_header: 'Tahun Ajaran',
    last_header: '',
    // Tambahkan field baru untuk internal
    tanggal_mulai: '',
    tanggal_selesai: ''
  }))

  const fetchPeriode = async () => {
    try {
      // Kita panggil API yang mengarah ke getPeriodePsb di GAS
      const data: any = await $fetch('/api/pendaftaran', {
        params: { action: 'getPeriodePsb' }
      })
      
      if (Array.isArray(data) && data.length > 0) {
        const aktif = data.find(p => p.status_aktif === true || String(p.status_aktif).toUpperCase() === "TRUE") || data[0]
        
        if (aktif) {
          periodeInfo.value = {
            id_psb: aktif.id_psb || '',
            nama_psb: aktif.nama_psb || '',
            status_aktif: aktif.status_aktif === true || String(aktif.status_aktif).toUpperCase() === "TRUE",
            note_status: aktif.note_status || '',
            first_header: aktif.first_header || 'PSB',
            mid_header: aktif.mid_header || 'Tahun Pelajaran',
            last_header: aktif.last_header || '',
            // Mapping field tambahan
            tanggal_mulai: aktif.tanggal_mulai || '',
            tanggal_selesai: aktif.tanggal_selesai || ''
          }
        }
      }
    } catch (err: any) {
      console.error("Gagal mengambil periode:", err)
    }
  }

  return {
    loading,
    error,
    kirimPendaftaran,
    updatePendaftar,
    periodeInfo,
    fetchPeriode
  }
}