// app/composables/usePendaftaran.ts

export const usePendaftaran = () => {
  const loading = ref(false)
  const error = ref(null)

  const kirimPendaftaran = async (payload: any) => {
    loading.value = true
    error.value = null

    try {
      // Kita menembak ke API internal Nuxt (Proxy)
      const { data, error: fetchError } = await useFetch('/api/pendaftaran', {
        method: 'POST',
        body: payload,
        watch: false
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.statusMessage || 'Gagal mengirim data')
      }

      return {
        success: true,
        data: data.value
      }

    } catch (err: any) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  // Gunakan useState agar data sinkron antar komponen
  const periodeInfo = useState('periode_psb', () => ({
    id_psb: '',
    nama_psb: '', 
    status_aktif: true
  }))

  const fetchPeriode = async () => {
    try {
      // Panggil server/api/pendaftaran.get.ts
      const data = await $fetch('/api/pendaftaran')
      
      if (Array.isArray(data)) {
        // Cari baris yang status_aktif-nya TRUE (atau baris pertama jika tidak ada)
        const aktif = data.find(p => p.status_aktif === true || p.status_aktif === "TRUE") || data[0]
        
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
      periodeInfo.value.nama_psb = "Penerimaan Santri Baru" // fallback
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