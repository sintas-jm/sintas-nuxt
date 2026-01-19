// app/composables/useRekap.ts

interface Pendaftar {
  id_pendaftar: string;
  nama_lengkap: string;
  jenjang_daftar: string;
  jenis_kelamin: string;
  kabupaten: string;
  status_pendaftaran: string;
}

export const useRekap = () => {
  const pendaftarList = useState<Pendaftar[]>('pendaftar_list', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRekap = async () => {
    loading.value = true
    error.value = null
    try {
      // Mengambil data dari backend Nuxt yang mem-proxy ke GAS
      const data = await $fetch<Pendaftar[]>('/api/pendaftaran', {
        params: { action: 'getRekapData' }
      })
      
      pendaftarList.value = Array.isArray(data) ? data : []
    } catch (err: any) {
      error.value = err.message || 'Gagal mengambil data rekap'
      console.error('Rekap Fetch Error:', err)
    } finally {
      loading.value = false
    }
  }

  // Fungsi tambahan untuk update status (untuk Admin nanti)
  const updateStatus = async (id: string, newStatus: string) => {
    // Logika update status bisa ditaruh di sini nanti
  }

  return {
    pendaftarList,
    loading,
    error,
    fetchRekap,
    updateStatus
  }
}