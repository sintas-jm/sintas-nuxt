<script setup lang="ts">
import { useOP3 } from '~/composables/useOP3'

definePageMeta({ layout: 'internal' })

// CUKUP PANGGIL SATU KALI DI SINI
const { 
  kategori, masterData, drafting, keranjang, loading, occupiedIds, isDraftValid,
  getImageUrl, fetchSettings, addToDraft, pushToKeranjang, simpanKeDatabase 
} = useOP3()

// State lokal untuk pencarian/pemilihan pendamping
const selectedPendamping = ref<string | null>(null)

// Load data saat pertama kali buka halaman
onMounted(() => fetchSettings())

// --- COMPUTED LOGIC ---
const filteredJabatan = computed(() => {
  if (!masterData.value) return []
  const list = kategori.value === 'pa' ? masterData.value.jabatan_pa : masterData.value.jabatan_pi
  
  // Ambil daftar nama jabatan yang sudah ada di keranjang
  const usedJabatanNames = keranjang.value.map(k => k.jabatan.nama)

  return (list || []).map((j: any) => ({
    ...j,
    // Tandai true jika nama jabatan sudah ada di keranjang
    isUsed: usedJabatanNames.includes(j.nama)
  }))
})

const filteredPersonel = computed(() => {
  if (!masterData.value) return []
  const list = kategori.value === 'pa' 
    ? masterData.value.personel_pa 
    : masterData.value.personel_pi
  return list || []
})

const filteredPendamping = computed(() => {
  if (!masterData.value) return []
  
  // Gunakan fallback [] agar tidak error saat spread
  const listPA = masterData.value.pendamping_pa || []
  const listPI = masterData.value.pendamping_pi || []
  const listUmum = masterData.value.pendamping_pa_pi || []
  
  // Gabungkan dan bersihkan dari nilai null/kosong/header
  const combined = kategori.value === 'pa' 
    ? [...listPA, ...listUmum] 
    : [...listPI, ...listUmum]
    
  // Filter untuk membuang string kosong atau '-' yang mungkin terbawa dari sheet
  // Di dalam computed filteredPendamping
  return combined.filter(item => 
    item && 
    item !== '-' && 
    item !== 'pendamping_pa' && 
    item !== 'pendamping_pi' && 
    item !== 'pendamping_pa_pi'
  )
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
  // 1. Cek apakah ini pendamping umum (kebal rule)
  const listUmum = masterData.value?.pendamping_pa_pi || []
  if (listUmum.includes(name)) return false
  
  // 2. Jika bukan umum, cek apakah sudah ada di occupiedIds
  return occupiedIds.value.has(name)
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
  if (!confirm(`Simpan ${keranjang.value.length} data jabatan ke database?`)) return

  const result = await simpanKeDatabase()
  
  if (result.success) {
    alert('Penempatan Berhasil Disimpan!')
  } else {
    alert('Gagal: ' + result.message)
  }
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

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div class="lg:col-span-4 space-y-6">
        <div class="glass-card p-6 rounded-3xl border border-white/10 flex flex-wrap gap-6 items-end">
          <div class="flex-1 min-w-[240px] space-y-2">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">1. Tentukan Departemen</label>
              <select v-model="drafting.jabatan" class="input-edit bg-orange-500/5 border-orange-500/20">
                <option :value="null">-- Pilih Jabatan Organisasi --</option>
                <option v-for="j in filteredJabatan" :key="j.nama" :value="j" class="text-slate-900">
                  {{ j.isUsed ? '✔ ' : '' }}{{ j.nama }} {{ j.isUsed ? '(Sudah di Keranjang)' : '' }}
                </option>
              </select>
          </div>

          <div class="flex-1 min-w-[240px] space-y-2">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">2. Pilih Pendamping</label>
            <div class="flex gap-2">
              <select v-model="selectedPendamping" class="input-edit">
                <option :value="null">-- Pilih Guru/Pendamping --</option>
                <option v-for="p in filteredPendamping" 
                        :key="p" 
                        :value="p" 
                        :disabled="isPendampingDisabled(p)">
                  {{ p }} {{ isPendampingDisabled(p) ? '(Menjabat)' : '' }}
                </option>
              </select>
              <button @click="addPendampingToDraft" class="p-2 bg-orange-600 hover:bg-orange-500/50 rounded-lg border border-orange-600/50 hover:border hover:border-orange-400/70 text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">3. Pilih Personalia (Klik Foto)</label>
          <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            <div v-for="p in filteredPersonel" :key="p.id_santri" 
                @click="!occupiedIds.has(p.id_santri) && addToDraft(p, 'personalia')"
                class="glass-card p-3 rounded-2xl border transition-all relative overflow-hidden group"
                :class="[
                  occupiedIds.has(p.id_santri) ? 'border-transparent cursor-not-allowed' : 'cursor-pointer hover:border-orange-500/50 border-white/5'
                ]">
              
              <div :class="{ 'grayscale opacity-30 blur-[1px]': occupiedIds.has(p.id_santri) }" class="transition-all duration-300">
                <div class="aspect-square rounded-xl overflow-hidden mb-3 bg-white/5 relative">
                  <img :src="getImageUrl(p.foto_profil)" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 class="text-[11px] font-bold text-slate-200 truncate">{{ p.nama_lengkap }}</h4>
                <p class="text-[9px] text-slate-500 truncate uppercase tracking-tighter">{{ p.kabupaten }}</p>
              </div>

              <div v-if="occupiedIds.has(p.id_santri)" 
                  class="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
                <span class="bg-red-600/40 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-2xl uppercase tracking-widest ring-2 ring-red-400/70">
                  Menjabat
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="glass-card p-6 rounded-3xl border border-orange-500/40 bg-orange-500/5 sticky top-8 shadow-2xl shadow-orange-900/20">
          <h3 class="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Live Review
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
          <h3 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
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
  </div>
</template>

<style scoped>
.input-edit {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all text-sm font-medium;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  @apply bg-white/10 rounded-full; }

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
