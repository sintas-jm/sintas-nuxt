<template>
  <div class="w-full space-y-12 py-4">
    
    <section>
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
          03
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Data Ayah Kandung</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Informasi identitas dan profil ayah</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">No. Kartu Keluarga</label>
          <div class="md:col-span-6">
            <input type="text" v-model="localData.no_kk" @input="filterNumber('no_kk', 16)" 
              class="form-input font-mono tracking-[0.2em]" placeholder="16 DIGIT NOMOR KK">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Identitas Ayah *</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.nama_ayah" @input="localData.nama_ayah = localData.nama_ayah.toUpperCase()" 
              class="form-input md:col-span-2 uppercase" placeholder="NAMA LENGKAP AYAH">
            <input type="text" v-model="localData.nik_ayah" @input="filterNumber('nik_ayah', 16)" 
              class="form-input font-mono" placeholder="NIK AYAH (16 DIGIT)">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Profil Ayah</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.tempat_lahir_ayah" class="form-input" placeholder="Tempat Lahir">
            <input type="date" v-model="localData.tgl_lahir_ayah" :min="minDateOrtua" :max="maxDateOrtua" class="form-input">
            <select v-model="localData.agama_ayah" class="form-input">
              <option value="Islam">Islam</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Pekerjaan & Pend.</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" v-model="localData.pekerjaan_ayah" class="form-input" placeholder="Pekerjaan Ayah">
            <input type="text" v-model="localData.pendidikan_ayah" class="form-input" placeholder="Pendidikan Terakhir">
          </div>
        </div>
      </div>
    </section>

    <section class="pt-10 border-t border-white/5">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
          04
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Data Ibu Kandung</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Informasi identitas dan profil ibu</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Identitas Ibu *</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.nama_ibu" @input="localData.nama_ibu = localData.nama_ibu.toUpperCase()" 
              class="form-input md:col-span-2 uppercase" placeholder="NAMA LENGKAP IBU">
            <input type="text" v-model="localData.nik_ibu" @input="filterNumber('nik_ibu', 16)" 
              class="form-input font-mono" placeholder="NIK IBU (16 DIGIT)">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Profil Ibu</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.tempat_lahir_ibu" class="form-input" placeholder="Tempat Lahir">
            <input type="date" v-model="localData.tgl_lahir_ibu" :min="minDateOrtua" :max="maxDateOrtua" class="form-input">
            <select v-model="localData.agama_ibu" class="form-input">
              <option value="Islam">Islam</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Kondisi & Biaya</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <select v-model="localData.orangtua_hidup" class="form-input bg-orange-500/5 border-orange-500/20 text-orange-200">
              <option value="Keduanya masih hidup">Ayah & Ibu Masih Hidup</option>
              <option value="Ayah Saja">Hanya Ayah</option>
              <option value="Ibu saja">Hanya Ibu</option>
              <option value="Yatim Piatu">Yatim Piatu</option>
            </select>
            <select v-model="localData.penanggung_santri" class="form-input bg-emerald-500/5 border-emerald-500/20 text-emerald-200 font-bold">
              <option value="Orang Tua">Ditanggung Orang Tua</option>
              <option value="Wali">Ditanggung Wali</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-10 border-t border-white/5">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            05
          </div>
          <div>
            <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Domisili & Kontak</h3>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest">Alamat dan nomor WhatsApp aktif</p>
          </div>
        </div>
        <button type="button" @click="copyAlamatSantri" 
          class="text-[9px] bg-white/5 hover:bg-white/10 text-orange-300 border border-white/10 px-4 py-2 rounded-full transition-all uppercase tracking-widest font-black">
          Sama dengan Alamat Santri
        </button>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Alamat Lengkap</label>
          <div class="md:col-span-9">
            <input type="text" v-model="localData.alamat_orangtua" class="form-input" placeholder="Nama Jalan / RT / RW">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <label class="md:col-span-3 label-form tracking-widest mt-3">Wilayah</label>
          <div class="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.desa_ortu" placeholder="Desa" class="form-input">
            <input type="text" v-model="localData.kecamatan_ortu" placeholder="Kecamatan" class="form-input">
            <input type="text" v-model="localData.kabupaten_ortu" placeholder="Kab/Kota" class="form-input">
            <input type="text" v-model="localData.provinsi_ortu" placeholder="Provinsi" class="form-input">
            <input type="text" v-model="localData.kode_pos_ortu" @input="filterNumber('kode_pos_ortu', 5)" placeholder="Kode Pos" class="form-input">
            <input type="text" v-model="localData.telp_rumah" placeholder="Telp Rumah" class="form-input">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-white/5 pt-6 mt-6">
          <label class="md:col-span-3 label-form tracking-widest mt-3">Kontak WA *</label>
          <div class="md:col-span-9 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" v-model="localData.hp_ayah" @input="filterNumber('hp_ayah', 15)" class="form-input" placeholder="HP Ayah (WhatsApp)">
              <input type="text" v-model="localData.hp_ibu" @input="filterNumber('hp_ibu', 15)" class="form-input" placeholder="HP Ibu (WhatsApp)">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative">
                <input type="text" v-model="localData.hp_informasi" @input="filterNumber('hp_informasi', 15)" 
                  class="form-input border-emerald-500/50 bg-emerald-500/5 text-emerald-100 font-bold" placeholder="NOMOR WA UTAMA">
                <span class="absolute -top-2 left-3 bg-[#0f172a] px-2 text-[8px] text-emerald-400 font-black uppercase tracking-widest">Penting</span>
              </div>
              <input type="email" v-model="localData.email_ortu" class="form-input" placeholder="Alamat Email Aktif">
            </div>
            <select v-model="localData.penghasilan_bulanan" class="form-input">
              <option value="">Pilih Penghasilan Bulanan</option>
              <option value="< 1.000.000">Kurang dari 1 Juta</option>
              <option value="1.000.000 - 3.000.000">1 - 3 Juta</option>
              <option value="3.000.000 - 5.000.000">3 - 5 Juta</option>
              <option value="> 5.000.000">Lebih dari 5 Juta</option>
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

<style scoped>
.form-input {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-500 
         outline-none transition-all duration-300 placeholder:text-slate-500
         focus:bg-white/[0.07] focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.5;
}

select option {
  @apply bg-[#0f172a] text-white/80;
}

.label-form {
  @apply text-[12px] font-semibold text-slate-400 uppercase tracking-widest;
}

/* Style tambahan agar label lebih manis jika di-hover */
.label-form:hover {
  @apply text-slate-300 transition-colors duration-300;
}
</style>