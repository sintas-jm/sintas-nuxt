<script setup lang="ts">
import { useActionLoading } from '~/composables/useActionLoading' 
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

definePageMeta({ layout: 'internal' })

const route = useRoute()
const router = useRouter()
const { santriList, uploadFoto, getFotoUrl, fetchSantri } = useSantri()
const { startAction, stopAction } = useActionLoading()
const { showToast } = useToast()

const isGlobalLoading = useState<boolean>('global_data_loading')

const santri = ref<any>(null)
const activeTab = ref('pribadi')
const fileInput = ref<HTMLInputElement | null>(null)

// State untuk Modal Crop
const showCropModal = ref(false)
const rawImage = ref<string | null>(null)
const cropperRef = ref<any>(null)

const tabs = [
  { id: 'pribadi', label: 'Biodata' },
  { id: 'keluarga', label: 'Keluarga' },
  { id: 'sekolah', label: 'Pendidikan' },
  { id: 'status', label: 'Audit & Status' },
]

// --- LOGIKA MENAMPILKAN FOTO PROFIL ---
const imageUrl = computed(() => {
  return getFotoUrl(santri.value?.foto_profil)
})

onMounted(async () => {
  if (santriList.value.length === 0) await fetchSantri()
  const data = santriList.value.find(s => s.id_santri === route.params.id)
  
  if (data) {
    santri.value = data
  } else {
    router.push('/internal/santri')
  }
})

const triggerUpload = () => fileInput.value?.click()

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (!selectedFile) return

  const reader = new FileReader()
  reader.onload = () => {
    rawImage.value = reader.result as string
    showCropModal.value = true
  }
  reader.readAsDataURL(selectedFile)
}

const executeUpload = async () => {
  if (!cropperRef.value || !santri.value) return
  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  const croppedBase64 = canvas.toDataURL('image/jpeg', 0.8)
  
  startAction('Mengunggah & Memproses Foto...') 
  
  try {
    const res = await uploadFoto(santri.value.id_santri, croppedBase64)
    if (res.success) {
      // Update state lokal supaya computed imageUrl langsung berubah
      santri.value.foto_profil = res.fileId 
      
      showToast("Foto profil berhasil diperbarui", "success")
      showCropModal.value = false
    }
  } catch (e) {
    showToast("Gagal mengunggah foto", "error")
  } finally {
    stopAction()
    if (fileInput.value) fileInput.value.value = ''
  }
}

const display = (val: any) => val || '-'
</script>

<template>
  <div v-if="santri" class="md:p-8 mx-auto pb-20">
    <header class="flex flex-col md:flex-row items-center gap-6 mb-10 w-full">
    <div 
      @click="triggerUpload"
      class="relative w-52 h-64 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl group cursor-pointer bg-slate-800/50"
    >
      <img 
        v-if="imageUrl" 
        :src="imageUrl" 
        class="w-full h-full object-cover transition-transform group-hover:scale-110" 
        @error="(e) => (e.target as HTMLImageElement).src = '/img/placeholder-error.png'" 
      />

      <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-4 text-center">
        <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <span class="text-[10px] font-black uppercase tracking-widest opacity-40">Foto Belum Ada</span>
      </div>

      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="text-center">
          <span class="block text-white text-[10px] font-bold uppercase tracking-tighter">Klik untuk</span>
          <span class="block text-orange-400 text-[10px] font-bold uppercase">Upload Foto</span>
        </div>
      </div>
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
    </div>

      <div class="text-center md:text-left flex-grow">
        <h1 class="text-xl md:text-3xl font-bold text-white tracking-tight leading-tight">{{ santri.nama_lengkap }}</h1>
        <p class="text-orange-400 font-mono tracking-widest uppercase text-xs md:text-sm mt-1">
          {{ santri.id_santri }} • {{ santri.jenjang_daftar }}
        </p>
        <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
          <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-300 uppercase">
            {{ santri.desa }}, {{ santri.kecamatan }}
          </span>
          <span :class="santri.status_aktif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'" 
                class="px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-current/20">
            {{ santri.status_aktif ? 'Aktif' : santri.enum_status }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px]">
        <NuxtLink :to="`/internal/santri/edit/${santri.id_santri}`" 
          class="w-full flex justify-center items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold rounded-xl transition-all shadow-lg shadow-orange-900/40 uppercase tracking-widest">
          Edit Data Lengkap
        </NuxtLink>
        <NuxtLink to="/internal/santri" class="btn-back text-center"> 
          ← Kembali ke List
        </NuxtLink>
      </div>
    </header>

    <div class="flex overflow-x-auto gap-2 mb-6 border-b border-white/5 pb-px scrollbar-hide">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'border-orange-500 text-orange-400 bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'"
        class="px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="glass-card p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
      
<section v-if="activeTab === 'pribadi'" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <SantriInfoItem label="ID Santri" :value="santri.id_santri" />
        <SantriInfoItem label="Nama Lengkap" :value="santri.nama_lengkap" />
        <SantriInfoItem label="Jenis Kelamin" :value="santri.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'" />
        <SantriInfoItem label="Tempat, Tgl Lahir" :value="`${santri.tempat_lahir}, ${santri.tanggal_lahir}`" />
        <SantriInfoItem label="Agama" :value="santri.agama" />
        <SantriInfoItem label="Anak Ke / Jml Saudara" :value="`${santri.anak_ke} dari ${santri.jumlah_saudara}`" />
        <SantriInfoItem label="Status Keluarga" :value="santri.status_keluarga" />
        <SantriInfoItem label="Golongan Darah" :value="santri.golongan_darah" />
        <SantriInfoItem label="Fisik" :value="`TB: ${santri.tinggi_badan}cm / BB: ${santri.berat_badan}kg`" />
        <SantriInfoItem label="Riwayat Penyakit" :value="santri.riwayat_penyakit" />
        <SantriInfoItem label="Kelainan Jasmani" :value="santri.kelainan_jasmani" />
        <SantriInfoItem label="Hobi" :value="`${santri.hobi_olahraga}, ${santri.hobi_seni_budaya}, ${santri.hobi_lainnya}`" />
        <div class="md:col-span-2 border-t border-white/5 pt-6 mt-4">
            <h4 class="text-orange-500/50 text-[9px] font-bold uppercase mb-4 tracking-[0.3em]">Alamat Domisili</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SantriInfoItem label="Alamat" :value="santri.alamat" />
                <SantriInfoItem label="Desa / Kelurahan" :value="santri.desa" />
                <SantriInfoItem label="Kecamatan" :value="santri.kecamatan" />
                <SantriInfoItem label="Kabupaten / Kota" :value="santri.kabupaten" />
                <SantriInfoItem label="Provinsi" :value="santri.provinsi" />
                <SantriInfoItem label="Kode Pos / Negara" :value="`${santri.kode_pos} / ${santri.negara}`" />
            </div>
        </div>
      </section>

      <section v-if="activeTab === 'keluarga'" class="space-y-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div class="md:col-span-2 text-orange-400 text-[10px] font-black uppercase tracking-widest border-b border-orange-500/20 pb-2">Data Ayah</div>
          <SantriInfoItem label="Nama Ayah" :value="santri.nama_ayah" />
          <SantriInfoItem label="NIK Ayah" :value="santri.nik_ayah" />
          <SantriInfoItem label="Tempat, Tgl Lahir Ayah" :value="`${santri.tempat_lahir_ayah}, ${santri.tgl_lahir_ayah}`" />
          <SantriInfoItem label="Pekerjaan / Pendidikan" :value="`${santri.pekerjaan_ayah} / ${santri.pendidikan_ayah}`" />
          <SantriInfoItem label="HP Ayah" :value="santri.hp_ayah" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div class="md:col-span-2 text-orange-400 text-[10px] font-black uppercase tracking-widest border-b border-orange-500/20 pb-2">Data Ibu</div>
          <SantriInfoItem label="Nama Ibu" :value="santri.nama_ibu" />
          <SantriInfoItem label="NIK Ibu" :value="santri.nik_ibu" />
          <SantriInfoItem label="Tempat, Tgl Lahir Ibu" :value="`${santri.tempat_lahir_ibu}, ${santri.tgl_lahir_ibu}`" />
          <SantriInfoItem label="Pekerjaan / Pendidikan" :value="`${santri.pekerjaan_ibu} / ${santri.pendidikan_ibu}`" />
          <SantriInfoItem label="HP Ibu" :value="santri.hp_ibu" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 bg-white/5 p-6 rounded-2xl">
          <div class="md:col-span-2 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2">Penanggung Jawab / Wali</div>
          <SantriInfoItem label="Penanggung Santri" :value="santri.penanggung_santri" />
          <SantriInfoItem label="Nama Wali" :value="santri.nama_wali" />
          <SantriInfoItem label="Pekerjaan / Pendidikan Wali" :value="`${santri.pekerjaan_wali} / ${santri.pendidikan_wali}`" />
          <SantriInfoItem label="HP Wali" :value="santri.hp_wali" />
          <SantriInfoItem label="Alamat Orang Tua / Wali" :value="santri.alamat_orangtua || santri.alamat_wali" />
          <SantriInfoItem label="Email / HP Informasi" :value="`${santri.email_ortu || '-'} / ${santri.hp_informasi}`" />
        </div>
      </section>

      <section v-if="activeTab === 'sekolah'" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <SantriInfoItem label="NISN" :value="santri.nisn" />
        <SantriInfoItem label="No. Ijazah / SKHUN" :value="`${santri.no_ijazah} / ${santri.no_skhun}`" />
        <SantriInfoItem label="Sekolah Asal" :value="santri.nama_sekolah_asal" />
        <SantriInfoItem label="Tahun Lulus" :value="santri.tahun_lulus" />
        <SantriInfoItem label="Alamat Sekolah Asal" :value="santri.alamat_sekolah_asal" />
        <SantriInfoItem label="Lokasi Sekolah" :value="`${santri.kota_sekolah_asal}, ${santri.provinsi_sekolah_asal}`" />
      </section>

      <section v-if="activeTab === 'status'" class="space-y-8">
        <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 class="text-sm font-bold text-white mb-4">Status Saat Ini</h3>
          <div class="flex items-center gap-4">
             <div class="px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold">
               {{ santri.enum_status }}
             </div>
             <p class="text-slate-400 text-sm italic">{{ santri.note_status || 'Tidak ada catatan status.' }}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SantriInfoItem label="Terakhir Diupdate" :value="santri.updated_at" />
          <SantriInfoItem label="Petugas Update" :value="santri.updated_by" />
          <SantriInfoItem label="Catatan Petugas" :value="display(santri.catatan_petugas)" />
        </div>
      </section>

    </div>
  </div>

  <div v-if="showCropModal" class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
    <div class="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl">
      <div class="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 class="text-white font-bold uppercase tracking-[0.2em] text-xs">Sesuaikan Pas Foto</h3>
        <button @click="showCropModal = false" class="text-slate-500 hover:text-white transition-colors">&times; Tutup</button>
      </div>

      <div class="p-4 bg-black/40">
        <div class="rounded-xl overflow-hidden border border-white/5 shadow-inner">
          <cropper
            ref="cropperRef"
            class="h-80 w-full"
            :src="rawImage"
            :stencil-props="{ aspectRatio: 4/5 }"
          />
        </div>
        <p class="text-[9px] text-slate-500 mt-4 text-center leading-relaxed">
            GESER & ZOOM: Gunakan mouse atau jari untuk memposisikan wajah di tengah area terang.<br>
            Rasio otomatis disesuaikan untuk Pas Foto Santri.
        </p>
      </div>

      <div class="p-6 flex gap-3">
        <button @click="showCropModal = false" class="flex-1 px-4 py-3 rounded-xl border border-white/10 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5">
            Batal
        </button>
        <button 
          @click="executeUpload" 
          :disabled="isGlobalLoading"
          class="flex-1 px-4 py-3 rounded-xl bg-orange-600 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-orange-900/40 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isGlobalLoading ? 'Memproses...' : 'Selesai & Simpan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  @apply px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] 
         font-bold uppercase tracking-widest rounded-full transition-all;
}
</style>