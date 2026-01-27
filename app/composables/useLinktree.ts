// app/composables/useLinktree.ts
export const useLinktree = () => {
  const data = useState<any>('app-settings-global', () => null)
  const lastFetch = useState<number | null>('last-fetch-timestamp', () => null)
  
  // Gunakan useState agar status loading sinkron antara server & client
  const loading = useState('linktree-loading', () => false) 

  const STALE_TIME = 6 * 60 * 60 * 1000 

  const fetchLinktree = async (force = false) => {
    const now = Date.now()
    const isStale = lastFetch.value ? (now - lastFetch.value > STALE_TIME) : true

    // Jika data ada dan valid, langsung stop proses
    if (data.value && !force && !isStale) return
    
    loading.value = true
    try {
      const response = await $fetch('/api/linktree')
      data.value = response
      lastFetch.value = now 
    } catch (err) {
      console.error('Gagal sinkronisasi:', err)
    } finally {
      // Jangan langsung false, beri sedikit waktu untuk rendering
      loading.value = false
    }
  }

  return {
    settings: computed(() => data.value?.settings || {}),
    links: computed(() => data.value?.links || []),
    loading,
    fetchLinktree,
    lastSync: lastFetch
  }
}