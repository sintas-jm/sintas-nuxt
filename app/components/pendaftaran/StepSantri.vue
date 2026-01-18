<template>
  <div class="w-full space-y-10 py-4">
    
    <section>
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 font-bold shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          01
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Identitas Calon Santri</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Informasi dasar sesuai akta kelahiran</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">Nama Lengkap *</label>
          <div class="md:col-span-9">
            <input type="text" 
              v-model="localData.nama_lengkap" @input="handleInput" 
              placeholder="Nama lengkap sesuai ijazah"
              class="form-input uppercase"
              :class="{ '!border-red-500/40 bg-red-500/5': !localData.nama_lengkap }" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">Jenjang Daftar *</label>
          <div class="md:col-span-6">
            <select v-model="localData.jenjang_daftar" class="form-input" 
                    :class="{ '!border-red-500/40 bg-red-500/5': !localData.jenjang_daftar }">
              <option value="" disabled>Pilih Jenjang</option>
              <option value="Reguler">Reguler (Lulusan SD)</option>
              <option value="Akselerasi">Akselerasi (Lulusan SMP)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">Gender & Agama</label>
          <div class="md:col-span-9 grid grid-cols-2 gap-4">
            <select v-model="localData.jenis_kelamin" class="form-input" 
                    :class="{ '!border-red-500/40 bg-red-500/5': !localData.jenis_kelamin }">
              <option value="" disabled>Pilih Gender</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <select v-model="localData.agama" class="form-input" 
                    :class="{ '!border-red-500/40 bg-red-500/5': !localData.agama }">
              <option value="Islam">Islam</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">Kelahiran *</label>
          <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" v-model="localData.tempat_lahir" placeholder="Tempat Lahir" class="form-input" :class="{ '!border-red-500/40 bg-red-500/5': !localData.tempat_lahir }"/>
            <input type="date" v-model="localData.tanggal_lahir" :max="maxDateSantri" class="form-input appearance-none" :class="{ '!border-red-500/40 bg-red-500/5': !localData.tanggal_lahir }"/>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
          <label class="md:col-span-3 label-form">Status Anak *</label>
          <div class="md:col-span-9 flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <span class="text-[10px] text-slate-400 uppercase">Anak Ke-</span>
              <input type="text" v-model="localData.anak_ke" @input="filterNumber('anak_ke', 2)" class="w-14 bg-transparent text-center text-orange-300 font-bold outline-none" :class="{'text-red-500/40': !localData.anak_ke }" />
              <span class="text-[10px] text-slate-400 uppercase">dari</span>
              <input type="text" v-model="localData.jumlah_saudara" @input="filterNumber('jumlah_saudara', 2)" class="w-14 bg-transparent text-center text-orange-300 font-bold outline-none" :class="{ 'text-red-500/40': !localData.jumlah_saudara }" />
              <span class="text-[10px] text-slate-400 uppercase">bersaudara</span>
            </div>
            <select v-model="localData.status_keluarga" class="form-input flex-1 min-w-[150px]">
              <option value="Anak Kandung">Anak Kandung</option>
              <option value="Anak Angkat">Anak Angkat</option>
              <option value="Anak Asuh">Anak Asuh</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-6 border-t border-white/5">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          02
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Wilayah Domisili</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Alamat tempat tinggal saat ini</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        <div v-for="item in [
          ['Alamat', 'alamat', 'col-span-2'], 
          ['Desa/Kelurahan', 'desa'], 
          ['Kecamatan', 'kecamatan'], 
          ['Kabupaten', 'kabupaten'], 
          ['Provinsi', 'provinsi'], 
          ['Kode Pos', 'kode_pos'], 
          ['Negara', 'negara']
        ]" 
          :key="item[1]" 
          :class="item[2] === 'col-span-2' ? 'md:col-span-2' : ''"
          class="space-y-2">
          
          <label class="label-form">{{ item[0] }}</label>
          <input 
            type="text" 
            v-model="localData[item[1]]" 
            @input="item[1] === 'kode_pos' ? filterNumber('kode_pos', 5) : null" 
            class="form-input"
            :class="{'!border-red-500/40 bg-red-500/5': isFieldEmpty(item[1])}"
          />
        </div>
      </div>
    </section>

    <section class="pt-6 border-t border-white/5">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          03
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Jasmani & Hobi</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Kondisi fisik dan minat santri</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="space-y-2">
          <label class="label-form">Gol. Darah</label>
          <select v-model="localData.golongan_darah" class="form-input">
            <option value="-">--</option>
            <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="label-form">Tinggi (cm)</label>
          <input type="text" v-model="localData.tinggi_badan" @input="filterNumber('tinggi_badan', 3)" class="form-input" placeholder="000">
        </div>
        <div class="space-y-2">
          <label class="label-form">Berat (kg)</label>
          <input type="text" v-model="localData.berat_badan" @input="filterNumber('berat_badan', 3)" class="form-input" placeholder="00">
        </div>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="label-form">Riwayat Sakit</label>
            <input type="text" v-model="localData.riwayat_penyakit" class="form-input" placeholder="Misal: Asma, dll">
          </div>
          <div class="space-y-2">
            <label class="label-form">Kelainan Jasmani</label>
            <input type="text" v-model="localData.kelainan_jasmani" class="form-input" placeholder="Isi jika ada">
          </div>
        </div>
        <div class="space-y-2">
          <label class="label-form">Minat & Hobi</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" v-model="localData.hobi_seni_budaya" placeholder="Seni / Budaya" class="form-input">
            <input type="text" v-model="localData.hobi_olahraga" placeholder="Olahraga" class="form-input">
            <input type="text" v-model="localData.hobi_lainnya" placeholder="Lainnya" class="form-input">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { z } from 'zod'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const localData = ref({ ...props.modelValue })

const maxDateSantri = computed(() => `${new Date().getFullYear() - 11}-12-31`)

// --- VALIDATION SCHEMA (ZOD) ---
const santriSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  jenjang_daftar: z.string().min(1, "Pilih jenjang pendaftaran"),
  jenis_kelamin: z.string().min(1, "Pilih jenis kelamin"),
  agama: z.string().min(1, "Agama wajib diisi"),
  tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi").refine((val) => {
    return new Date(val) <= new Date(maxDateSantri.value);
  }, "Usia minimal santri adalah 11 tahun"),
  
  // Gunakan coerce agar Zod otomatis mengubah string/number jadi string sebelum dicheck
  anak_ke: z.coerce.string().min(1, "Input jumlah anak"),
  jumlah_saudara: z.coerce.string().min(1, "Input jumlah saudara"),
  
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  desa: z.string().min(1, "Desa wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  kode_pos: z.string().length(5, "Kode pos harus 5 digit"),
}).refine((data) => {
  // Logika tambahan: Anak ke tidak boleh lebih besar dari saudara
  return parseInt(data.anak_ke) <= parseInt(data.jumlah_saudara)
}, {
  message: "Input 'Anak Ke' tidak boleh melebihi jumlah saudara",
  path: ["anak_ke"]
})

const validate = () => {
  const result = santriSchema.safeParse(localData.value)

  if (!result.success) {
    // Menggunakan issues[0] agar aman dari deprecated warning
    const firstMessage = result.error.issues[0]?.message || "Data santri belum lengkap"
    return {
      valid: false,
      errors: [firstMessage]
    }
  }

  return { valid: true, errors: [] }
}

defineExpose({ validate })

// --- LOGIC LAINNYA ---
const filterNumber = (key, maxLength) => {
  localData.value[key] = String(localData.value[key] || '').replace(/\D/g, '').slice(0, maxLength)
}

const handleInput = () => { 
  localData.value.nama_lengkap = localData.value.nama_lengkap?.toUpperCase() 
}

// Untuk Highlight Merah di UI
const mandatoryAlamat = ['alamat', 'desa', 'kecamatan', 'kabupaten', 'provinsi', 'kode_pos']
const isFieldEmpty = (key) => {
  const value = localData.value[key]
  if (!mandatoryAlamat.includes(key)) return false
  return !value || value.toString().trim() === '' || (key === 'kode_pos' && value.length < 5)
}

onMounted(() => {
  if (!localData.value.agama) localData.value.agama = 'Islam'
  if (!localData.value.negara) localData.value.negara = 'Indonesia'
  // Pastikan field angka tidak undefined agar tidak crash di Zod
  if (!localData.value.anak_ke) localData.value.anak_ke = ''
  if (!localData.value.jumlah_saudara) localData.value.jumlah_saudara = ''
})

watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>

<style scoped>
.form-input {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 
         outline-none transition-all duration-300 placeholder:text-slate-400
         focus:bg-white/[0.07] focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10;
}

/* Style khusus untuk input date agar icon calendar tidak aneh di dark mode */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.5;
  cursor: pointer;
}

.label-form {
  @apply text-[12px] font-semibold text-slate-300 uppercase tracking-widest;
}

/* Style tambahan agar label lebih manis jika di-hover */
.label-form:hover {
  @apply text-slate-300 transition-colors duration-300;
}

select option {
  @apply bg-[#0f172a] text-white/80;
}
</style>