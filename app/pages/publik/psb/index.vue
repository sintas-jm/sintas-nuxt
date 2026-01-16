<script setup>
  definePageMeta({
    layout: 'default'
  })

  const firstJudul = ref('PSB') // Nanti bisa dinamis mengambil dari sheet, petugas akan menentukan sendiri judul psb
  const midJudul = ref('Tahun Pelajaran') // Nanti bisa dinamis mengambil dari sheet, petugas akan menentukan sendiri judul psb
  const lasttJudul = ref('2026/2027') // Nanti bisa dinamis mengambil dari sheet, petugas akan menentukan sendiri judul psb
</script>

<template>
  <div>
    <header class="mb-8 flex justify-between items-end">
      <div>
        <h2 class="text-orange-400/80 text-[11px] font-bold tracking-[0.4em] uppercase mb-2">PSB</h2>
        <h1 class="text-lg font-light tracking-tight text-white">
          {{firstJudul}} <span class="font-semibold text-orange-200">{{midJudul}} </span> <span class="font-semibold text-orange-400">{{lasttJudul}}</span>
        </h1>
      </div>
      <div class="flex justifify-end gap-1">
        <NuxtLink to="/publik/psb/form-pendaftaran" class="text-[10px] px-4 py-2 glass-card btn-hover rounded-full uppercase tracking-widest text-white">Form Mendaftar</NuxtLink>
        <NuxtLink to="/publik/psb/rekap-pendaftar" class="text-[10px] px-4 py-2 glass-card btn-hover rounded-full uppercase tracking-widest text-white">Rekap Pendaftar</NuxtLink>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <NuxtLink to="/publik/psb/form-pendaftaran"
        class="group p-4 glass-card btn-hover rounded-2xl transition-all duration-500 relative overflow-hidden block">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="shrink-0 w-12 h-12 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
            📝
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Formulir Pendaftaran</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Klik disini untuk mendaftar.</p>
            <p class="text-slate-400 text-sm leading-relaxed">Siapkan akte-kelahiran, ijazah, id untuk pengisian formulir.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">📝</div>
      </NuxtLink>
      <NuxtLink to="/publik/psb/rekap-pendaftar"
        class="group p-4 glass-card btn-hover rounded-2xl transition-all duration-500 relative overflow-hidden block">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="shrink-0 w-12 h-12 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
            📂
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Rekap Pendaftar</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Klik disini untuk melihat list pendaftar (calon santri).</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">📝</div>
      </NuxtLink>
    </div>

    <div>
      <div>
        kedepan berisi data statistik untuk konsumsi publik
      </div>
    </div>
  </div>
</template>