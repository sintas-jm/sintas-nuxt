<template>
  <div class="w-full space-y-10 py-2">
    
    <section>
      <div class="border-b-2 border-primary/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-primary text-white w-6 h-6 rounded flex items-center justify-center text-xs">01</span>
          Identitas Calon Santri
        </h3>
      </div>
      
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Nama Lengkap *</label>
          <div class="md:col-span-9">
            <input type="text" v-model="localData.nama_lengkap" @input="handleInput" class="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:border-primary outline-none uppercase font-semibold text-sm transition-all">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Jenjang Daftar *</label>
          <div class="md:col-span-4">
            <select v-model="localData.jenjang_daftar" class="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:border-primary outline-none text-sm">
              <option value="">Pilih Jenjang</option>
              <option value="Reguler">Reguler (Lulusan SD)</option>
              <option value="Akselerasi">Akselerasi (Lulusan SMP)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Gender & Agama</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <select v-model="localData.jenis_kelamin" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary">
              <option value="">Pilih Gender</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <select v-model="localData.agama" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary">
              <option value="Islam">Islam</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Kelahiran *</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.tempat_lahir" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary" placeholder="Tempat Lahir">
            <input type="date" v-model="localData.tanggal_lahir" :max="maxDateSantri" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Status Keluarga</label>
          <div class="md:col-span-9 flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-gray-400">Anak Ke-</span>
              <input type="text" v-model="localData.anak_ke" @input="filterNumber('anak_ke', 2)" class="w-20 px-1 py-1.5 border border-gray-300 rounded text-center text-sm outline-none">
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-gray-400">Dari</span>
              <input type="text" v-model="localData.jumlah_saudara" @input="filterNumber('jumlah_saudara', 2)" class="w-20 px-1 py-1.5 border border-gray-300 rounded text-center text-sm outline-none">
              <span class="text-[11px] text-gray-400">Bersaudara</span>
            </div>
            <select v-model="localData.status_keluarga" class="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <option value="Anak Kandung">Anak Kandung</option>
              <option value="Anak Angkat">Anak Angkat</option>
              <option value="Anak Asuh">Anak Asuh</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="border-b-2 border-emerald-500/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-emerald-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">02</span>
          Wilayah Domisili
        </h3>
      </div>
      
      <div class="space-y-1">
        <div v-for="item in [['Alamat', 'alamat', 'Penuh'], ['Desa', 'desa', 'Setengah'], ['Kecamatan', 'kecamatan', 'Setengah'], ['Kabupaten', 'kabupaten', 'Setengah'], ['Provinsi', 'provinsi', 'Setengah'], ['Kode Pos', 'kode_pos', 'Kecil'], ['Negara', 'negara', 'Setengah']]" :key="item[1]" class="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">{{ item[0] }}</label>
          <div :class="item[2] === 'Penuh' ? 'md:col-span-9' : (item[2] === 'Kecil' ? 'md:col-span-3' : 'md:col-span-5')">
            <input type="text" v-model="localData[item[1]]" @input="item[1] === 'kode_pos' ? filterNumber('kode_pos', 5) : null" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm outline-none focus:border-emerald-500">
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="border-b-2 border-orange-500/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-orange-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">03</span>
          Jasmani & Hobi
        </h3>
      </div>
      
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start border-b border-gray-50 pb-3 md:pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase md:mt-2">Data Fisik</label>
          
          <div class="md:col-span-9 grid grid-cols-1 md:flex md:flex-row gap-4 md:gap-10">
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Gol. Darah</span>
              <select v-model="localData.golongan_darah" class="w-full md:w-24 px-3 py-2 bg-white border border-gray-300 rounded text-sm outline-none focus:border-primary">
                <option value="-">-</option>
                <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Tinggi (cm)</span>
              <input type="text" v-model="localData.tinggi_badan" @input="filterNumber('tinggi_badan', 3)" class="w-full md:w-24 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary" placeholder="000">
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Berat (kg)</span>
              <input type="text" v-model="localData.berat_badan" @input="filterNumber('berat_badan', 3)" class="w-full md:w-24 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary" placeholder="00">
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase mt-2">Kesehatan</label>
          <div class="md:col-span-9 space-y-2">
            <input type="text" v-model="localData.riwayat_penyakit" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-orange-500" placeholder="Riwayat Penyakit">
            <input type="text" v-model="localData.kelainan_jasmani" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-orange-500" placeholder="Kelainan Jasmani">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase mt-2">Minat & Hobi</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" v-model="localData.hobi_seni_budaya" placeholder="Seni / Budaya" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <input type="text" v-model="localData.hobi_olahraga" placeholder="Olahraga" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <input type="text" v-model="localData.hobi_lainnya" placeholder="Lainnya" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none">
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

const maxDateSantri = computed(() => `${new Date().getFullYear() - 11}-12-31`)
const filterNumber = (key, maxLength) => {
  localData.value[key] = String(localData.value[key] || '').replace(/\D/g, '').slice(0, maxLength)
}
const handleInput = () => { localData.value.nama_lengkap = localData.value.nama_lengkap?.toUpperCase() }

onMounted(() => {
  if (!localData.value.agama) localData.value.agama = 'Islam'
  if (!localData.value.negara) localData.value.negara = 'Indonesia'
})
watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>