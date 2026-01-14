<!--
<template>
  <section class="py-4">
    <h1 class="text-2xl font-semibold mb-1">Selamat Datang</h1>
    <p class="text-muted mb-6">Pusat layanan Sintas</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink to="/pendaftaran" class="group bg-white p-6 rounded-lg border border-borderGrey hover:border-primary transition-all shadow-sm">
        <h3 class="font-semibold text-lg group-hover:text-primary transition-colors">Pendaftaran</h3>
        <p class="text-sm text-muted">Form pendaftaran santri</p>
      </NuxtLink>

      <NuxtLink to="/presensi" class="group bg-white p-6 rounded-lg border border-borderGrey hover:border-primary transition-all shadow-sm">
        <h3 class="font-semibold text-lg group-hover:text-primary transition-colors">Presensi</h3>
        <p class="text-sm text-muted">Presensi pasca liburan</p>
      </NuxtLink>

      <NuxtLink to="/informasi" class="group bg-white p-6 rounded-lg border border-borderGrey hover:border-primary transition-all shadow-sm">
        <h3 class="font-semibold text-lg group-hover:text-primary transition-colors">Informasi</h3>
        <p class="text-sm text-muted">Jadwal & info harian</p>
      </NuxtLink>
    </div>
  </section>
</template>
-->

<script setup>
definePageMeta({
  layout: 'linktree' // <--- Pakai layout baru
})

const { data, pending } = await useFetch('/api/settings')

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date())
})
</script>

<template>
  <div class="max-w-xl mx-auto px-6 py-12 flex flex-col items-center">
    <div class="relative mb-8">
      <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)] transform rotate-2 hover:rotate-0 transition-all duration-500">
        <img src="https://lh3.googleusercontent.com/d/YOUR_IMAGE_ID" alt="Profile" class="w-full h-full object-cover">
      </div>
    </div>

    <header class="text-center mb-8" v-if="data">
      <h1 class="text-3xl md:text-5xl font-semibold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-200 to-orange-500">
        {{ data.settings.namaApp }}
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

    <div v-if="pending" class="text-orange-400 animate-pulse">Memuat data...</div>

    <div v-else-if="data" class="w-full">
      <div v-if="data.settings.statusAktif === false || data.settings.statusAktif === 'FALSE'" 
           class="w-full bg-amber-900/20 border border-amber-700/50 p-4 mb-8 rounded-2xl text-center">
        <p class="text-amber-200 font-bold text-sm">⚠️ KONFIRMASI SISTEM</p>
        <p class="text-amber-100/80 text-xs mt-1">{{ data.settings.noteStatus }}</p>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink v-for="link in data.links" :key="link.urut" :to="link.url"
           class="group flex items-center p-3 glass-card btn-hover rounded-2xl transition-all duration-300">
          
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
    </div>

    <footer class="mt-20 text-center">
      <div class="h-[1px] w-12 bg-orange-900/50 mx-auto mb-4"></div>
      <p class="text-slate-400 text-[10px] tracking-[0.2em] uppercase">© 2026 Sintas Al-Matlab</p>
    </footer>
  </div>
</template>