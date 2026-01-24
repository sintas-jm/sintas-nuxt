<script setup lang="ts">
import { useSantri } from '~/composables/useSantri'
import { useActionLoading } from '~/composables/useActionLoading' // Tambahkan ini

definePageMeta({ layout: 'internal' })

const { santriList, periodeTp, loading, fetchSantri, getFotoUrl } = useSantri()
const { startAction, stopAction } = useActionLoading() // Ambil fungsi loading

const searchQuery = ref('')
const filterJK = ref('')

// Bungkus fetch dengan loading elit
const loadInitialData = async () => {
  if (santriList.value.length === 0) {
    startAction('Menyingkronkan Data...') // Picu overlay
    await fetchSantri()
    stopAction() // Matikan overlay
  }
}

onMounted(() => {
  loadInitialData()
})

const filteredSantri = computed(() => {
  return santriList.value.filter(s => {
    const matchNama = s.nama_lengkap.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                      s.id_santri.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchJK = filterJK.value ? s.jenis_kelamin === filterJK.value : true
    return matchNama && matchJK
  })
})
</script>

<template>
  <div>
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white tracking-tighter">
      <div>
        <h2 class="text-orange-400/80 text-[11px] font-bold tracking-[0.4em] uppercase mb-2">Biodata</h2>
        <h1 class="text-lg font-light">Master <span class="font-semibold text-orange-200 tracking-normal">Data Santri</span></h1>
        <p class="font-xs text-orange-300 tracking-normal uppercase">{{ periodeTp?.nama_tp || '...' }}</p>
      </div>
      <div class="flex justify-end gap-2 w-full md:w-auto">
        <NuxtLink to="/internal" class="glass-card btn-head px-4 py-2 rounded-lg text-xs font-bold uppercase border border-white/10 hover:bg-white/5 transition-all">Dashboard</NuxtLink>
      </div>
    </header>

    <div class="glass-card rounded-xl p-2 md:py-4 md:px-8 mb-6 border border-white/10 flex flex-col md:flex-row gap-3 md:gap-4 items-center">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Cari nama atau NIS..." 
        class="input-style w-full relative flex-1"
      />
      <div class="flex gap-2 w-full md:w-auto md:flex-[1]">
        <button 
          @click="filterJK = filterJK === 'L' ? '' : 'L'"
          :class="filterJK === 'L' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300'"
          class="btn-hover flex-1 px-6 py-2 rounded-xl font-semibold uppercase transition-all border border-white/10 text-[10px]"
        >Putra</button>
        <button 
          @click="filterJK = filterJK === 'P' ? '' : 'P'"
          :class="filterJK === 'P' ? 'bg-pink-600 text-white' : 'bg-white/5 text-slate-300'"
          class="btn-hover flex-1 px-6 py-2 rounded-xl font-semibold uppercase transition-all border border-white/10 text-[10px]"
        >Putri</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20">
       <p class="text-[10px] tracking-[0.3em] text-slate-500 uppercase">Menghubungkan ke Database...</p>
    </div>
    
    <div v-else class="space-y-3">
      <NuxtLink 
        v-for="s in filteredSantri" :key="s.id_santri"
        :to="`/internal/santri/${s.id_santri}`"
        class="flex items-center gap-4 p-4 glass-card border border-white/5 btn-hover rounded-xl transition-all group shadow-lg"
      >
        <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-orange-500/30 bg-slate-800 flex items-center justify-center">
          <img 
            v-if="getFotoUrl(s.foto_profil)" 
            :src="getFotoUrl(s.foto_profil)" 
            class="w-full h-full object-cover" 
            @error="s.foto_profil = ''"
          />
          <svg v-else class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-xs md:text-sm font-semibold text-slate-200 group-hover:text-orange-400 transition-colors uppercase">{{ s.nama_lengkap }}</h3>
          <p class="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{{ s.id_santri }} • {{ s.jenjang_daftar }}</p>
        </div>
        <div class="ml-auto">
          <span :class="s.status_aktif ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'" class="text-[9px] px-2 py-1 rounded border uppercase font-bold">
            {{ s.status_aktif ? 'Aktif' : s.enum_status }}
          </span>
        </div>
      </NuxtLink>
      
      <div v-if="filteredSantri.length === 0" class="text-center py-20 border border-dashed border-white/10 rounded-2xl">
         <p class="text-xs text-slate-500 uppercase tracking-widest italic">Data tidak ditemukan</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-style {
  @apply bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500/50;
}
</style>