<script setup lang="ts">
import { useSantri } from '~/composables/useSantri'

definePageMeta({ layout: 'internal' })
const { santriList, periodeTp, loading, fetchSantri } = useSantri()

const searchQuery = ref('')
const filterJK = ref('') // '' (semua), 'L', 'P'

onMounted(() => {
  if (santriList.value.length === 0) fetchSantri()
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
        <h2 class="text-orange-400/80 text-[11px] font-bold tracking-[0.4em] uppercase mb-2">Administrasi Data</h2>
        <h1 class="text-lg font-light">Master <span class="font-semibold text-orange-200 tracking-normal">Data Santri</span></h1>
        <p class="font-xs text-orange-300 tracking-normal uppercase">{{ periodeTp?.nama_tp || '...' }}</p>
      </div>
      <div class="flex justify-end gap-2 w-full md:w-auto">
        <NuxtLink to="/internal" class="glass-card btn-head">Dashboard</NuxtLink>
      </div>
    </header>

    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Cari nama atau NIS..." 
        class="input-style flex-1"
      />
      <div class="flex gap-2">
        <button 
          @click="filterJK = filterJK === 'L' ? '' : 'L'"
          :class="filterJK === 'L' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'"
          class="px-6 py-3 rounded-xl font-bold transition-all border border-white/10"
        >Putra</button>
        <button 
          @click="filterJK = filterJK === 'P' ? '' : 'P'"
          :class="filterJK === 'P' ? 'bg-pink-600 text-white' : 'bg-white/5 text-slate-400'"
          class="px-6 py-3 rounded-xl font-bold transition-all border border-white/10"
        >Putri</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-slate-500">Memuat data...</div>
    
    <div v-else class="space-y-3">
      <NuxtLink 
        v-for="s in filteredSantri" :key="s.id_santri"
        :to="`/internal/santri/${s.id_santri}`"
        class="flex items-center gap-4 p-4 glass-card border border-white/5 hover:border-orange-500/50 transition-all group"
      >
        <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-orange-500/30">
          <img :src="s.foto_profil || '/img/default-avatar.png'" class="w-full h-full object-cover" />
        </div>
        <div>
          <h3 class="font-bold text-slate-200 group-hover:text-orange-400 transition-colors">{{ s.nama_lengkap }}</h3>
          <p class="text-xs font-mono text-slate-500">{{ s.id_santri }} • {{ s.jenjang_daftar }}</p>
        </div>
        <div class="ml-auto">
          <span :class="s.status_aktif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'" class="text-[10px] px-2 py-1 rounded uppercase font-bold">
            {{ s.status_aktif ? 'Aktif' : s.enum_status }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.input-style {
  @apply bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50;
}
</style>