<script setup>
definePageMeta({
  layout: 'linktree'
})

// 1. Ambil state dan fungsi
const { settings, links, loading, fetchLinktree } = useLinktree()
const { startAction, stopAction } = useActionLoading()

// 2. Fungsi tunggal untuk menangani loading overlay & fetch
const loadEverything = async (isManual = false) => {
  // 1. Cek dulu: Kalau manual refresh ATAU data belum ada, baru nyalakan overlay
  // Jika data sudah ada di cache (hasil jalan-jalan), startAction TIDAK DIPANGGIL
  if (isManual || !settings.value.namaApp) {
    const text = isManual ? 'Sinkronisasi Spreadsheet...' : 'Menyiapkan Akses...'
    startAction(text)
  }
  
  try {
    await fetchLinktree(isManual)
  } finally {
    stopAction()
  }
}

// 3. Jalankan saat mount
onMounted(() => {
  loadEverything()
})

const handleManualRefresh = () => {
  loadEverything(true)
}

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date())
})
</script>

<template>
  <div v-if="settings && settings.namaApp" class="max-w-xl mx-auto px-6 py-12 flex flex-col items-center">
    
    <div class="relative mb-8">
      <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)] transform rotate-2 hover:rotate-0 transition-all duration-500">
        <img src="/img/S3t.png" alt="Profile" class="w-full h-full object-cover">
      </div>
    </div>

    <header class="text-center mb-8" v-if="settings.namaApp">
      <h1 class="text-xl md:text-2xl font-semibold tracking-[0.2em] mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-200 to-orange-500">
        {{ settings.namaApp }}
      </h1>
      <div class="flex items-center justify-center gap-2">
        <span class="h-[1px] w-4 bg-orange-500/50"></span>
        <p class="text-slate-400 font-medium text-[10px] md:text-xs tracking-[0.3em] uppercase">
          Sistem Integrasi Data Santri Matlabus Salik
        </p>
        <span class="h-[1px] w-4 bg-orange-500/50"></span>
      </div>
    </header>

    <div class="w-full mb-6 text-center">
      <p class="text-orange-400/80 text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase">
        {{ formattedDate }}
      </p>
    </div>

    <div class="w-full">
      <div v-if="settings.statusAktif === false || settings.statusAktif === 'FALSE'" 
           class="w-full bg-amber-900/20 border border-amber-700/50 p-4 mb-8 rounded-2xl text-center">
        <p class="text-amber-200 font-bold text-sm">⚠️ KONFIRMASI SISTEM</p>
        <p class="text-amber-100/80 text-xs mt-1">{{ settings.noteStatus }}</p>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink v-for="link in links" :key="link.urut" :to="link.url" class="group flex items-center p-3 glass-card btn-hover rounded-xl transition-all duration-300">
          <div class="flex-shrink-0 w-10 h-10 bg-orange-950/50 text-orange-400 border border-orange-900/50 rounded-xl flex items-center justify-center font-bold shadow-inner">
            {{ link.urut }}
          </div>
          <div class="ml-5">
            <p class="text-base font-normal group-hover:text-orange-300 transition-colors">
              {{ link.nama }}
            </p>
            <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Buka Aplikasi</p>
          </div>
          <div class="ml-auto opacity-30 group-hover:opacity-100 group-hover:text-orange-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </NuxtLink> 
      </div>

      <div class="space-y-3 pt-6">
        <NuxtLink to="/publik/psb"
          class="group flex items-center p-3 glass-card btn-hover rounded-xl transition-all duration-300">
          <div class="flex-shrink-0 w-10 h-10 bg-orange-950/50 text-orange-400 border border-orange-900/50 rounded-xl flex items-center justify-center font-bold shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div class="ml-5">
            <p class="text-base font-normal group-hover:text-orange-300 transition-colors">Pendaftaran Santri Baru</p>
            <p class="text-[10px] text-slate-500 uppercase tracking-tighter">Buka Aplikasi</p>
          </div>
          <div class="ml-auto opacity-30 group-hover:opacity-100 group-hover:text-orange-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </NuxtLink> 
      </div>

      <div class="mt-6 w-full space-y-3">
        <NuxtLink to="/login" 
          class="flex items-center justify-center gap-2 px-3 py-5 glass-card btn-hover text-[12px] text-slate-300 hover:text-orange-400 transition-colors tracking-[0.2em] uppercase border border-dashed border-slate-800 rounded-xl hover:border-orange-900/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Area Staff Internal
        </NuxtLink>

        <button 
          @click="handleManualRefresh"
          class="w-full flex items-center justify-center gap-2 py-3 text-[9px] text-slate-600 hover:text-orange-500 transition-all uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sinkronkan Data Spreadsheet
        </button>
      </div>
    </div>

    <footer class="mt-20 text-center">
      <div class="h-[1px] w-12 bg-orange-900/50 mx-auto mb-4"></div>
      <p class="text-slate-400 text-[10px] tracking-[0.2em] uppercase">© 2026 Sintas Al-Matlab</p>
    </footer>
  </div>
</template>