// app/composables/useSantri.ts
export const useSantri = () => {
  const santriList = useState<any[]>('master_santri_list', () => [])
  const periodeTp = useState<any>('periode_tp_aktif', () => null)
  const loading = ref(false)

  const fetchSantri = async () => {
    loading.value = true
    try {
      const data: any = await $fetch('/api/santri')
      santriList.value = data.santri
      periodeTp.value = data.periode.find((p: any) => p.status_aktif === true || String(p.status_aktif) === "TRUE")
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // Fungsi Baru untuk Update
  const updateSantri = async (payload: any) => {
    return await $fetch('/api/santri/update', {
      method: 'POST' as any, // Tambahkan 'as any' untuk memaksa TS menerima POST
      body: payload
    })
  }

  // Fungsi pembantu agar bisa dipakai di mana saja (List maupun Detail)
  const getFotoUrl = (fotoId: any) => {
    if (!fotoId || fotoId === "" || fotoId === "-") return undefined
    const idStr = String(fotoId).trim()
    if (idStr.includes('http')) return idStr
    return `https://drive.google.com/thumbnail?id=${idStr}&sz=s400`
  }

  const uploadFoto = async (idSantri: string, base64: string) => {
    const res: any = await $fetch('/api/santri/upload', {
      method: 'POST',
      body: { id_santri: idSantri, base64 }
    })

    // Jika sukses, kita bantu update list global di sini
    if (res.success && res.fileId) {
      const index = santriList.value.findIndex(s => s.id_santri === idSantri)
      if (index !== -1) {
        santriList.value[index].foto_profil = res.fileId
      }
    }
    return res
  }

  return { 
    santriList, 
    periodeTp, 
    loading, 
    fetchSantri, 
    updateSantri, 
    getFotoUrl, 
    uploadFoto }
}

