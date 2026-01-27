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
  const occupiedStatus = computed(() => {
    const statusMap = new Map<string, 'database' | 'keranjang' | 'draft'>();
    
    const listUmum = masterData.value?.pendamping_pa_pi || []
    const isKebal = (name: string) => listUmum.includes(name)

    // 1. Database (Label: Menjabat)
    databaseOccupied.value.forEach(item => {
      if (!isKebal(item.id)) statusMap.set(item.id, 'database')
    })

    // 2. Keranjang (Label: Dicalonkan)
    keranjang.value.forEach(item => {
      item.personalia.forEach((p: any) => statusMap.set(p.id_santri, 'keranjang'))
      item.pendamping.forEach((name: string) => {
        if (!isKebal(name)) statusMap.set(name, 'keranjang')
      })
    })

    // 3. Draft (Label: Dicalonkan)
    drafting.value.personalia.forEach((p: any) => statusMap.set(p.id_santri, 'draft'))
    drafting.value.pendamping.forEach((name: string) => {
      if (!isKebal(name)) statusMap.set(name, 'draft')
    })

    return statusMap
  })

  // Update dbJabatanTracks di useOP3.ts
  const dbJabatanTracks = computed(() => {
    if (!masterData.value || !databaseOccupied.value) return new Set()

    const activeOrg = masterData.value?.settings?.find((s: any) => s.kategori === kategori.value)
    const activeOrgId = activeOrg?.id_org
    
    const tracks = new Set()
    databaseOccupied.value.forEach(item => {
      // Pakai key 'nama_jabatan' sesuai header spreadsheet
      if (item.id_org === activeOrgId && item.nama_jabatan) {
        tracks.add(`${item.id_org}-${item.nama_jabatan}`)
      }
    })
    
    return tracks
  })

  // Fungsi untuk mengubah ID Drive menjadi URL Gambar yang bisa ditampilkan
  const getImageUrl = (id: string): string => {
    // Pakai string kosong "" agar TypeScript bahagia
    if (!id || id === '-' || id === '') return "" 
    if (id.startsWith('http')) return id
    return `https://drive.google.com/thumbnail?id=${id}&sz=s400`
  }
  /**
  Kadang di database ada ID-nya, tapi filenya sudah dihapus di Drive. Agar tidak muncul ikon "gambar pecah" bawaan browser, kita bisa tambahkan fungsi v-if yang lebih cerdas atau menggunakan event @error.
  */

  // stats progress bar
  const stats = computed(() => {
    if (!masterData.value) return { total: 0, filled: 0, percent: 0 }
    
    const list = kategori.value === 'pa' ? masterData.value.jabatan_pa : masterData.value.jabatan_pi
    const total = list?.length || 0
    
    // Hitung jabatan unik yang sudah ada di DATABASE (dbJabatanNames dari langkah sebelumnya)
    const filled = dbJabatanTracks.value.size
    const percent = total > 0 ? Math.round((filled / total) * 100) : 0
    
    return { total, filled, percent }
  })

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
        await fetchSettings()  // refresh / reset data dari database setelah simpan berhasil
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
    kategori, masterData, drafting, keranjang, loading, occupiedStatus, isDraftValid, dbJabatanTracks, stats,
    getImageUrl, fetchSettings, addToDraft, pushToKeranjang, simpanKeDatabase
  }
}