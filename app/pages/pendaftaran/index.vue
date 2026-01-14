<template>
  <section class="py-4">
    <h2 class="text-xl font-semibold mb-1">Dashboard Pendaftaran</h2>
    <p class="text-sm text-muted">Ringkasan pendaftaran santri baru tahun 2026.</p>

    <div class="grid grid-cols-2 gap-3 my-6">
      <div class="bg-white p-4 rounded-lg border border-borderGrey shadow-sm">
        <small class="text-muted block mb-1">Total Pendaftar</small>
        <div class="text-2xl font-bold text-primary">120</div>
      </div>
      
      <div class="bg-white p-4 rounded-lg border border-borderGrey shadow-sm">
        <small class="text-muted block mb-1">Lunas Administrasi</small>
        <div class="text-2xl font-bold text-primary">85</div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <NuxtLink 
        to="/pendaftaran/form" 
        class="bg-primary text-white px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
      >
        Tambah Pendaftar Baru
      </NuxtLink>
      
      <NuxtLink 
        to="/pendaftaran/rekap" 
        class="bg-white text-[#222] border border-borderGrey px-4 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
      >
        Lihat Rekap Data
      </NuxtLink>
    </div>
  </section>
</template>