// app/composables/useRekap.ts

interface Pendaftar {
  id_pendaftar: string;
  id_psb: string;
  jenjang_daftar: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  anak_ke: string;
  jumlah_saudara: string;
  status_keluarga: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  negara: string;
  golongan_darah: string;
  tinggi_badan: string;
  berat_badan: string;
  riwayat_penyakit: string;
  kelainan_jasmani: string;
  hobi_seni_budaya: string;
  hobi_olahraga: string;
  hobi_lainnya: string;
  nisn: string;
  tahun_lulus: string;
  no_ijazah: string;
  no_skhun: string;
  nama_sekolah_asal: string;
  alamat_sekolah_asal: string;
  kota_sekolah_asal: string;
  provinsi_sekolah_asal: string;
  negara_sekolah_asal: string;
  no_kk: string;
  nama_ayah: string;
  nik_ayah: string;
  tempat_lahir_ayah: string;
  tgl_lahir_ayah: string;
  agama_ayah: string;
  pekerjaan_ayah: string;
  pendidikan_ayah: string;
  nama_ibu: string;
  nik_ibu: string;
  tempat_lahir_ibu: string;
  tgl_lahir_ibu: string;
  agama_ibu: string;
  pekerjaan_ibu: string;
  pendidikan_ibu: string;
  alamat_orangtua: string;
  desa_ortu: string;
  kecamatan_ortu: string;
  kabupaten_ortu: string;
  provinsi_ortu: string;
  kode_pos_ortu: string;
  hp_ayah: string;
  hp_ibu: string;
  telp_rumah: string;
  hp_informasi: string;
  email_ortu: string;
  penghasilan_bulanan: string;
  orangtua_hidup: string;
  penanggung_santri: string;
  nama_wali: string;
  tempat_lahir_wali: string;
  tgl_lahir_wali: string;
  pekerjaan_wali: string;
  pendidikan_wali: string;
  alamat_wali: string;
  desa_wali: string;
  kecamatan_wali: string;
  kabupaten_wali: string;
  provinsi_wali: string;
  negara_wali: string;
  kode_pos_wali: string;
  email_wali: string;
  telp_rumah_wali: string;
  hp_wali: string;
  hubungan_dengan_santri: string;
  status_pendaftaran: string;
  timestamp_submit: string;
  updated_at: string;
  updated_by: string;
  catatan_petugas: string;
  [key: string]: any; 
}

export const useRekap = () => {
  const pendaftarList = useState<Pendaftar[]>('pendaftar_list', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRekap = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Pendaftar[]>('/api/pendaftaran', {
        params: { action: 'getRekapDataInternal' }
      })
      
      // Data yang datang dari GAS akan otomatis dipetakan ke dalam array
      // Meskipun field-nya banyak, TypeScript tidak akan protes karena ada [key: string]: any
      pendaftarList.value = Array.isArray(data) ? data : []
    } catch (err: any) {
      error.value = err.message || 'Gagal mengambil data rekap'
    } finally {
      loading.value = false
    }
  }

  // Fungsi tambahan untuk update status (untuk Admin nanti)
  const updateStatus = async (id: string, newStatus: string) => {
    // Logika update status bisa ditaruh di sini nanti
  }

  return {
    pendaftarList,
    loading,
    error,
    fetchRekap,
    updateStatus
  }
}