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

  // State Global: Nama properti disesuaikan dengan kolom spreadsheet Anda
  const periodeInfo = useState('periode_psb', () => ({
    id_psb: '',
    nama_psb: 'Memuat...',
    status_aktif: true,
    note_status: '',
    first_header: 'PSB', // Default
    mid_header: 'Tahun Ajaran',
    last_header: '...'
  }))

  const fetchPeriode = async () => {
    try {
      const data: any = await $fetch('/api/pendaftaran')
      
      if (Array.isArray(data) && data.length > 0) {
        // Cari yang status_aktif-nya TRUE
        const aktif = data.find(p => p.status_aktif === true || String(p.status_aktif).toUpperCase() === "TRUE") || data[0]
        
        if (aktif) {
          periodeInfo.value = {
            id_psb: aktif.id_psb || '',
            nama_psb: aktif.nama_psb || '',
            status_aktif: aktif.status_aktif === true || String(aktif.status_aktif).toUpperCase() === "TRUE",
            note_status: aktif.note_status || '',
            // Mapping dari kolom baru spreadsheet
            first_header: aktif.first_header || 'PSB',
            mid_header: aktif.mid_header || 'Tahun Pelajaran',
            last_header: aktif.last_header || ''
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
    periodeInfo,
    fetchPeriode
  }
}