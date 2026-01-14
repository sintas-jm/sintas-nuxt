<script setup>
  import { usePendaftaran } from '~/composables/usePendaftaran'

  const { periodeInfo, loading, kirimPendaftaran, fetchPeriode } = usePendaftaran()

  onMounted(() => {
    fetchPeriode()
  })

  const currentStep = ref(1)
  const totalSteps = 5 // Tambah jadi 5
  const stepTitles = [
    'Biodata Santri', 
    'Sekolah Asal', 
    'Data Orang Tua', 
    'Data Wali', 
    'Konfirmasi Akhir' // Judul baru
  ]

  const steps = [
    resolveComponent('PendaftaranStepSantri'),
    resolveComponent('PendaftaranStepSekolah'),
    resolveComponent('PendaftaranStepOrangTua'),
    resolveComponent('PendaftaranStepWali'),
    resolveComponent('PendaftaranStepKonfirmasi') // Tambahkan ini
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
    jenis_kelamin: 'L',
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
    // 1. Logika Loncat (Skip Wali)
    if (currentStep.value === 3 && masterForm.value.penanggung_santri === 'Orang Tua') {
      currentStep.value = 5 // Langsung ke Konfirmasi
      if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // 2. Logika Submit di Step Terakhir
    if (currentStep.value === 5) {
      if (!masterForm.value.is_setuju) {
        alert("Centang persetujuan dulu bos!");
        return
      }
      submitFinal()
    } else {
      // 3. Jalan Normal
      currentStep.value++
      if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
      if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const generateID = () => {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
    const random = Math.floor(1000 + Math.random() * 9000)
    return `PSB-REG-${dateStr}-${random}`
  }

  const submitFinal = async () => {
    masterForm.value.id_pendaftar = generateID()
    masterForm.value.id_psb = periodeInfo.value.id_psb
    masterForm.value.timestamp_submit = new Date().toISOString()
    
    const hasil = await kirimPendaftaran(masterForm.value)
    
    if (hasil.success) {
      alert("Alhamdulillah, data berhasil disimpan!")
      navigateTo('/pendaftaran/rekap')
    } else {
      alert("Maaf, terjadi kendala: " + hasil.message)
    }
  }
</script>

<template>
  <div class="sm:py-2">
    <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
      
      <div class="bg-gray-700 p-5 sm:p-6 text-white">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h5 class="text-lg font-semibold flex items-center gap-2">
              <span class="bg-white/10 p-1.5 rounded-md text-base">📝</span> 
              Form Pendaftaran Santri Baru
            </h5>
            <p class="text-xs text-gray-400 mt-1 opacity-80 italic">
              {{ periodeInfo?.nama_psb || 'Memuat informasi...' }}
            </p>
          </div>
        </div>
      </div>

      <div class="p-5 md:p-8">
        <div class="mb-8">
          <div class="flex justify-between mb-2 items-end">
            <div class="text-[12px]">
              <span class="text-primary font-bold">Progress: </span>
              <span class="text-gray-500 uppercase tracking-wider">Langkah {{ currentStep }} - {{ stepTitles[currentStep-1] }}</span>
            </div>
            <span class="text-primary font-bold text-sm">
              {{ Math.round((currentStep / totalSteps) * 100) }}%
            </span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              class="bg-primary h-full transition-all duration-700 ease-in-out rounded-full"
              :style="{ width: (currentStep / totalSteps * 100) + '%' }"
            ></div>
          </div>
        </div>

        <form @submit.prevent="handleNavigation" class="min-h-[300px]">
          <KeepAlive>
            <component 
              :is="steps[currentStep - 1]" 
              v-model="masterForm" 
            />
          </KeepAlive>

          <div class="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
            <button 
              v-if="currentStep > 1" 
              type="button" 
              @click="prevStep"
              class="px-5 py-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
            >
              ← Sebelumnya
            </button>
            <div v-else></div>

            <button 
              type="submit"
              :disabled="loading"
              class="bg-green-600 hover:bg-black text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all disabled:bg-gray-300 uppercase tracking-widest"
            >
              <template v-if="loading">Mengirim...</template>
              <template v-else-if="currentStep === totalSteps || (currentStep === 3 && masterForm.penanggung_santri === 'Orang Tua')">
                Selesaikan Pendaftaran ✅
              </template>
              <template v-else>
                Lanjut →
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>