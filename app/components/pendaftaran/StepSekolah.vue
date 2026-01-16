<template>
  <div class="w-full space-y-12 py-4">
    <section>
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          02
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Data Sekolah Asal</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Riwayat pendidikan sebelumnya</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Nama Sekolah *</label>
          <div class="md:col-span-9">
            <input type="text" v-model="localData.nama_sekolah_asal" 
              @input="localData.nama_sekolah_asal = localData.nama_sekolah_asal.toUpperCase()" 
              placeholder="CONTOH: SDN 1 KEDIRI / SMPN 2 JAKARTA"
              class="form-input uppercase font-semibold">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">NISN & Lulusan</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative">
              <input type="text" v-model="localData.nisn" @input="filterNumber('nisn', 10)" 
                class="form-input font-mono tracking-wider" placeholder="NISN (10 Digit)">
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 font-bold tracking-tighter">ID</span>
            </div>
            <select v-model="localData.tahun_lulus" class="form-input">
              <option v-for="y in graduateYears" :key="y" :value="y">Tahun Lulus {{ y }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Dokumen</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" v-model="localData.no_ijazah" class="form-input" placeholder="No. Ijazah (Opsional)">
            <input type="text" v-model="localData.no_skhun" class="form-input" placeholder="No. SKHUN (Opsional)">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
          <label class="md:col-span-3 label-form tracking-widest mt-3">Alamat Sekolah</label>
          <div class="md:col-span-9">
            <textarea v-model="localData.alamat_sekolah_asal" rows="2" 
              class="form-input resize-none" placeholder="Alamat lengkap lokasi sekolah asal"></textarea>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form tracking-widest">Wilayah</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-1">
              <input type="text" v-model="localData.kota_sekolah_asal" class="form-input text-xs" placeholder="Kota/Kab">
            </div>
            <div class="space-y-1">
              <input type="text" v-model="localData.provinsi_sekolah_asal" class="form-input text-xs" placeholder="Provinsi">
            </div>
            <div class="space-y-1">
              <input type="text" v-model="localData.negara_sekolah_asal" class="form-input text-xs" placeholder="Negara">
            </div>
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

const graduateYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => currentYear - i)
})

const filterNumber = (k, m) => { 
  localData.value[k] = String(localData.value[k] || '').replace(/\D/g, '').slice(0, m) 
}

watch(localData, (v) => emit('update:modelValue', v), { deep: true })
</script>

<style scoped>
/* Gunakan utility class yang sama dengan StepSantri */
.form-input {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-500 
         outline-none transition-all duration-300 placeholder:text-slate-500
         focus:bg-white/[0.07] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10;
}

.label-form {
  @apply text-[12px] font-semibold text-slate-400 uppercase tracking-widest;
}

/* Style tambahan agar label lebih manis jika di-hover */
.label-form:hover {
  @apply text-slate-300 transition-colors duration-300;
}

textarea.form-input {
  @apply py-4;
}

select option {
  @apply bg-[#0f172a] text-white/80;
}
</style>