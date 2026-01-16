// app/components/pendaftaran/StepSekolah.vue
<template>
  <div class="w-full space-y-10 py-4">
    <section>
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          04
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Data Sekolah Asal</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Riwayat pendidikan sebelumnya</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">Nama Sekolah *</label>
          <div class="md:col-span-9">
            <input type="text" v-model="localData.nama_sekolah_asal" 
              @input="handleUpper('nama_sekolah_asal')" 
              placeholder="CONTOH: SDN 1 KEDIRI / SMPN 2 JAKARTA"
              class="form-input uppercase font-semibold"
              :class="{ '!border-red-500/40 bg-red-500/5': !localData.nama_sekolah_asal }">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">NISN & Lulusan *</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative">
              <input type="text" v-model="localData.nisn" @input="filterNumber('nisn', 10)" 
                class="form-input font-mono tracking-wider" placeholder="NISN (10 Digit - Opsional)">
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 font-bold tracking-tighter">ID</span>
            </div>
            <select v-model="localData.tahun_lulus" class="form-input"
                    :class="{ '!border-red-500/40 bg-red-500/5': !localData.tahun_lulus }" >
              <option value="" disabled>Pilih Tahun Lulus</option>
              <option v-for="y in graduateYears" :key="y" :value="y">Tahun Lulus {{ y }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">Dokumen</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" v-model="localData.no_ijazah" class="form-input" placeholder="No. Ijazah (Opsional)">
            <input type="text" v-model="localData.no_skhun" class="form-input" placeholder="No. SKHUN (Opsional)">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
          <label class="md:col-span-3 label-form mt-3">Alamat Sekolah</label>
          <div class="md:col-span-9">
            <textarea v-model="localData.alamat_sekolah_asal" rows="2" 
              class="form-input resize-none" placeholder="Jalan/gang, RT/RW, ...."
              :class="{ '!border-red-500/40 bg-red-500/5': !localData.alamat_sekolah_asal }"></textarea>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Wilayah *</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.kota_sekolah_asal" 
              @input="handleUpper('kota_sekolah_asal')"
              class="form-input text-xs" placeholder="Kota/Kab"
              :class="{ '!border-red-500/40 bg-red-500/5': !localData.kota_sekolah_asal }">
            
            <input type="text" v-model="localData.provinsi_sekolah_asal" 
              @input="handleUpper('provinsi_sekolah_asal')"
              class="form-input text-xs" placeholder="Provinsi"
              :class="{ '!border-red-500/40 bg-red-500/5': !localData.provinsi_sekolah_asal }">
            
            <input type="text" v-model="localData.negara_sekolah_asal" 
              @input="handleUpper('negara_sekolah_asal')"
              class="form-input text-xs" placeholder="Negara">
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

// Generate tahun lulus: Sekarang (2026) sampai 6 tahun ke belakang
const graduateYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 7 }, (_, i) => currentYear - i)
})

const handleUpper = (key) => {
  if (localData.value[key]) {
    localData.value[key] = localData.value[key].toUpperCase()
  }
}

const filterNumber = (k, m) => { 
  localData.value[k] = String(localData.value[k] || '').replace(/\D/g, '').slice(0, m) 
}

// Fungsi Validasi Utama
const validate = () => {
  const currentYear = new Date().getFullYear()
  
  // NISN dihapus dari daftar wajib
  const mandatory = [
    'nama_sekolah_asal', 
    'kota_sekolah_asal', 
    'alamat_sekolah_asal',
    'provinsi_sekolah_asal', 
    'tahun_lulus'
  ]

  const isAnyEmpty = mandatory.some(key => !localData.value[key]?.toString().trim())
  
  // Proteksi: Jika user memilih tahun secara ilegal via inspect/db
  const isYearInvalid = localData.value.tahun_lulus && parseInt(localData.value.tahun_lulus) > currentYear

  if (isYearInvalid) {
    return {
      valid: false,
      errors: [`Tahun lulus tidak masuk akal (Maksimal ${currentYear})`]
    }
  }

  return {
    valid: !isAnyEmpty,
    errors: isAnyEmpty ? ["Mohon lengkapi data"] : []
  }
}

// Ekspos ke Parent
defineExpose({ validate })

// Default Value
onMounted(() => {
  if (!localData.value.negara_sekolah_asal) localData.value.negara_sekolah_asal = 'INDONESIA'
  if (!localData.value.tahun_lulus) localData.value.tahun_lulus = ''
})

watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>

<style scoped>
.form-input {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 
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