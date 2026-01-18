export const usePendaftaran = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 1. kirimPendaftaran: Gunakan $fetch karena dipanggil dari EVENT klik tombol
  const kirimPendaftaran = async (payload: any) => {
    loading.value = true
    error.value = null

    try {
      // Gunakan $fetch untuk interaksi user
      const data = await $fetch('/api/pendaftaran', {
        method: 'POST',
        body: payload
      })

      return {
        success: true,
        data: data
      }

    } catch (err: any) {
      // Menangkap error dari server (misal validasi backend gagal)
      const msg = err.data?.message || err.message || 'Gagal mengirim data'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  // 2. State Global untuk Info Periode
  const periodeInfo = useState('periode_psb', () => ({
    id_psb: '',
    nama_psb: 'Memuat sistem pendaftaran...', 
    status_aktif: true
  }))

  // 3. fetchPeriode: Gunakan useFetch agar mendukung SSR (Data muncul saat refresh)
  const fetchPeriode = async () => {
    // Gunakan useFetch di sini jika ingin data diambil saat setup
    // Tapi karena kamu panggil di onMounted, $fetch juga boleh. 
    // Namun, kita perbaiki logika pencariannya agar lebih kuat:
    try {
      const data: any = await $fetch('/api/pendaftaran')
      
      if (Array.isArray(data) && data.length > 0) {
        // Logika cari yang aktif
        const aktif = data.find(p => p.status_aktif === true || String(p.status_aktif).toUpperCase() === "TRUE") || data[0]
        
        if (aktif) {
          periodeInfo.value = {
            id_psb: aktif.id_psb,
            nama_psb: aktif.nama_psb,
            status_aktif: aktif.status_aktif
          }
        }
      }
    } catch (err: any) {
      console.error("Gagal mengambil periode:", err)
      periodeInfo.value.nama_psb = "Penerimaan Santri Baru"
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