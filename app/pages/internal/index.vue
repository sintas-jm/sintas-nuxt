<script setup>
definePageMeta({
  layout: 'internal'
})

const staffName = ref('Kakak Admin') // Nanti bisa dinamis
</script>

<template>
  <div>
    <header class="mb-8">
      <h2 class="text-orange-400/80 text-[11px] font-bold tracking-[0.4em] uppercase mb-2">Pusat Kendali</h2>
      <h1 class="text-l font-light tracking-tight text-slate-300">Selamat Bekerja, <span class="font-semibold text-orange-200">{{ staffName }}</span></h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink to="/pendaftaran/rekap" 
        class="group p-4 glass-card btn-hover rounded-2xl transition-all duration-500 relative overflow-hidden block">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="shrink-0 w-12 h-12 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
            📂
          </div>
          <div>
            <h3 class="text-l font-semibold mb-2 text-white">Data Pendaftaran</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Kelola dan verifikasi berkas calon santri baru secara real-time.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">📝</div>
      </NuxtLink>

      <div class="p-4 glass-card opacity-50 rounded-2xl relative overflow-hidden cursor-not-allowed">
        <div class="relative z-10 flex items-start gap-5">
          <div class="shrink-0 w-12 h-12 bg-slate-800 text-slate-500 border border-slate-700 rounded-xl flex items-center justify-center text-2xl">
            🔒
          </div>
          <div>
            <h3 class="text-l font-semibold mb-2 text-slate-300">Presensi Santri</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Modul presensi digital sedang dalam tahap pengembangan sistem.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>