<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { periodeInfo, fetchPeriode } = usePendaftaran()
const { pendaftarList, fetchRekap } = useRekap() // Gunakan composable baru

const dataLoading = useState('global_data_loading')
const loadingText = useState('global_loading_text')

// Filter state tetap di Page karena ini urusan UI
const search = ref('')
const filterJenjang = ref('')
const filterJk = ref('')

const filteredPendaftar = computed(() => {
  return pendaftarList.value.filter((item) => {
    const matchSearch = item.nama_lengkap.toLowerCase().includes(search.value.toLowerCase()) ||
                        item.id_pendaftar.toLowerCase().includes(search.value.toLowerCase())
    const matchJenjang = !filterJenjang.value || item.jenjang_daftar === filterJenjang.value
    const matchJk = !filterJk.value || item.jenis_kelamin === filterJk.value
    return matchSearch && matchJenjang && matchJk
  })
})

onMounted(async () => {
  dataLoading.value = true
  loadingText.value = 'Sinkronisasi Data...'
  
  // Ambil periode & rekap secara paralel agar cepat
  await Promise.all([
    !periodeInfo.value.id_psb ? fetchPeriode() : Promise.resolve(),
    fetchRekap()
  ])
  
  dataLoading.value = false
})

const getStatusClass = (status: string) => {
  const s = (status || '').toUpperCase()
  if (s.includes('Data Diterima')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (s.includes('Lengkapi Data Ketika Daftar Ulang')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
}

const handlePrint = (item: any) => {
  // Simpan data item yang diklik ke localStorage
  localStorage.setItem('print_data_formulir', JSON.stringify(item))
  
  // Buka tab baru ke halaman print
  window.open('/print/formulir', '_blank')
}
</script>

<template>
  <div class="pb-20">
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white tracking-tighter">
      <div>
        <h2 class="page-heading-1 mb-2">{{ periodeInfo.nama_psb }}</h2>
        <h1 class="text-lg font-light">Rekap <span class="font-semibold text-orange-200 tracking-normal">Pendaftar</span></h1>
      </div>
      <NuxtLink to="/publik/psb" class="text-[10px] px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all uppercase tracking-widest font-bold">
        ← Kembali
      </NuxtLink>
    </header>

    <div class="glass-card rounded-xl p-2 md:py-4 md:px-8 mb-6 border border-white/10 flex flex-col md:flex-row gap-3 md:gap-4 items-center">
      
      <div class="w-full md:flex-1 relative">
        <input v-model="search" type="text" placeholder="Cari Nama atau No. Registrasi..." 
          class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all">
      </div>

      <div class="flex gap-2 w-full md:w-auto md:flex-[1]">
        
        <select v-model="filterJenjang" class="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500/50 min-w-0">
          <option value="">Semua Jenjang</option> 
          <option value="Reguler">Reguler</option>
          <option value="Akselerasi">Akselerasi</option>
        </select>
        
        <select v-model="filterJk" class="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500/50 min-w-0">
          <option value="">Semua JK</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
    </div>

    <div class="space-y-3">
      <div v-if="filteredPendaftar.length === 0" class="text-center py-20 glass-card rounded-xl border border-white/5">
        <p class="text-slate-500 text-sm italic">Data pendaftar tidak ditemukan...</p>
      </div>

      <div v-for="item in filteredPendaftar" :key="item.id_pendaftar" 
        class="glass-card rounded-xl p-2 md:px-8 md:py-4 border border-white/5 flex md:grid md:grid-cols-12 items-center justify-between hover:border-white/20 transition-all group">
        
        <div class="flex items-center gap-3 md:col-span-6 min-w-0">

          <div class="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white border border-white/10 shrink-0">
            {{ (item.nama_lengkap || '?').substring(0, 1) }}
          </div>

          <div class="min-w-0">
            <h4 class="text-sm font-bold text-orange-200 uppercase tracking-tight leading-none mb-2 truncate">
              {{ item.nama_lengkap }}
            </h4>
            <div class="flex flex-col gap-1.5">
              <span class="text-[11px] text-slate-300 font-mono leading-none truncate">{{ item.id_pendaftar }}</span>
              <div class="flex md:hidden">
                <span :class="['px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-tighter shadow-sm', getStatusClass(item.status_pendaftaran)]">
                  {{ item.status_pendaftaran || 'Proses Verifikasi' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="md:hidden flex flex-col items-end gap-1 shrink-0 ml-2">
          <span class="text-[9px] font-semibold text-slate-300 uppercase tracking-widest">{{ item.jenjang_daftar }}</span>
          <span class="text-[9px] text-slate-300">{{ item.kabupaten }}</span>
        </div>

        <div class="hidden md:flex md:col-span-2 justify-start">
          <span class="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">{{ item.jenjang_daftar }}</span>
        </div>
        
        <div class="hidden md:flex md:col-span-2 justify-start">
          <span class="text-[11px] text-slate-300 truncate pr-4">{{ item.kabupaten }}</span>
        </div>

        <div class="hidden md:flex md:col-span-2 justify-end">
          <span :class="['px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tighter shadow-sm', getStatusClass(item.status_pendaftaran)]">
            {{ item.status_pendaftaran || 'Proses Verifikasi' }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
select option {
  @apply bg-[#0f172a] space-y-1 text-slate-100/90;
}
</style>