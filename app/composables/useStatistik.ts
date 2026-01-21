// app/composables/useStatistik.ts
export const useStatistik = () => {
  const stats = useState<any>('psb_stats', () => null)
  const loading = ref(false)

  const fetchStats = async () => {
    loading.value = true
    try {
      // Panggil server route yang akan diteruskan ke GAS
      const response = await $fetch<any>('/api/pendaftaran', {
        method: 'GET',
        params: { action: 'getStatistikDashboard' }
      })
      if (response.success) {
        stats.value = response.data
      }
    } catch (err) {
      console.error('Gagal mengambil statistik:', err)
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, fetchStats }
}
