<template>
  <div class="w-full space-y-12 py-4">
    
    <section>
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold shadow-[0_0_15px_rgba(20,184,166,0.1)]">
          06
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Data Wali Santri</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Diisi jika santri tidak tinggal bersama orang tua</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Identitas Wali *</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.nama_wali" @input="localData.nama_wali = localData.nama_wali.toUpperCase()" 
              class="form-input md:col-span-2 uppercase font-semibold" placeholder="NAMA LENGKAP WALI">
            <input type="text" v-model="localData.hubungan_dengan_santri" class="form-input" placeholder="Hubungan (Paman/Kakak)">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Kelahiran</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" v-model="localData.tempat_lahir_wali" class="form-input" placeholder="Tempat Lahir">
            <input type="date" v-model="localData.tgl_lahir_wali" :min="minDateWali" :max="maxDateWali" class="form-input">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Pekerjaan & Kontak</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" v-model="localData.pekerjaan_wali" class="form-input" placeholder="Pekerjaan Wali">
            <input type="text" v-model="localData.hp_wali" @input="filterNumber('hp_wali', 15)" 
              class="form-input border-teal-500/30 bg-teal-500/5 text-teal-100 font-bold" placeholder="NO. WHATSAPP WALI">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <label class="md:col-span-3 label-form tracking-widest mt-3">Alamat Lengkap</label>
          <div class="md:col-span-9 space-y-4">
            <textarea v-model="localData.alamat_wali" rows="2" class="form-input resize-none" placeholder="Alamat Lengkap Wali"></textarea>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input type="text" v-model="localData.desa_wali" placeholder="Desa" class="form-input">
              <input type="text" v-model="localData.kecamatan_wali" placeholder="Kecamatan" class="form-input">
              <input type="text" v-model="localData.kabupaten_wali" placeholder="Kab/Kota" class="form-input">
              <input type="text" v-model="localData.provinsi_wali" placeholder="Provinsi" class="form-input">
              <input type="text" v-model="localData.kode_pos_wali" @input="filterNumber('kode_pos_wali', 5)" placeholder="Kode Pos" class="form-input">
              <input type="text" v-model="localData.telp_rumah_wali" placeholder="Telp Rumah" class="form-input">
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="relative overflow-hidden bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl group">
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <div class="flex gap-4 items-start relative z-10">
        <div class="p-2 bg-amber-500/20 rounded-lg text-amber-400">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="space-y-1">
          <h4 class="text-[11px] font-black text-amber-500 uppercase tracking-widest">Informasi Penting</h4>
          <p class="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Data Wali hanya wajib diisi jika calon santri tidak tinggal bersama orang tua kandung atau biaya pendidikan ditanggung oleh pihak wali. Jika data sudah sesuai, silakan lanjutkan ke tahap konfirmasi.
          </p>
        </div>
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

<style scoped>
.form-input {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-500 
         outline-none transition-all duration-300 placeholder:text-slate-500
         focus:bg-white/[0.07] focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.5;
}

.label-form {
  @apply text-[12px] font-semibold text-slate-400 uppercase tracking-widest;
}

/* Style tambahan agar label lebih manis jika di-hover */
.label-form:hover {
  @apply text-slate-300 transition-colors duration-300;
}
</style>