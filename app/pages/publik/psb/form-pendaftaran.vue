<script setup lang="ts">
import { usePendaftaran } from '~/composables/usePendaftaran'

const { showToast } = useToast()
const { periodeInfo, loading, kirimPendaftaran, fetchPeriode } = usePendaftaran()

onMounted(() => {
  fetchPeriode()
})

const currentStep = ref(1)
const totalSteps = 5
const stepComponentRef = ref<{ validate: () => { valid: boolean, errors: string[] } } | null>(null)

const stepTitles = [
  'Biodata Santri', 
  'Sekolah Asal', 
  'Data Orang Tua', 
  'Data Wali', 
  'Konfirmasi Akhir'
]

const steps = [
  resolveComponent('PendaftaranStepSantri'),
  resolveComponent('PendaftaranStepSekolah'),
  resolveComponent('PendaftaranStepOrangTua'),
  resolveComponent('PendaftaranStepWali'),
  resolveComponent('PendaftaranStepKonfirmasi')
]

  const masterForm = ref({
    // IDENTITAS PENDAFTARAN (Auto/System)
    id_pendaftar: '', 
    id_psb: '',
    status_pendaftaran: 'menunggu konfirmasi',
    
    // DATA CALON SANTRI
    jenjang_daftar: '',
    nama_lengkap: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: 'Islam',
    anak_ke: 1,
    jumlah_saudara: 0,
    status_keluarga: '',
    alamat: '',
    desa: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kode_pos: '',
    negara: 'Indonesia',

    // KESEHATAN & HOBI
    golongan_darah: '',
    tinggi_badan: null,
    berat_badan: null,
    riwayat_penyakit: '',
    kelainan_jasmani: '',
    hobi_seni_budaya: '',
    hobi_olahraga: '',
    hobi_lainnya: '',

    // SEKOLAH ASAL
    nisn: '',
    tahun_lulus: new Date().getFullYear(),
    no_ijazah: '',
    no_skhun: '',
    nama_sekolah_asal: '',
    alamat_sekolah_asal: '',
    kota_sekolah_asal: '',
    provinsi_sekolah_asal: '',
    negara_sekolah_asal: 'Indonesia',

    // DATA KELUARGA (KK & AYAH)
    no_kk: '',
    nama_ayah: '',
    nik_ayah: '',
    tempat_lahir_ayah: '',
    tgl_lahir_ayah: '',
    agama_ayah: 'Islam',
    pekerjaan_ayah: '',
    pendidikan_ayah: '',

    // DATA IBU
    nama_ibu: '',
    nik_ibu: '',
    tempat_lahir_ibu: '',
    tgl_lahir_ibu: '',
    agama_ibu: 'Islam',
    pekerjaan_ibu: '',
    pendidikan_ibu: '',

    // ALAMAT & KONTAK ORTU
    alamat_orangtua: '',
    desa_ortu: '',
    kecamatan_ortu: '',
    kabupaten_ortu: '',
    provinsi_ortu: '',
    kode_pos_ortu: '',
    hp_ayah: '',
    hp_ibu: '',
    telp_rumah: '',
    hp_informasi: '',
    email_ortu: '',
    penghasilan_bulanan: '',
    orangtua_hidup: 'Keduanya masih hidup',
    penanggung_santri: 'Orang Tua',

    // DATA WALI
    nama_wali: '',
    tempat_lahir_wali: '',
    tgl_lahir_wali: '',
    pekerjaan_wali: '',
    pendidikan_wali: '',
    alamat_wali: '',
    desa_wali: '',
    kecamatan_wali: '',
    kabupaten_wali: '',
    provinsi_wali: '',
    negara_wali: 'Indonesia',
    kode_pos_wali: '',
    email_wali: '',
    telp_rumah_wali: '',
    hp_wali: '',
    hubungan_dengan_santri: '',

    // METADATA (Diisi saat submit)
    timestamp_submit: '',
    updated_at: '',
    updated_by: 'System/Guest',

    // KONFIRMASI
    is_setuju: false
  })

// FUNGSI NAVIGASI UTAMA
const handleNavigation = () => {
  // 1. Validasi Anak (Setiap Step)
  if (stepComponentRef.value?.validate) {
    const { valid, errors } = stepComponentRef.value.validate()
    if (!valid) {
      showToast(errors[0] || "Mohon lengkapi data", "error")
      return 
    }
  }

  // 2. Cek Kondisi Khusus (Skip Wali)
  const isSkipWali = currentStep.value === 3 && masterForm.value.penanggung_santri === 'Orang Tua'

  // 3. Logika Alur Navigasi
  if (currentStep.value === totalSteps) {
    // Jika sudah di step 5 (Final)
    if (!masterForm.value.is_setuju) {
      showToast("Mohon centang persetujuan sebelum mengirim", "info")
      return
    }
    submitFinal()
  } else if (isSkipWali) {
    // Jika dari Step 3 dan pilih Ortu -> Langsung ke Konfirmasi (Step 5)
    currentStep.value = 5
    scrollToTop()
  } else {
    // Lanjut ke step berikutnya secara normal
    currentStep.value++
    scrollToTop()
  }
}

const prevStep = () => {
  if (currentStep.value === 5 && masterForm.value.penanggung_santri === 'Orang Tua') {
    currentStep.value = 3 // Lompat balik melewati wali
  } else if (currentStep.value > 1) {
    currentStep.value--
  }
  scrollToTop()
}

// Helper scroll agar lebih bersih
const scrollToTop = () => {
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

const generateID = () => {
  const fullIsoString = new Date().toISOString()
  // Tambahkan pengaman atau pastikan index 0 ada
  const datePart = fullIsoString.split('T')[0] || '' 
  const dateStr = datePart.replace(/-/g, '')
  
  const random = Math.floor(1000 + Math.random() * 9000)
  return `PSB-REG-${dateStr}-${random}`
}

const submitFinal = async () => {
  masterForm.value.id_pendaftar = generateID()
  masterForm.value.id_psb = periodeInfo.value?.id_psb || ''
  masterForm.value.timestamp_submit = new Date().toISOString()
  
  const hasil = await kirimPendaftaran(masterForm.value)
  
  if (hasil.success) {
    showToast("Data pendaftaran berhasil disimpan!", "success")
    setTimeout(() => {
      navigateTo('/publik/psb/rekap-pendaftar')
    }, 1500)
  } else {
    showToast(hasil.message || "Maaf, terjadi kendala teknis", "error")
  }
}
</script>

<template>
  <div class="max-w-[1440] mx-auto pb-20">
    <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 class="text-orange-400/80 text-[11px] font-bold tracking-[0.4em] uppercase mb-2">Pendaftaran Santri</h2>
        <h1 class="text-xl font-light tracking-tight text-white uppercase">
          Langkah <span class="font-bold text-orange-200">{{ currentStep }}</span> <span class="text-slate-500">/ {{ totalSteps }}</span>
        </h1>
        <p class="text-sm text-slate-400 mt-1 italic">{{ stepTitles[currentStep-1] }}</p>
      </div>
      
      <div class="w-full md:w-48">
        <div class="flex justify-between text-[10px] mb-1 uppercase tracking-tighter text-slate-500">
          <span>Progress</span>
          <span>{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
        </div>
        <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            class="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-700 ease-out"
            :style="{ width: (currentStep / totalSteps * 100) + '%' }"
          ></div>
        </div>
      </div>
    </header>

    <div class="glass-card rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      <div class="px-3 md:px-8 py-4 bg-orange-500/5 border-b border-white/5 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl">📝</div>
        <div class="space-y-1">
          <h4 class="text-xs font-bold text-orange-200 uppercase tracking-widest">Periode Aktif</h4>
          <p class="text-[12px] font-semibold text-slate-400">{{ periodeInfo?.nama_psb || 'Memuat sistem pendaftaran...' }}</p>
        </div>
      </div>

      <div class="p-3 md:px-8 md:py-4 min-h-[400px]">
        <form @submit.prevent="handleNavigation">
          <KeepAlive>
            <component 
              :is="steps[currentStep - 1]" 
              v-model="masterForm" 
              ref="stepComponentRef"
            />
          </KeepAlive>

          <div class="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
            <button 
              v-if="currentStep > 1" 
              type="button" 
              @click="prevStep"
              class="group flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em]"
            >
              <span class="group-hover:-translate-x-1 transition-transform">←</span> Kembali
            </button>
            <div v-else></div>

            <button 
              type="submit"
              :disabled="loading"
              :class="[
                loading ? 'bg-slate-800 text-slate-500' : 'bg-orange-600/80 hover:bg-orange-500/80 hover:scale-95 text-white shadow-[0_0_20px_rgba(234,88,12,0.2)]',
                'px-6 py-3 rounded-xl text-[12px] font-semibold uppercase tracking-[0.2em] transition-all flex items-center gap-3'
              ]"
            >
              <span v-if="loading" class="animate-spin text-lg">⏳</span>
              <template v-if="loading">Memproses...</template>
              <!--
              <template v-else-if="currentStep === totalSteps || (currentStep === 3 && masterForm.penanggung_santri === 'Orang Tua')">
                Kirim Pendaftaran <span class="text-lg">✅</span>
              </template>
              -->
              <template v-else-if="currentStep === totalSteps">
                Kirim Berkas <span class="text-lg">✅</span>
              </template>
              <template v-else>
                Lanjut <span class="text-lg">→</span>
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>