<template>
  <div class="w-full space-y-10 py-2">
    <section>
      <div class="border-b-2 border-indigo-500/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-indigo-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">02</span>
          Data Sekolah Asal
        </h3>
      </div>
      
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Nama Sekolah *</label>
          <div class="md:col-span-9">
            <input type="text" v-model="localData.nama_sekolah_asal" @input="localData.nama_sekolah_asal = localData.nama_sekolah_asal.toUpperCase()" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-indigo-500 font-semibold uppercase" placeholder="Masukkan Nama Sekolah Asal">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">NISN & Tahun Lulus</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.nisn" @input="filterNumber('nisn', 10)" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none font-mono" placeholder="NISN (10 Digit)">
            <select v-model="localData.tahun_lulus" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <option v-for="y in graduateYears" :key="y" :value="y">Lulus Tahun {{ y }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Dokumen Kelulusan</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.no_ijazah" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Nomor Ijazah">
            <input type="text" v-model="localData.no_skhun" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Nomor SKHUN">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase mt-2">Alamat Sekolah</label>
          <div class="md:col-span-9">
            <textarea v-model="localData.alamat_sekolah_asal" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Alamat Lengkap Sekolah"></textarea>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Wilayah Sekolah</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" v-model="localData.kota_sekolah_asal" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Kota/Kab">
            <input type="text" v-model="localData.provinsi_sekolah_asal" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Provinsi">
            <input type="text" v-model="localData.negara_sekolah_asal" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Negara">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const localData = ref({ ...props.modelValue })

// Logika Tahun Lulus: Hanya 5 tahun kebelakang dari tahun sekarang (2026)
const graduateYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => currentYear - i)
})

const filterNumber = (k, m) => { 
  localData.value[k] = String(localData.value[k] || '').replace(/\D/g, '').slice(0, m) 
}

watch(localData, (v) => emit('update:modelValue', v), { deep: true })
</script>