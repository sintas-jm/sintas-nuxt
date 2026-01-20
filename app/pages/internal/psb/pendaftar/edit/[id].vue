<script setup lang="ts">
// Import komponen asli yang digunakan di pendaftaran publik
import StepSantri from '~/components/pendaftaran/StepSantri.vue'
import StepOrangTua from '~/components/pendaftaran/StepOrangTua.vue'
import StepSekolah from '~/components/pendaftaran/StepSekolah.vue'
import StepWali from '~/components/pendaftaran/StepWali.vue'
import { useActionLoading } from '~/composables/useActionLoading'

definePageMeta({ layout: 'internal' })

const route = useRoute()
const router = useRouter()
const { pendaftarList, fetchRekap } = useRekap()
const { periodeInfo, updatePendaftar } = usePendaftaran()
const { showToast } = useToast() 
const { startAction, stopAction } = useActionLoading()

const formData = ref<any>(null)
const isSaving = ref(false)

// Ref untuk memanggil fungsi validate() di dalam komponen
const stepSantriRef = ref<any>(null)
const stepOrangTuaRef = ref<any>(null)
const stepSekolahRef = ref<any>(null)
const stepWaliRef = ref<any>(null)

// Fungsi untuk mengubah format tanggal apa pun menjadi YYYY-MM-DD
const formatDateForInput = (dateVal: any) => {
  if (!dateVal) return ''
  try {
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return ''
    
    // Menggunakan getFullYear, getMonth, dan getDate agar tidak terkena pergeseran UTC
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (e) {
    return ''
  }
}

onMounted(async () => {
  const id = route.params.id
  
  // Ambil data jika pendaftarList kosong (misal saat refresh page)
  if (pendaftarList.value.length === 0) {
    await fetchRekap()
  }
  
  const data = pendaftarList.value.find(p => p.id_pendaftar === id)
  if (data) {
    // Clone data agar perubahan di form tidak merusak state rekap sebelum di-save
    const cleanedData = JSON.parse(JSON.stringify(data))

    // FORMAT ULANG SEMUA FIELD TANGGAL DI SINI. Sesuaikan dengan nama field di Spreadsheet Anda
    cleanedData.tanggal_lahir = formatDateForInput(cleanedData.tanggal_lahir)
    cleanedData.tgl_lahir_ayah = formatDateForInput(cleanedData.tgl_lahir_ayah)
    cleanedData.tgl_lahir_ibu = formatDateForInput(cleanedData.tgl_lahir_ibu)
    cleanedData.tgl_lahir_wali = formatDateForInput(cleanedData.tgl_lahir_wali)

    // membersihkan nama petugas ketika edit/[id]
    if (cleanedData.updated_by === 'System/Guest') {
      cleanedData.updated_by = ''
    }

    const fieldsToString = [
      'no_kk', 'nisn', 'anak_ke', 'jumlah_saudara', 'tinggi_badan', 'berat_badan', 'kode_pos', 
      'nik_ayah', 'nik_ibu', 'kode_pos_ortu', 'penghasilan_bulanan', 'hp_ayah', 'hp_ibu', 'hp_informasi', 'tahun_lulus', 'telp_rumah',
      'kode_pos_wali', 'hp_wali', 'telp_rumah_wali'
    ]

    fieldsToString.forEach(field => {
      if (cleanedData[field] !== undefined && cleanedData[field] !== null) {
        cleanedData[field] = String(cleanedData[field])
      }
    })

    formData.value = cleanedData
  } else {
    router.push('/internal/psb/pendaftar')
  }
})

const handleUpdate = async () => {
  // 1. Validasi tiap komponen secara berurutan
  // Kita jalankan satu per satu agar bisa memberikan pesan error yang spesifik
  
  const vSantri = stepSantriRef.value?.validate()
  if (vSantri && !vSantri.valid) {
    showToast(`Data Santri: ${vSantri.errors[0]}`, 'error')
    return
  }

  const vSekolah = stepSekolahRef.value?.validate()
  if (vSekolah && !vSekolah.valid) {
    showToast(`Data Sekolah: ${vSekolah.errors[0]}`, 'error')
    return
  }

  const vOrtu = stepOrangTuaRef.value?.validate()
  if (vOrtu && !vOrtu.valid) {
    showToast(`Data Orang Tua: ${vOrtu.errors[0]}`, 'error')
    return
  }

  // Khusus StepWali biasanya opsional di beberapa form, 
  // tapi jika komponennya mengekspos validasi, tetap kita cek
  const vWali = stepWaliRef.value?.validate()
  if (vWali && !vWali.valid) {
    showToast(`Data Wali: ${vWali.errors[0]}`, 'error')
    return
  }

  // 2. Validasi Audit Petugas (updated_by)
  if (!formData.value.updated_by || formData.value.updated_by.trim().length < 3) {
    showToast("Nama petugas wajib diisi (min. 3 karakter)", "error")
    return
  }

  // 3. Proses Pengiriman
  isSaving.value = true
  startAction('Sedang Memperbarui Data...')
  formData.value.updated_at = new Date().toISOString()

  try {
    const result = await updatePendaftar(formData.value)

    if (result.success) {
      showToast(`Data ${formData.value.nama_lengkap} berhasil diperbarui!`, 'success')
      
      // Refresh data rekap agar saat pindah halaman data sudah baru
      await fetchRekap() 
      
      // Pindah halaman
      // Saat router.push jalan, Nuxt memicu 'page:start' (GlobalLoading tetap aktif)
      router.push('/internal/psb/pendaftar')
      
      // Kita tidak perlu memanggil stopAction() di sini jika navigasi berhasil,
      // karena 'page:finish' akan otomatis menutup overlay saat halaman tujuan siap.
    } else {
      stopAction() // Matikan overlay jika gagal agar user bisa perbaiki input
      showToast(result.message || "Gagal memperbarui data", "error")
    }
  } catch (err) {
    stopAction()
    showToast("Terjadi kesalahan sistem", "error")

  } finally {
    isSaving.value = false
  }
}

// Pastikan loading benar-benar berhenti saat komponen dihancurkan (pindah halaman)
/* onUnmounted(() => {stopAction()}) */
</script>

<template>
  <div v-if="formData" class="pb-20">
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white tracking-tighter">
      <div>
        <h2 class="page-heading-1 mb-2">{{ periodeInfo.nama_psb }}</h2>
        <h1 class="text-lg font-light">Mode Edit: <span class="font-semibold text-orange-200 tracking-normal">Data Pendaftar</span></h1>
        <p class="text-slate-400 font-mono text-sm">
          {{ formData.id_pendaftar }} | 
          <span class="font-semibold text-orange-400 tracking-normal uppercase">{{ formData.nama_lengkap }}</span>
        </p>
      </div>
      <NuxtLink to="/internal/psb/pendaftar" class="text-[10px] px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all uppercase tracking-widest font-bold">
        ← Batal & Kembali
      </NuxtLink>
    </header>

    <div class="space-y-10">
      
      <div class="glass-card p-2 md:p-8 rounded-2xl border border-white/10 shadow-xl">
        <StepSantri v-model="formData" ref="stepSantriRef" />
      </div>

      <div class="glass-card p-2 md:p-8 rounded-2xl border border-white/10 shadow-xl">
        <StepSekolah v-model="formData" ref="stepSekolahRef" />
      </div>
      
      <div class="glass-card p-2 md:p-8 rounded-2xl border border-white/10 shadow-xl">
        <StepOrangTua v-model="formData" ref="stepOrangTuaRef" />
      </div>

      <div class="glass-card p-2 md:p-8 rounded-2xl border border-white/10 shadow-xl">
        <StepWali v-model="formData" ref="stepWaliRef" />
      </div>

      <div class="glass-card p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 shadow-xl">
        <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
          <div class="w-2 h-6 bg-orange-500 rounded-full text-xs"></div>
          <h3 class="text-sm font-bold text-orange-200 uppercase tracking-widest">Kontrol & Audit Petugas</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="label-form">Status Pendaftaran</label>
            <select v-model="formData.status_pendaftaran" class="input-style !border-orange-500/30">
              <option value="PROSES VERIFIKASI">PROSES VERIFIKASI</option>
              <option value="DITERIMA">DITERIMA</option>
              <option value="DAFTAR ULANG">DAFTAR ULANG</option>
              <option value="CADANGAN">CADANGAN</option>
              <option value="TIDAK DITERIMA">TIDAK DITERIMA</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="label-form">Nama Petugas *</label>
            <input 
              v-model="formData.updated_by" 
              type="text" 
              placeholder="Nama Petugas Audit" 
              class="input-style !border-orange-500/30"
              :class="{ '!border-red-500/50 bg-red-500/5': !formData.updated_by }"
            >
          </div>

          <div class="space-y-2">
            <label class="label-form">Catatan Petugas</label>
            <input 
              v-model="formData.catatan_petugas" 
              type="text" 
              placeholder="Tambahkan catatan jika ada" 
              class="input-style"
            >
          </div>
        </div>
        
        <div v-if="formData.updated_at" class="mt-4 text-[10px] text-slate-500 italic">
          Last Edit: {{ formData.updated_at }}
        </div>
      </div>

      <div class="flex items-center gap-4 pt-6">
        <button 
          @click="handleUpdate" 
          :disabled="isSaving"
          class="flex-1 md:flex-none px-12 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
        >
          <span v-if="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isSaving ? 'Sedang Menyimpan...' : 'Simpan Seluruh Perubahan' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Gunakan style yang sama agar konsisten dengan input di komponen */
.input-style {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 
         outline-none transition-all duration-300 placeholder:text-slate-400
         focus:bg-white/[0.07] focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10;
}

.label-form {
  @apply text-[12px] font-semibold text-slate-200 uppercase tracking-widest;
}

/* Style tambahan agar label lebih manis jika di-hover */
.label-form:hover {
  @apply text-orange-200 transition-colors duration-300;
}

select option {
  @apply bg-[#0f172a] text-white/80;
}
</style>