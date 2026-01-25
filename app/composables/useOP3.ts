export const useOP3 = () => {
  const loading = ref(false)
  const kategori = ref<'pa' | 'pi'>('pa')
  const masterData = ref<any>(null)
  const databaseOccupied = ref<any[]>([])
  
  const drafting = ref({
    jabatan: null as any,
    personalia: [] as any[],
    pendamping: [] as any[]
  })

  const keranjang = ref<any[]>([])

  const fetchSettings = async () => {
    loading.value = true
    try {
      const [settings, existing] = await Promise.all([
        $fetch<any>('/api/op3/setting'),
        $fetch<any>('/api/op3/occupied') // Kita buat API route baru setelah ini
      ])
      masterData.value = settings
      databaseOccupied.value = existing.data || []
    } finally {
      loading.value = false
    }
  }

  // Update occupiedIds agar menggabungkan Database + Keranjang + Draft
  const occupiedIds = computed(() => {
    const ids = new Set<string>()
    
    // 1. Dari Database (Hasil Simpan Sebelumnya)
    databaseOccupied.value.forEach(item => ids.add(item.id))

    // 2. Dari Keranjang (Yang belum disubmit)
    keranjang.value.forEach(item => {
      item.personalia.forEach((p: any) => ids.add(p.id_santri))
      item.pendamping.forEach((name: string) => ids.add(name))
    })

    // 3. Dari yang sedang dirakit (Draft)
    drafting.value.personalia.forEach(p => ids.add(p.id_santri))
    drafting.value.pendamping.forEach(name => ids.add(name))

    return ids
  })

  // Fungsi untuk mengubah ID Drive menjadi URL Gambar yang bisa ditampilkan
  const getImageUrl = (id: string) => {
    if (!id || id === '-' || id.startsWith('http')) return id || '/img/placeholder-user.png'
    
    // Format link thumbnail Google Drive agar bisa di-render browser
    return `https://drive.google.com/thumbnail?id=${id}&sz=s400`
  }

  const addToDraft = (person: any, type: 'personalia' | 'pendamping') => {
    if (type === 'personalia') {
      if (!drafting.value.personalia.find(p => p.id_santri === person.id_santri)) {
        drafting.value.personalia.push(person)
      }
    } else {
      drafting.value.pendamping.push(person)
    }
  }

  const pushToKeranjang = () => {
    // Pengecekan ekstra sebelum push
    if (!drafting.value.jabatan || 
        drafting.value.personalia.length === 0 || 
        drafting.value.pendamping.length === 0) {
      alert("Harus melengkapi Jabatan, Personalia, dan Pendamping!")
      return
    }

    keranjang.value.push({
      ...JSON.parse(JSON.stringify(drafting.value)),
      id_temp: Date.now()
    })
    
    // Reset draft
    drafting.value = { jabatan: null, personalia: [], pendamping: [] }
  }

  // validasi agar ada struktur terpilih sebelum disimpan
  const isDraftValid = computed(() => {
    const hasJabatan = !!drafting.value.jabatan
    const hasPersonalia = drafting.value.personalia.length > 0
    const hasPendamping = drafting.value.pendamping.length > 0

    // Syarat: Semuanya harus terpenuhi
    return hasJabatan && hasPersonalia && hasPendamping
  })

  // --- FUNGSI BARU ---
  const simpanKeDatabase = async () => {
    if (keranjang.value.length === 0) return { success: false, message: 'Keranjang kosong' }
    
    // Ambil id_org sesuai kategori aktif dari metadata settings
    const activeOrg = masterData.value?.settings?.find((s: any) => s.kategori === kategori.value)
    if (!activeOrg) return { success: false, message: 'Data organisasi tidak ditemukan' }

    loading.value = true
    try {
      const res: any = await $fetch('/api/op3/penempatan', {
        method: 'POST',
        body: {
          id_org: activeOrg.id_org,
          items: keranjang.value
        }
      })

      if (res.success) {
        keranjang.value = [] // Reset keranjang setelah sukses
        return { success: true, message: res.message }
      }
      return { success: false, message: res.message }
    } catch (err: any) {
      return { success: false, message: 'Terjadi kesalahan koneksi server' }
    } finally {
      loading.value = false
    }
  }

  return {
    kategori, masterData, drafting, keranjang, loading, occupiedIds, isDraftValid, getImageUrl,
    fetchSettings, addToDraft, pushToKeranjang, simpanKeDatabase
  }
}