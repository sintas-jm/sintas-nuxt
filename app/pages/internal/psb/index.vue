<script setup lang="ts">
  definePageMeta({
    layout: 'internal'
  })

  const { periodeInfo, fetchPeriode } = usePendaftaran()
  
  // Menggunakan GlobalLoading State yang kita buat sebelumnya
  const dataLoading = useState('global_data_loading')
  const loadingText = useState('global_loading_text')

  onMounted(async () => {
    // Jika data belum ada, tarik dari server
    if (!periodeInfo.value.id_psb) {
      dataLoading.value = true
      loadingText.value = 'Menyiapkan Informasi PSB...'
      await fetchPeriode()
      dataLoading.value = false
    }
  })
</script>

<template>
  <div>
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h2 class="page-heading-1 mb-2">{{ periodeInfo.nama_psb }}</h2>
        <h1 class="text-lg font-light tracking-tight text-white">
          {{ periodeInfo.first_header }} 
          <span class="font-semibold text-orange-200">{{ periodeInfo.mid_header }}&nbsp;</span>  
          <span class="font-semibold text-orange-400">{{ periodeInfo.last_header }}</span>
        </h1>
      </div>
      <div class="flex justify-end gap-2 w-full md:w-auto">
        <NuxtLink to="/" class="text-[10px] px-4 py-2 glass-card btn-hover rounded-full uppercase tracking-widest text-white border border-white/5">
          Gate Publik
        </NuxtLink>
        <NuxtLink to="/internal" class="text-[10px] px-4 py-2 glass-card btn-hover rounded-full uppercase tracking-widest text-white border border-white/5">
          Dashboard
        </NuxtLink>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <NuxtLink to="/publik/psb/form-pendaftaran"
        class="group p-5 glass-card btn-hover rounded-xl transition-all duration-500 relative overflow-hidden block border border-white/5">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="shrink-0 w-12 h-12 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
            📝
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Formulir Pendaftaran</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-1">Klik disini untuk mendaftar.</p>
            <p class="text-slate-500 text-[11px] italic leading-relaxed">Siapkan Akta Kelahiran, Ijazah, dan KK untuk mempermudah pengisian.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">📝</div>
      </NuxtLink>

      <NuxtLink to="/internal/psb/pendaftar"
        class="group p-5 glass-card btn-hover rounded-xl transition-all duration-500 relative overflow-hidden block border border-white/5">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="shrink-0 w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
            📂
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Rekap Pendaftar</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Cek status dan daftar nama calon santri yang sudah terdaftar secara sistem.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">📂</div>
      </NuxtLink>
    </div>

    <div class="glass-card rounded-xl p-8 border border-white/5 text-center">
      <div class="text-slate-500 text-xs uppercase tracking-[0.2em] mb-2 font-bold">Statistik Pendaftaran</div>
      <div class="text-slate-400 text-sm italic">
        Data statistik grafik pendaftar akan tampil di sini setelah verifikasi data dimulai.
      </div>
    </div>
  </div>
</template>