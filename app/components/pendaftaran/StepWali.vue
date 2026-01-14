<template>
  <div class="w-full space-y-10 py-2">
    <section>
      <div class="border-b-2 border-teal-500/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-teal-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">06</span>
          Data Wali Santri
        </h3>
      </div>
      
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Identitas Wali *</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.nama_wali" @input="localData.nama_wali = localData.nama_wali.toUpperCase()" class="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-teal-500 font-semibold uppercase" placeholder="Nama Lengkap Wali">
            <input type="text" v-model="localData.hubungan_dengan_santri" class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-teal-500" placeholder="Hubungan (Paman/Bibi/dll)">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Kelahiran Wali</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.tempat_lahir_wali" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-teal-500" placeholder="Tempat Lahir">
            <input type="date" v-model="localData.tgl_lahir_wali" :min="minDateWali" :max="maxDateWali" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-teal-500">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Profil Wali</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.pekerjaan_wali" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Pekerjaan Wali">
            <input type="text" v-model="localData.pendidikan_wali" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Pendidikan Terakhir">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Kontak Wali *</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.hp_wali" @input="filterNumber('hp_wali', 15)" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-teal-500 font-bold" placeholder="No. HP / WA Wali">
            <input type="email" v-model="localData.email_wali" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-teal-500" placeholder="Email Wali (Opsional)">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase mt-2">Alamat Lengkap</label>
          <div class="md:col-span-9 space-y-2">
            <textarea v-model="localData.alamat_wali" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-teal-500" placeholder="Nama Jalan, Dusun, RT/RW"></textarea>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <input type="text" v-model="localData.desa_wali" placeholder="Desa" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <input type="text" v-model="localData.kecamatan_wali" placeholder="Kecamatan" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <input type="text" v-model="localData.kabupaten_wali" placeholder="Kabupaten" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <input type="text" v-model="localData.provinsi_wali" placeholder="Provinsi" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <input type="text" v-model="localData.kode_pos_wali" @input="filterNumber('kode_pos_wali', 5)" placeholder="Kode Pos" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <input type="text" v-model="localData.telp_rumah_wali" placeholder="Telp Rumah Wali" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="bg-amber-50 border border-amber-200 p-4 rounded-lg">
      <div class="flex gap-3">
        <span class="text-xl">ℹ️</span>
        <p class="text-xs text-amber-800 leading-relaxed">
          <strong>Penting:</strong> Data Wali hanya wajib diisi jika calon santri tidak tinggal bersama orang tua kandung atau biaya pendidikan ditanggung oleh pihak wali. Jika data sudah lengkap, silakan klik tombol <strong>Selesaikan Pendaftaran</strong> di bawah.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const localData = ref({ ...props.modelValue })

const filterNumber = (key, maxLength) => {
  localData.value[key] = String(localData.value[key] || '').replace(/\D/g, '').slice(0, maxLength)
}

const maxDateWali = computed(() => {
  const limitYear = new Date().getFullYear() - 27 
  return `${limitYear}-12-31`
})

const minDateWali = computed(() => {
  const limitYear = new Date().getFullYear() - 80
  return `${limitYear}-01-01`
})

watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>