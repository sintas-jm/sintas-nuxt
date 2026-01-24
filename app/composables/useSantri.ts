export const useSantri = () => {
  const santriList = useState<any[]>('master_santri_list', () => [])
  const periodeTp = useState<any>('periode_tp_aktif', () => null)
  const loading = ref(false)

  const fetchSantri = async () => {
    loading.value = true
    try {
      // Kita asumsikan api/santri.get.ts nanti akan memanggil GAS
      const data: any = await $fetch('/api/santri')
      santriList.value = data.santri
      periodeTp.value = data.periode.find((p: any) => p.status_aktif === true || String(p.status_aktif) === "TRUE")
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return { santriList, periodeTp, loading, fetchSantri }
}