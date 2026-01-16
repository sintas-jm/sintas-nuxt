<template>
  <div>
    <header class="mb-8 flex justify-between items-end">
      <div>
        <h2 class="text-orange-400/80 text-[11px] font-bold tracking-[0.4em] uppercase mb-2">Halaman Public</h2>
        <h1 class="text-lg font-light tracking-tight text-white">Pendaftaran <span class="font-semibold text-orange-200">Santri Baru</span></h1>
        <p class="text-sm text-muted">Ringkasan pendaftaran santri baru tahun 2026.</p>
      </div>
      <NuxtLink to="/internal" class="text-[10px] px-4 py-2 glass-card btn-hover rounded-full uppercase tracking-widest text-white">
        Dashboard
      </NuxtLink>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink to="/pendaftaran/form" 
        class="group p-4 glass-card btn-hover rounded-2xl transition-all duration-500 relative overflow-hidden block">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="shrink-0 w-12 h-12 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
            📂
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Form Pendaftaran</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Siapkan akte-kelahiran, ijazah, id card untuk mempermudah pengisian data.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">📝</div>
      </NuxtLink>
      <NuxtLink to="/pendaftaran/form" 
        class="group p-4 glass-card btn-hover rounded-2xl transition-all duration-500 relative overflow-hidden block">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="shrink-0 w-12 h-12 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
            📂
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Form Pendaftaran</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Siapkan akte-kelahiran, ijazah, id card untuk mempermudah pengisian data.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">📝</div>
      </NuxtLink>

    </div>
  </div>
</template>