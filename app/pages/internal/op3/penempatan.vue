<script setup lang="ts">
import { useOP3 } from '~/composables/useOP3'
const { showToast } = useToast()
const { startAction, stopAction } = useActionLoading()

const { 
  kategori, masterData, drafting, keranjang, loading, occupiedStatus, isDraftValid, dbJabatanTracks, stats,
  getImageUrl, fetchSettings, addToDraft, pushToKeranjang, simpanKeDatabase 
} = useOP3()

definePageMeta({ layout: 'internal' })

// State lokal untuk pencarian/pemilihan pendamping
const selectedPendamping = ref<string | null>(null)

// Load data saat pertama kali buka halaman
onMounted(async () => {
  // Picu loading overlay saat pertama kali buka
  startAction('Mengambil Data Organisasi...')
  
  try {
    await fetchSettings()
  } catch (err) {
    showToast('Gagal memuat data!', 'error')
  } finally {
    // Pastikan loading dimatikan apapun hasilnya
    stopAction()
  }
})

// --- COMPUTED LOGIC ---
const filteredJabatan = computed(() => {
  if (!masterData.value) return []
  
  const activeOrg = masterData.value?.settings?.find((s: any) => s.kategori === kategori.value)
  const activeOrgId = activeOrg?.id_org
  const list = kategori.value === 'pa' ? masterData.value.jabatan_pa : masterData.value.jabatan_pi
  
  const usedInKeranjang = keranjang.value.map(k => k.jabatan.nama)

  return (list || []).map((j: any) => {
    // Buat key yang sama untuk pengecekan
    const uniqueKey = `${activeOrgId}-${j.nama}`
    
    return {
      ...j,
      isUsedLocal: usedInKeranjang.includes(j.nama),
      // Cek apakah kombinasi ID Org + Nama Jabatan ini ada di database
      isUsedDB: dbJabatanTracks.value.has(uniqueKey)
    }
  })
})

const filteredPersonel = computed(() => {
  if (!masterData.value) return []
  const list = kategori.value === 'pa' 
    ? masterData.value.personel_pa 
    : masterData.value.personel_pi
  return list || []
})

const searchPendamping = ref('')
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null) // Untuk menutup dropdown saat klik di luar



// Reset pencarian saat kategori ganti
watch(kategori, () => {
  searchPendamping.value = ''
  selectedPendamping.value = null
})

const dropdownStyles = ref({
  top: '0px',
  left: '0px',
  width: '0px'
})

const updateDropdownPosition = () => {
  const el = dropdownRef.value
  if (el) {
    // Gunakan querySelector pada element yang sudah pasti ada
    const inputEl = el.querySelector('input')
    if (inputEl) {
      const rect = inputEl.getBoundingClientRect()
      dropdownStyles.value = {
        top: `${rect.bottom + window.scrollY + 8}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`
      }
    }
  }
}

const toggleDropdown = (event: Event) => {
  // Mencegah bubbling agar tidak langsung memicu 'click-outside' di saat yang sama
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
  
  if (isDropdownOpen.value) {
    updateDropdownPosition()
  }
}

// Pantau saat terbuka untuk hitung posisi
watch(isDropdownOpen, (val) => {
  if (val) {
    updateDropdownPosition()
    window.addEventListener('scroll', updateDropdownPosition)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

// Gunakan @mousedown di template untuk memilih agar tidak bentrok dengan blur
const selectFromDropdown = (name: string) => {
  if (isPendampingDisabled(name)) return
  
  // 1. Masukkan langsung ke state pilihan
  selectedPendamping.value = name
  
  // 2. Panggil fungsi add (agar masuk ke list preview kanan)
  addPendampingToDraft()
  
  // 3. Reset input pencarian dan tutup
  searchPendamping.value = ''
  setTimeout(() => {
    isDropdownOpen.value = false
  }, 10)
}

watch(searchPendamping, (newVal) => {
  // Jika user mengetik sesuatu, pastikan dropdown terbuka
  if (newVal.length > 0) {
    isDropdownOpen.value = true
    updateDropdownPosition() // Pastikan posisi tetap akurat
  }
})

const filteredPendamping = computed(() => {
  if (!masterData.value) return []
  
  // 1. Ambil semua list mentah (sesuaikan dengan property data Anda)
  const listPA = masterData.value.pendamping_pa || []
  const listPI = masterData.value.pendamping_pi || []
  const listUmum = masterData.value.pendamping_pa_pi || []
  
  // 2. Gabungkan berdasarkan kategori yang sedang dipilih (Putra/Putri)
  const combined = kategori.value === 'pa' ? [...listPA, ...listUmum] : [...listPI, ...listUmum]
    
  // 3. Bersihkan data (buang yang kosong atau placeholder)
  const baseList = combined.filter(item => item && item !== '-' && !item.includes('pendamping_'))

  // 4. FITUR PENCARIAN (LOGIKA FILTER)
  const query = searchPendamping.value.toLowerCase().trim()
  
  if (!query) return baseList

  // Saring nama yang mengandung kata kunci (Case Insensitive)
  return baseList.filter(p => p.toLowerCase().includes(query))
})

// --- METHODS ---
const addPendampingToDraft = () => {
  if (!selectedPendamping.value) return
  if (!drafting.value.pendamping.find((p: string) => p === selectedPendamping.value)) {
    drafting.value.pendamping.push(selectedPendamping.value)
  }
  selectedPendamping.value = null
}

const isPendampingDisabled = (name: string) => {
  return occupiedStatus.value.has(name)
}

// Menambahkan tipe data (number dan string literal) untuk menghilangkan redline 7006
const removeItemFromDraft = (index: number, type: 'personalia' | 'pendamping') => {
  if (type === 'personalia') {
    drafting.value.personalia.splice(index, 1)
  } else {
    drafting.value.pendamping.splice(index, 1)
  }
}

const handleFinalSubmit = async () => {
  if (keranjang.value.length === 0) return
  if (!confirm(`Simpan ${keranjang.value.length} data ke database?`)) return

  // Mulai loading global
  startAction('Mengirim Data ke Database...')
  
  const result = await simpanKeDatabase()
  
  if (result.success) {
    await fetchSettings() 
    showToast('Berhasil! Data penempatan sudah masuk database', 'success')
  } else {
    showToast(`Gagal: ${result.message}`, 'error')
  }

  // Matikan loading global
  stopAction()
}
</script>

<template>
  <div class="pb-24 px-4 md:px-0">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h2 class="text-orange-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-1">Keorganisasian</h2>
        <h1 class="text-2xl font-bold text-white tracking-tight italic">Penempatan <span class="text-orange-200">Personalia</span></h1>
      </div>
      <div class="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
        <button @click="kategori = 'pa'" :class="kategori === 'pa' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'" class="px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all">Putra (PA)</button>
        <button @click="kategori = 'pi'" :class="kategori === 'pi' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'" class="px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all">Putri (PI)</button>
      </div>
    </header>

    <div v-if="masterData" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div class="lg:col-span-4 space-y-6">
        <div class="glass-card p-6 rounded-3xl border border-white/10 flex flex-wrap gap-6 items-end">
          <div class="flex-1 min-w-[240px] space-y-2">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">1. Tentukan Departemen</label>
              <select v-model="drafting.jabatan" class="input-edit bg-orange-500/5 border-orange-500/20">
                <option :value="null">-- Pilih Jabatan Organisasi --</option>
                <option v-for="j in filteredJabatan" :key="j.nama" :value="j" class="text-slate-900">
                  <template v-if="j.isUsedDB">✅ </template>
                  <template v-else-if="j.isUsedLocal">⏳ </template>
                  
                  {{ j.nama }} 
                  
                  <template v-if="j.isUsedDB"> (di Database)</template>
                  <template v-else-if="j.isUsedLocal"> (di Keranjang)</template>
                </option>
              </select>
          </div>

          <div class="flex-1 min-w-[240px] space-y-2 relative" 
            ref="dropdownRef"
            v-click-outside="() => isDropdownOpen = false">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">2. Pilih Pendamping</label>
            
            <div class="flex gap-2">
              <div class="relative flex-1 cursor-pointer">
                <input 
                  v-model="searchPendamping"
                  @click="toggleDropdown"
                  type="text"
                  placeholder="Cari & Pilih Pendamping..."
                  class="input-edit pr-10 border-orange-500/20 focus:bg-orange-500/10 cursor-pointer"
                  autocomplete="off"
                />
                
                <div 
                  @click.stop="toggleDropdown"
                  class="absolute right-3 top-3.5 text-slate-500 cursor-pointer transition-transform duration-300" 
                  :class="{ 'rotate-180': isDropdownOpen }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <Teleport to="body">
                  <Transition name="fade">
                    <div 
                      v-if="isDropdownOpen" 
                      :style="dropdownStyles"
                      class="fixed z-[9999] bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl"
                      @mousedown.stop 
                    >
                      
                      <div class="max-h-[250px] overflow-y-auto custom-scrollbar py-1">
                        <div 
                          v-for="p in filteredPendamping" 
                          :key="p"
                          @mousedown="selectFromDropdown(p)"
                          class="px-4 py-3 text-sm transition-colors cursor-pointer flex justify-between items-center border-b border-white/5 last:border-0"
                          :class="[
                            isPendampingDisabled(p) 
                              ? 'opacity-40 cursor-not-allowed text-slate-500' 
                              : 'text-slate-200 hover:bg-orange-600/60 hover:text-white'
                          ]"
                        >
                          <span class="font-medium">{{ p }}</span>
                          <span v-if="occupiedStatus.has(p)" class="text-[8px] font-semibold uppercase tracking-tighter px-2 py-0.5 rounded bg-black/40 text-orange-400 border border-orange-400/20">
                            {{ occupiedStatus.get(p) === 'database' ? 'Sudah' : 'Dicalonkan' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </Teleport>
              </div>

              <button @click="addPendampingToDraft(); searchPendamping = ''" class="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white transition-all shadow-lg min-w-[44px] flex items-center justify-center border border-orange-400/20 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">3. Pilih Personalia (Klik Foto)</label>
          <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            <div v-for="p in filteredPersonel" :key="p.id_santri" 
                @click="!occupiedStatus.has(p.id_santri) && addToDraft(p, 'personalia')"
                class="glass-card p-3 rounded-2xl border transition-all relative overflow-hidden group"
                :class="[
                  occupiedStatus.has(p.id_santri) ? 'border-transparent cursor-not-allowed' : 'cursor-pointer hover:border-orange-500/50 border-white/5'
                ]">
              
              <div :class="{ 'grayscale opacity-30 blur-[1px]': occupiedStatus.has(p.id_santri) }" class="transition-all duration-300">
                <div class="aspect-square rounded-xl overflow-hidden mb-3 bg-white/5 relative border border-white/5">
                  <ImagePerson :foto-id="p.foto_profil" />
                </div>
                <!--
                <div class="aspect-square rounded-xl overflow-hidden mb-3 bg-white/5 relative border border-white/5">
                  
                  <img 
                    v-if="getImageUrl(p.foto_profil)"
                    :src="getImageUrl(p.foto_profil)" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    @error="(e) => (e.target as HTMLImageElement).src = ''" 
                  />

                  <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-4 text-center bg-slate-900/50">
                    <svg class="w-10 h-10 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span class="text-[8px] font-black uppercase tracking-widest opacity-40 leading-tight">Foto Belum Tersedia</span>
                  </div>

                </div> -->
                <h4 class="text-[11px] font-bold text-slate-200 truncate">{{ p.nama_lengkap }}</h4>
                <p class="text-[9px] text-slate-500 truncate uppercase tracking-tighter">{{ p.kabupaten }}</p>
              </div>

              <div v-if="occupiedStatus.has(p.id_santri)" 
                  class="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
                <span :class="occupiedStatus.get(p.id_santri) === 'database' ? 'bg-red-600/60 ring-red-400' : 'bg-orange-600/60 ring-orange-400'"
                      class="text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-2xl uppercase tracking-widest ring-2">
                  {{ occupiedStatus.get(p.id_santri) === 'database' ? 'Menjabat' : 'Dicalonkan' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="glass-card p-5 rounded-3xl border border-white/10 mb-6 bg-white/5">
          <div class="flex justify-between items-end mb-3">
            <div>
              <p class="text-[9px] text-slate-500 font-black uppercase tracking-widest">Progres Penempatan</p>
              <h4 class="text-xl font-black text-white">{{ stats.percent }}%</h4>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold text-orange-400">{{ stats.filled }} / {{ stats.total }}</p>
              <p class="text-[8px] text-slate-500 uppercase">Jabatan Terisi</p>
            </div>
          </div>
          
          <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div 
              class="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,88,12,0.5)]"
              :style="{ width: `${stats.percent}%` }"
            ></div>
          </div>
          
          <p v-if="stats.percent === 100" class="text-[9px] text-green-400 mt-3 text-center font-bold animate-bounce">
            ✨ Semua jabatan telah terisi!
          </p>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-orange-500/40 bg-orange-500/5 sticky top-8 shadow-2xl shadow-orange-900/20">
          <h3 class="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Live Preview
          </h3>
          
          <div v-if="drafting.jabatan" class="space-y-6">
            <div class="bg-white/5 p-3 rounded-xl border border-white/5 relative group">
              <p class="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Struktur</p>
              <p class="text-sm font-black text-white uppercase">{{ drafting.jabatan.nama }}</p>
              
              <button @click="drafting.jabatan = null" 
                      class="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3">
              <p class="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Personalia ({{ drafting.personalia.length }})</p>
              <div class="flex flex-wrap gap-2">
                <div v-for="(per, idx) in drafting.personalia" :key="per.id_santri" class="relative group">
                  <img :src="getImageUrl(per.foto_profil)" class="w-10 h-10 rounded-full object-cover border-2 border-orange-500/20 shadow-lg" />
                  <button @click="removeItemFromDraft(idx, 'personalia')" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <p class="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Pendamping</p>
              <div v-for="(pen, idx) in drafting.pendamping" :key="idx" class="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                <span class="text-[10px] text-slate-300 font-medium">{{ pen }}</span>
                <button @click="removeItemFromDraft(idx, 'pendamping')" class="text-slate-500 hover:text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-1 mb-2">
                <div :class="drafting.jabatan ? 'bg-green-500' : 'bg-slate-700'" class="h-1 rounded-full transition-colors"></div>
                <div :class="drafting.personalia.length > 0 ? 'bg-green-500' : 'bg-slate-700'" class="h-1 rounded-full transition-colors"></div>
                <div :class="drafting.pendamping.length > 0 ? 'bg-green-500' : 'bg-slate-700'" class="h-1 rounded-full transition-colors"></div>
              </div>

              <button @click="pushToKeranjang" 
                      :disabled="!isDraftValid"
                      class="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">
                <span v-if="isDraftValid">Daftarkan ke Keranjang</span>
                <span v-else class="text-[8px]">Lengkapi Jabatan, Personil & Pendamping</span>
              </button>
            </div>
          </div>
          <div v-else class="text-center py-10">
            <div class="w-12 h-12 border-2 border-dashed border-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <p class="text-[10px] text-slate-600 italic">Mulai rakit struktur di sebelah kiri</p>
          </div>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-white/10 flex flex-col h-[400px]">
          <h3 class="text-green-400/70 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
            <span>Keranjang</span>
            <span class="bg-white/10 px-2 py-0.5 rounded text-[9px]">{{ keranjang.length }}</span>
          </h3>
          <div class="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <div v-for="(k, idx) in keranjang" :key="k.id_temp" class="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all relative">
              <button @click="keranjang.splice(idx, 1)" class="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <p class="text-[10px] font-black text-orange-200 uppercase mb-1">{{ k.jabatan.nama }}</p>
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <img v-for="p in k.personalia.slice(0, 3)" :key="p.id_santri" :src="getImageUrl(p.foto_profil)" class="w-6 h-6 rounded-full border border-black object-cover" />
                  <div v-if="k.personalia.length > 3" class="w-6 h-6 rounded-full bg-slate-800 border border-black flex items-center justify-center text-[8px] text-white">+{{ k.personalia.length - 3 }}</div>
                </div>
                <span class="text-[9px] text-slate-500 italic">Personel</span>
              </div>
            </div>
          </div>
                
          <button 
            v-if="keranjang.length > 0" 
            @click="handleFinalSubmit"
            :disabled="loading"
            class="w-full mt-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-2xl disabled:opacity-50"
          >
            {{ loading ? 'Sedang Menyimpan...' : 'Simpan ke Database' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="h-[60vh] flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/5">
       <div class="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
       <p class="text-slate-500 animate-pulse uppercase text-[10px] font-black tracking-[0.3em]">
         Menyiapkan Data Master...
       </p>
    </div>
  </div>
</template>

<style scoped>
.input-edit {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all text-sm font-medium;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  @apply bg-white/10 rounded-full; }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
  /*
.input-edit option {
  @apply text-slate-900 bg-white; /* Paksa teks jadi gelap, background putih *
}
*/

/* Jika ingin tetap gelap tapi terlihat */
.input-edit option {
  background-color: #1e293b; 
  color: white;
}
</style>
