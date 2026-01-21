// app/pages/publik/psb/index.vue
<script setup lang="ts">
import { Bar, Doughnut } from 'vue-chartjs'
import { 
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, 
  CategoryScale, LinearScale, ArcElement 
} from 'chart.js'

import { useStatistik } from '~/composables/useStatistik'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

definePageMeta({ layout: 'default' })

const { periodeInfo, fetchPeriode } = usePendaftaran()
const { stats, fetchStats } = useStatistik()
const { startAction, stopAction } = useActionLoading()

onMounted(async () => {
  startAction('Menyiapkan Dashboard...')
  // Ambil data secara paralel
  await Promise.all([
    !periodeInfo.value.id_psb ? fetchPeriode() : Promise.resolve(),
    fetchStats()
  ])
  stopAction()
})

// Konfigurasi Chart Gender & Jenjang
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '50%'
}

const genderData = computed(() => ({
  labels: ['Putra', 'Putri'],
  datasets: [{
    data: [stats.value?.L || 0, stats.value?.P || 0], // data: [Number(stats.value?.L || 0), Number(stats.value?.P || 0)] as number[]
    backgroundColor: ['#7dd3fc', '#f472b6'],
    borderWidth: 0
  }]
}))

const jenjangData = computed(() => ({
  labels: ['Reguler', 'Akselerasi'],
  datasets: [{
    data: [stats.value?.reguler || 0, stats.value?.akselerasi || 0],
    backgroundColor: ['#6366f1', '#f59e0b'],
    borderWidth: 0
  }]
}))

// Konfigurasi Chart Kabupaten (Horizontal Bar)
// Konfigurasi Chart Kabupaten (Horizontal Bar)
const kabupatenData = computed(() => {
  // Pastikan stats ada dan memiliki data kabupaten
  const kabEntries = stats.value?.kabupaten ? Object.entries(stats.value.kabupaten) : []
  
  const sorted = kabEntries
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10)

  return {
    labels: sorted.map(k => k[0]),
    datasets: [{
      label: 'Santri',
      // Gunakan Type Casting 'as number[]' di sini
      data: sorted.map(k => k[1]) as number[], 
      backgroundColor: '#10b981',
      borderRadius: 8
    }]
  }
})
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h2 class="page-heading-1 mb-2">{{ periodeInfo.nama_psb || 'Periode PSB' }}</h2>
        <h1 class="text-lg font-light tracking-tight text-white tracking-[0.1em]">
          {{ periodeInfo.first_header }} 
          <span class="font-semibold text-orange-200">{{ periodeInfo.mid_header }}</span> 
          {{ periodeInfo.last_header }}
        </h1>
      </div>
      <div class="flex justify-end gap-2 w-full md:w-auto">
        <NuxtLink to="/publik/psb/form-pendaftaran" class="glass-card btn-head">Daftar Sekarang</NuxtLink>
        <NuxtLink to="/publik/psb/rekap-pendaftar" class="glass-card btn-head">Lihat Pendaftar</NuxtLink>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <NuxtLink to="/publik/psb/form-pendaftaran"
        class="group glass-card btn-body">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="emoji-btn bg-orange-500/10 text-orange-400 border border-orange-500/20 transition-all">📝</div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Daftar Sekarang</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-1">Klik disini untuk mendaftar.</p>
            <p class="text-slate-500 text-[11px] italic leading-relaxed">Siapkan Akta Kelahiran, Ijazah, dan KK untuk mempermudah pengisian.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">📝</div>
      </NuxtLink>

      <NuxtLink to="/publik/psb/rekap-pendaftar"
        class="group glass-card btn-body">
        <div class="relative z-10 flex items-start gap-5"> 
          <div class="emoji-btn bg-blue-500/10 text-blue-400 border border-blue-500/20 transition-all">📂</div>
          <div>
            <h3 class="text-lg font-semibold mb-1 text-slate-200">Lihat Pendaftar</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Lihat daftar calon santri yang sudah terdaftar secara sistem.</p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">📂</div>
      </NuxtLink>
    </div>

    <div class="relative overflow-hidden glass-card rounded-3xl p-8 border border-white/5 bg-gradient-to-br from-orange-600/20 to-transparent">
      <div class="relative z-10 text-center">
        <h4 class="text-xs font-semibold text-orange-300 uppercase tracking-[0.2em] mb-4">Total Pendaftar Terverifikasi</h4>
        <div class="text-5xl md:text-7xl font-bold text-white tracking-tighter">
          {{ stats?.total || 0 }}
        </div>
        <div class="w-12 h-1 bg-orange-500/50 mx-auto mt-6 rounded-full"></div>
      </div>
      <div class="absolute -right-10 -bottom-10 text-[12rem] text-white/[0.03] font-black italic">PSB</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="glass-card rounded-3xl p-6 border border-white/5">
        <h4 class="text-sm font-bold text-orange-300 mb-6 flex items-center gap-2">
          <span>🚻</span> Komposisi Gender
        </h4>
        <div class="flex items-center gap-8">
          <div class="w-32 h-32 shrink-0">
            <Doughnut :data="genderData" :options="chartOptions" />
          </div>
          <div class="space-y-4 w-full">
            <div class="flex justify-between items-end border-b border-white/5 pb-2">
              <span class="text-xs text-slate-300 uppercase tracking-widest">Putra</span>
              <span class="text-xl font-bold text-sky-300">{{ stats?.L || 0 }}</span>
            </div>
            <div class="flex justify-between items-end border-b border-white/5 pb-2">
              <span class="text-xs text-slate-300 uppercase tracking-widest">Putri</span>
              <span class="text-xl font-bold text-pink-400">{{ stats?.P || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-3xl p-6 border border-white/5">
        <h4 class="text-sm font-bold text-orange-300 mb-6 flex items-center gap-2">
          <span>🎓</span> Komposisi Program
        </h4>
        <div class="flex items-center gap-8">
          <div class="w-32 h-32 shrink-0">
            <Doughnut :data="jenjangData" :options="chartOptions" />
          </div>
          <div class="space-y-4 w-full">
            <div class="flex justify-between items-end border-b border-white/5 pb-2">
              <span class="text-xs text-slate-300 uppercase tracking-widest">Reguler</span>
              <span class="text-xl font-bold text-indigo-400">{{ stats?.reguler || 0 }}</span>
            </div>
            <div class="flex justify-between items-end border-b border-white/5 pb-2">
              <span class="text-xs text-slate-300 uppercase tracking-widest">Akselerasi</span>
              <span class="text-xl font-bold text-amber-500">{{ stats?.akselerasi || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-card rounded-3xl p-6 border border-white/5">
      <h4 class="text-sm font-bold text-orange-300 mb-6 flex items-center gap-2">
        <span>📍</span> Top 10 Sebaran Kabupaten
      </h4>
      <div class="h-64">
        <Bar 
          :data="kabupatenData" 
          :options="{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#64748b' } },
              y: { grid: { display: false }, ticks: { color: '#f1f5f9' } }
            }
          }" 
        />
      </div>
    </div>
  </div>
</template>