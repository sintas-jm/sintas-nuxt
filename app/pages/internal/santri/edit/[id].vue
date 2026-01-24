<script setup lang="ts">
import { useSantri } from '~/composables/useSantri'
import { useActionLoading } from '~/composables/useActionLoading'

definePageMeta({ layout: 'internal' })

const route = useRoute()
const router = useRouter()
const { santriList, fetchSantri, updateSantri } = useSantri()
const { startAction, stopAction } = useActionLoading()
const { showToast } = useToast()

const santri = ref<any>(null)
const form = ref<any>({})

// Ambil data awal
onMounted(async () => {
  if (santriList.value.length === 0) await fetchSantri()
  const data = santriList.value.find(s => s.id_santri === route.params.id)
  if (data) {
    santri.value = data
    // Clone data agar tidak langsung mengubah state global sebelum di-save
    form.value = JSON.parse(JSON.stringify(data))
  } else {
    router.push('/internal/santri')
  }
})

const handleSave = async () => {
  // Validasi sederhana
  if (!form.value.nama_lengkap) {
    showToast("Nama lengkap tidak boleh kosong", "error")
    return
  }

  startAction('Mengirim data ke Database...')
  
  try {
    // Pastikan kita mengirim ID Santri untuk identifikasi di Spreadsheet
    const res: any = await updateSantri(form.value)
    
    if (res.success) {
      showToast("Data berhasil disimpan", "success")
      
      // 1. Update State Global (agar halaman list & detail sinkron tanpa refresh)
      const index = santriList.value.findIndex(s => s.id_santri === form.value.id_santri)
      if (index !== -1) {
        // Gunakan spread operator untuk mengganti data lama dengan yang baru
        santriList.value[index] = { ...form.value }
      }

      // 2. Kembali ke halaman detail untuk melihat hasil
      router.push(`/internal/santri/${form.value.id_santri}`)
    } else {
      showToast(res.message || "Gagal memperbarui data", "error")
    }
  } catch (e) {
    console.error(e)
    showToast("Terjadi kesalahan koneksi", "error")
  } finally {
    stopAction()
  }
}
</script>

<template>
  <div v-if="santri">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h2 class="text-orange-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-1">Mode Edit</h2>
        <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight">{{ form.nama_lengkap }}</h1>
      </div>
      <div class="flex gap-2 w-full md:w-auto">
        <button @click="router.back()" class="flex-1 md:flex-none px-6 py-2 rounded-xl border border-white/10 text-slate-400 text-[10px] font-bold uppercase">Batal</button>
        <button @click="handleSave" class="flex-1 md:flex-none px-8 py-2 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-900/40 text-[10px] font-bold uppercase hover:bg-orange-500">
          Simpan Data
        </button>
      </div>
    </header>

    <div class="space-y-12">
      <div class="glass-card p-8 rounded-3xl border border-white/10">
        <h3 class="text-orange-400 text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-orange-600 rounded-full"></span>
          Data Pribadi Santri
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <SantriEditItem label="ID Santri (Locked)" v-model="form.id_santri" disabled />
          <SantriEditItem label="Nama Lengkap" v-model="form.nama_lengkap" />
          <SantriEditItem label="Jenis Kelamin (L/P)" v-model="form.jenis_kelamin" />
          <SantriEditItem label="Tempat Lahir" v-model="form.tempat_lahir" />
          <SantriEditItem label="Tanggal Lahir" v-model="form.tanggal_lahir" type="date" />
          <SantriEditItem label="Agama" v-model="form.agama" />
          <SantriEditItem label="Anak Ke" v-model="form.anak_ke" type="number" />
          <SantriEditItem label="Jumlah Saudara" v-model="form.jumlah_saudara" type="number" />
          <SantriEditItem label="Status Keluarga" v-model="form.status_keluarga" />
          <SantriEditItem label="Gol. Darah" v-model="form.golongan_darah" />
          <SantriEditItem label="Tinggi Badan (cm)" v-model="form.tinggi_badan" type="number" />
          <SantriEditItem label="Berat Badan (kg)" v-model="form.berat_badan" type="number" />
          <SantriEditItem label="Riwayat Sakit" v-model="form.riwayat_penyakit"  />
          <SantriEditItem label="Kelainan Jasmani" v-model="form.kelainan_jasmani" />
        </div>
        
        <div class="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <SantriEditItem label="Alamat Lengkap" v-model="form.alamat" class="md:col-span-1" />
          <SantriEditItem label="Desa" v-model="form.desa" />
          <SantriEditItem label="Kecamatan" v-model="form.kecamatan" />
          <SantriEditItem label="Kabupaten" v-model="form.kabupaten" />
          <SantriEditItem label="Provinsi" v-model="form.provinsi" />
          <SantriEditItem label="Kode Pos" v-model="form.kode_pos" />
          <SantriEditItem label="Negara" v-model="form.negara" />
        </div>
      </div>

      <div class="glass-card p-8 rounded-3xl border border-white/10">
        <h3 class="text-orange-400 text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Riwayat Pendidikan
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <SantriEditItem label="NISN" v-model="form.nisn" />
          <SantriEditItem label="Nama Sekolah Asal" v-model="form.nama_sekolah_asal" />
          <SantriEditItem label="Tahun Lulus" v-model="form.tahun_lulus" />
          <SantriEditItem label="No. Ijazah" v-model="form.no_ijazah" />
          <SantriEditItem label="No. SKHUN" v-model="form.no_skhun" />
          <SantriEditItem label="Kota Sekolah" v-model="form.kota_sekolah_asal" />
          <SantriEditItem label="Alamat Sekolah" v-model="form.alamat_sekolah_asal" class="md:col-span-1" />
        </div>
      </div>

      <div class="glass-card p-8 rounded-3xl border border-white/10">
        <h3 class="text-orange-400 text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-green-600 rounded-full"></span>
          Data Orang Tua & Wali
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <SantriEditItem label="Nama Ayah" v-model="form.nama_ayah" />
          <SantriEditItem label="NIK Ayah" v-model="form.nik_ayah" />
          <SantriEditItem label="HP Ayah" v-model="form.hp_ayah" />
          <SantriEditItem label="Nama Ibu" v-model="form.nama_ibu" />
          <SantriEditItem label="NIK Ibu" v-model="form.nik_ibu" />
          <SantriEditItem label="HP Ibu" v-model="form.hp_ibu" />
          <SantriEditItem label="Nama Wali" v-model="form.nama_wali" />
          <SantriEditItem label="Penanggung Santri" v-model="form.penanggung_santri" />
          <SantriEditItem label="HP Wali" v-model="form.hp_wali" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-edit {
  @apply w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50 transition-all text-sm;
}
</style>