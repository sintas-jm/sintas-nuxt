<script setup>
  definePageMeta({ layout: 'internal' })

  // Tambahkan import watch dan nextTick
  import { watch, nextTick, ref } from 'vue'

  const { data: rawData, pending, refresh } = await useFetch('/api/piket-imam')

  const jadwalGrouped = computed(() => {
    if (!rawData.value) return {}
    return rawData.value.reduce((acc, item) => {
      // Tambahkan .trim() untuk membuang spasi tak terlihat
      const hari = item.hari.toLowerCase().trim() 
      if (!acc[hari]) acc[hari] = []
      acc[hari].push(item)
      return acc;
    }, {})
  })

  const urutanHari = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'ahad']
  const hariIni = computed(() => {
    const d = new Date().getDay()
    // 0=Ahad, 1=Senin, dst.
    const mapping = ['ahad', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']
    return mapping[d]
  })

  const isEditModalOpen = ref(false)
  const selectedJadwal = ref({
    id: '',
    hari: '',
    waktu: '',
    imam_1: '',
    imam_2: '',
    keterangan: ''
  })

  const openEditModal = (item) => {
    selectedJadwal.value = { ...item } 
    isEditModalOpen.value = true
  }

  const handleUpdate = async () => {
    if (!selectedJadwal.value.imam_1) return alert('Nama Imam 1 tidak boleh kosong')
    
    try {
      const res = await $fetch('/api/piket-imam', {
        method: 'POST',
        body: {
          payload: {
            id: selectedJadwal.value.id,
            imam_1: selectedJadwal.value.imam_1,
            imam_2: selectedJadwal.value.imam_2,
            keterangan: selectedJadwal.value.keterangan
          }
        }
      })

      if (res.success) {
        isEditModalOpen.value = false
        await refresh() // Menggunakan refresh dari useFetch
        alert('Perubahan berhasil disimpan!')
      } else {
        alert('Gagal: ' + res.message)
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi')
    }
  }

  // Definisikan ref sebagai null awalnya (ini menampung elemen DOM tunggal)
  const todayRef = ref(null)

  watch(pending, (isPending) => {
    if (!isPending) {
      // Kita beri jeda sedikit (300ms) agar transisi masuk halaman selesai
      setTimeout(() => {
        nextTick(() => {
          if (todayRef.value) {
            todayRef.value.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        })
      }, 300)
    }
  }, { immediate: true })
</script>

<template>
  <div class="pb-20">
    <header class="mb-8 flex justify-between items-end">
      <div>
        <h2 class="text-orange-400/80 text-[11px] font-bold tracking-[0.4em] uppercase mb-2">Jadwal Rawatib</h2>
        <h1 class="text-lg font-light tracking-tight text-white">Piket <span class="font-semibold text-orange-200">Imam</span></h1>
      </div>
      <NuxtLink to="/internal" class="text-[10px] px-4 py-2 glass-card btn-hover rounded-full uppercase tracking-widest text-white">Dashboard</NuxtLink>
    </header>

    <div class="space-y-4 max-w-[1440px] mx-auto">
      <div v-for="hari in urutanHari" :key="hari">
        <div 
          v-if="jadwalGrouped[hari]" 
          :ref="(el) => { if (hari === hariIni) todayRef = el }"
          :class="[hari === hariIni ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/10']"
          class="glass-card rounded-xl border overflow-hidden transition-all duration-500"
        >

          <div class="px-3 md:px-6 py-2 flex justify-between items-center"
              :class="hari === hariIni ? 'bg-orange-500/20' : 'bg-white/5'">
            <h3 class="capitalize font-bold tracking-[0.2em] text-sm"
                :class="hari === hariIni ? 'text-orange-400' : 'text-slate-400'">
              {{ hari }}
            </h3>
            
            <div v-if="hari === hariIni" class="flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-80"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500/50"></span>
              </span>
              <span class="text-[9px] text-orange-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                Hari Ini
              </span>
            </div>
          </div>
          <!--
          <div class="px-3 md:px-6 py-2 bg-orange-800/10 border-b border-white/5 flex justify-between items-center">
            <h3 class="capitalize font-semibold tracking-[0.2em] text-sm text-orange-200">{{ hari }}</h3>
            <span v-if="hari === hariIni" class="text-[9px] bg-orange-500/40 border border-orange-600/70 glow text-orange-300 px-3 py-0.5 rounded-full font-bold animate-pulse uppercase">Hari Ini</span>
          </div>
          -->

          <div class="divide-y divide-white/5">
            <div v-for="slot in jadwalGrouped[hari]" :key="slot.id || slot.waktu" 
              class="px-3 md:px-6 py-2.5 flex items-center gap-4 md:gap-6 group min-h-[40px]"> <div class="w-16 md:w-24 shrink-0">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-orange-400 transition-colors">
                  {{ slot.waktu }}
                </span>
              </div>

              <div class="flex-1 flex flex-col space-y-1 justify-center"> 
                <div class="text-xs md:text-sm md:text-base font-semibold text-orange-100 uppercase tracking-wide md:tracking-[0.1em] flex items-center gap-2 leading-tight">
                  {{ slot.imam_1 }}
                  <span v-if="slot.imam_2" class="text-[10px] md:text-sm text-slate-500 font-normal md:font-semibold italic lowercase"> & </span>
                </div>
                
                <div v-if="slot.imam_2" class="text-xs md:text-sm md:text-base font-semibold text-orange-100 uppercase tracking-wide md:tracking-[0.1em]  leading-tight">
                  {{ slot.imam_2 }}
                </div>
                
                <div v-if="slot.keterangan" class="flex items-center gap-1.5 pt-1">
                  <div class="w-1 h-1 rounded-full bg-orange-500/50"></div>
                  <span class="text-[9px] uppercase tracking-[0.2em] text-slate-500">{{ slot.keterangan }}</span>
                </div>
              </div>

              <button @click="openEditModal(slot)" 
                class="opacity-0 group-hover:opacity-100 p-2 hover:bg-orange-500/20 rounded-lg text-slate-400 hover:text-orange-300 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isEditModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div class="glass-card p-6 rounded-3xl w-full max-w-md border border-orange-500/30">
        <h2 class="text-orange-200 font-bold mb-4 capitalize">Edit Jadwal: {{ selectedJadwal.hari }} {{ selectedJadwal.waktu }}</h2>
        
        <div class="space-y-4 text-left">
          <div>
            <label class="text-[10px] text-slate-300 uppercase tracking-widest block mb-1">Imam Utama</label>
            <input v-model="selectedJadwal.imam_1" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none">
          </div>
          <div>
            <label class="text-[10px] text-slate-300 uppercase tracking-widest block mb-1">Imam Cadangan</label>
            <input v-model="selectedJadwal.imam_2" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none">
          </div>
          <div>
            <label class="text-[10px] text-slate-300 uppercase tracking-widest block mb-1">Keterangan</label>
            <input v-model="selectedJadwal.keterangan" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none">
          </div>
          
          <div class="flex gap-3 pt-4">
            <button @click="isEditModalOpen = false" class="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-colors">Batal</button>
            <button @click="handleUpdate" class="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/20">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .glow {
    /* Jangan gunakan kurung siku di sini */
    box-shadow: 0 0 10px rgba(249, 115, 22, 0.7);
  }
</style>