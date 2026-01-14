<template>
  <div class="w-full space-y-10 py-2">
    <section>
      <div class="border-b-2 border-primary/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-primary text-white w-6 h-6 rounded flex items-center justify-center text-xs">03</span>
          Data Ayah Kandung
        </h3>
      </div>
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Nomor Kartu Keluarga *</label>
          <div class="md:col-span-5">
            <input type="text" v-model="localData.no_kk" @input="filterNumber('no_kk', 16)" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary font-mono" placeholder="16 Digit No. KK">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Identitas Ayah *</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.nama_ayah" @input="localData.nama_ayah = localData.nama_ayah.toUpperCase()" class="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary font-semibold" placeholder="Nama Lengkap Ayah">
            <input type="text" v-model="localData.nik_ayah" @input="filterNumber('nik_ayah', 16)" class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary font-mono" placeholder="NIK Ayah">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Profil Ayah</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" v-model="localData.tempat_lahir_ayah" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary" placeholder="Tempat Lahir">
            <input type="date" v-model="localData.tgl_lahir_ayah" :min="minDateOrtua" :max="maxDateOrtua" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary">
            <select v-model="localData.agama_ayah" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <option value="Islam">Islam</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Pekerjaan & Pendidikan</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.pekerjaan_ayah" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Pekerjaan Ayah">
            <input type="text" v-model="localData.pendidikan_ayah" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Pendidikan Terakhir">
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="border-b-2 border-pink-500/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-pink-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">04</span>
          Data Ibu Kandung
        </h3>
      </div>
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Identitas Ibu *</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.nama_ibu" @input="localData.nama_ibu = localData.nama_ibu.toUpperCase()" class="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-pink-500 font-semibold" placeholder="Nama Lengkap Ibu">
            <input type="text" v-model="localData.nik_ibu" @input="filterNumber('nik_ibu', 16)" class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-pink-500 font-mono" placeholder="NIK Ibu">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Profil Ibu</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="text" v-model="localData.tempat_lahir_ibu" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-pink-500" placeholder="Tempat Lahir">
            <input type="date" v-model="localData.tgl_lahir_ibu" :min="minDateOrtua" :max="maxDateOrtua" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-pink-500">
            <select v-model="localData.agama_ibu" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <option value="Islam">Islam</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Pekerjaan & Pendidikan</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.pekerjaan_ibu" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Pekerjaan Ibu">
            <input type="text" v-model="localData.pendidikan_ibu" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Pendidikan Terakhir">
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="border-b-2 border-primary/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          Status Keberadaan Orang Tua
        </h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Kondisi Orang Tua *</label>
        <div class="md:col-span-9 flex flex-wrap gap-3">
          <select v-model="localData.orangtua_hidup" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-primary">
            <option value="Keduanya masih hidup">Lengkap (Ayah & Ibu Masih Hidup)</option>
            <option value="Ayah Saja">Hanya Ayah (Ibu Meninggal/Cerai)</option>
            <option value="Ibu saja">Hanya Ibu (Ayah Meninggal/Cerai)</option>
            <option value="Yatim Piatu">Yatim Piatu</option>
          </select>
        </div>
      </div>
    </section>

    <section>
      <div class="border-b-2 border-emerald-500/20 pb-1 mb-4 flex justify-between items-end">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          Domisili Orang Tua
        </h3>
        <button type="button" @click="copyAlamatSantri" class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200 transition-colors font-bold uppercase">
          Sama dengan alamat santri
        </button>
      </div>
      
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Alamat Lengkap</label>
          <div class="md:col-span-9">
            <input type="text" v-model="localData.alamat_orangtua" class="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-emerald-500">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Wilayah</label>
          <div class="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-2">
            <input type="text" v-model="localData.desa_ortu" placeholder="Desa" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <input type="text" v-model="localData.kecamatan_ortu" placeholder="Kecamatan" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <input type="text" v-model="localData.kabupaten_ortu" placeholder="Kab/Kota" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <input type="text" v-model="localData.provinsi_ortu" placeholder="Provinsi" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <input type="text" v-model="localData.kode_pos_ortu" @input="filterNumber('kode_pos_ortu', 5)" placeholder="Kode Pos" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
            <input type="text" v-model="localData.telp_rumah" placeholder="Telp Rumah (Jika ada)" class="px-3 py-2 border border-gray-300 rounded text-sm outline-none">
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="border-b-2 border-emerald-500/20 pb-1 mb-4">
        <h3 class="text-md font-bold text-gray-800 flex items-center gap-2">
          <span class="bg-emerald-500 text-white w-6 h-6 rounded flex items-center justify-center text-xs">05</span>
          Kontak & Informasi Tambahan
        </h3>
      </div>
      
      <div class="space-y-1">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">WhatsApp Orang Tua *</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.hp_ayah" @input="filterNumber('hp_ayah', 15)" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Nomor HP Ayah">
            <input type="text" v-model="localData.hp_ibu" @input="filterNumber('hp_ibu', 15)" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none" placeholder="Nomor HP Ibu">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Kontak Utama & Email</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <input type="text" v-model="localData.hp_informasi" @input="filterNumber('hp_informasi', 15)" class="w-full md:w-1/2 px-3 py-2 border-2 border-emerald-500 rounded text-sm outline-none font-bold" placeholder="HP Utama (WA Panitia)">
            <input type="email" v-model="localData.email_ortu" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-emerald-500" placeholder="Alamat Email Aktif">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-gray-50 pb-2">
          <label class="md:col-span-3 text-[12px] font-bold text-gray-600 uppercase">Kondisi Ekonomi</label>
          <div class="md:col-span-9 flex flex-col md:flex-row gap-2">
            <select v-model="localData.penghasilan_bulanan" class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded text-sm outline-none">
              <option value="">Pilih Penghasilan Bulanan</option>
              <option value="< 1.000.000">< 1.000.000</option>
              <option value="1.000.000 - 3.000.000">1.000.000 - 3.000.000</option>
              <option value="3.000.000 - 5.000.000">3.000.000 - 5.000.000</option>
              <option value="> 5.000.000">> 5.000.000</option>
            </select>
            <select v-model="localData.penanggung_santri" class="w-full md:w-1/2 px-3 py-2 border-2 border-emerald-500 rounded text-sm font-bold outline-none bg-emerald-50">
              <option value="Orang Tua">Penanggung Biaya: Orang Tua</option>
              <option value="Wali">Penanggung Biaya: Wali</option>
            </select>
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

const maxDateOrtua = computed(() => {
  const limitYear = new Date().getFullYear() - 27 
  return `${limitYear}-12-31`
})

const minDateOrtua = computed(() => {
  const limitYear = new Date().getFullYear() - 80
  return `${limitYear}-01-01`
})

const copyAlamatSantri = () => {
  localData.value.alamat_orangtua = localData.value.alamat
  localData.value.desa_ortu = localData.value.desa
  localData.value.kecamatan_ortu = localData.value.kecamatan
  localData.value.kabupaten_ortu = localData.value.kabupaten
  localData.value.provinsi_ortu = localData.value.provinsi
  localData.value.kode_pos_ortu = localData.value.kode_pos
}

const filterNumber = (key, maxLength) => {
  localData.value[key] = String(localData.value[key] || '').replace(/\D/g, '').slice(0, maxLength)
}
watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>