import { z } from 'zod'

// 1. Skema Identitas & Fisik Santri
const santriSchema = z.object({
  id_pendaftar: z.string(),
  id_psb: z.string(),
  jenjang_daftar: z.string().min(1, "Jenjang wajib dipilih"),
  nama_lengkap: z.string().min(3, "Nama minimal 3 karakter"),
  tempat_lahir: z.string().min(1),
  tanggal_lahir: z.string(),
  jenis_kelamin: z.enum(['L', 'P']),
  agama: z.string().default('Islam'),
  anak_ke: z.coerce.string(),
  jumlah_saudara: z.coerce.string(),
  status_keluarga: z.string(),
  alamat: z.string().min(5),
  desa: z.string(),
  kecamatan: z.string(),
  kabupaten: z.string(),
  provinsi: z.string(),
  kode_pos: z.string(),
  negara: z.string().default('Indonesia'),
  golongan_darah: z.string().optional(),
  tinggi_badan: z.coerce.string().optional(),
  berat_badan: z.coerce.string().optional(),
  riwayat_penyakit: z.string().optional(),
  kelainan_jasmani: z.string().optional(),
  hobi_seni_budaya: z.string().optional(),
  hobi_olahraga: z.string().optional(),
  hobi_lainnya: z.string().optional(),
})

// 2. Skema Sekolah Asal
const sekolahSchema = z.object({
  nisn: z.string().optional(),
  tahun_lulus: z.string().optional(),
  no_ijazah: z.string().optional(),
  no_skhun: z.string().optional(),
  nama_sekolah_asal: z.string(),
  alamat_sekolah_asal: z.string(),
  kota_sekolah_asal: z.string(),
  provinsi_sekolah_asal: z.string(),
  negara_sekolah_asal: z.string().default('Indonesia'),
})

// 3. Skema Orang Tua (Ayah & Ibu)
const ortuSchema = z.object({
  no_kk: z.string().optional(),
  nama_ayah: z.string().min(3),
  nik_ayah: z.string().optional(),
  tempat_lahir_ayah: z.string().optional(),
  tgl_lahir_ayah: z.string().optional(),
  agama_ayah: z.string().optional(),
  pekerjaan_ayah: z.string(),
  pendidikan_ayah: z.string(),
  nama_ibu: z.string().min(3),
  nik_ibu: z.string().optional(),
  tempat_lahir_ibu: z.string().optional(),
  tgl_lahir_ibu: z.string().optional(),
  agama_ibu: z.string().optional(),
  pekerjaan_ibu: z.string(),
  pendidikan_ibu: z.string(),
  alamat_orangtua: z.string(),
  desa_ortu: z.string(),
  kecamatan_ortu: z.string(),
  kabupaten_ortu: z.string(),
  provinsi_ortu: z.string(),
  kode_pos_ortu: z.string(),
  hp_ayah: z.string(),
  hp_ibu: z.string().optional(),
  telp_rumah: z.string().optional(),
  hp_informasi: z.string(),
  email_ortu: z.string().email().optional().or(z.literal('')),
  penghasilan_bulanan: z.string(),
  orangtua_hidup: z.string(),
  penanggung_santri: z.string(),
})

// 4. Skema Wali (Optional/Conditional)
const waliSchema = z.object({
  nama_wali: z.string().optional(),
  tempat_lahir_wali: z.string().optional(),
  tgl_lahir_wali: z.string().optional(),
  pekerjaan_wali: z.string().optional(),
  pendidikan_wali: z.string().optional(),
  alamat_wali: z.string().optional(),
  desa_wali: z.string().optional(),
  kecamatan_wali: z.string().optional(),
  kabupaten_wali: z.string().optional(),
  provinsi_wali: z.string().optional(),
  negara_wali: z.string().optional(),
  kode_pos_wali: z.string().optional(),
  email_wali: z.string().optional(),
  telp_rumah_wali: z.string().optional(),
  hp_wali: z.string().optional(),
  hubungan_dengan_santri: z.string().optional(),
})

// 5. Skema Sistem & Metadata
const systemSchema = z.object({
  status_pendaftaran: z.string().default('Menunggu Konfirmasi'),
  timestamp_submit: z.string().optional(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
  catatan_petugas: z.string().optional(),
})

// --- PENGGABUNGAN SEMUA SKEMA ---
export const pendaftaranSchema = santriSchema
  .merge(sekolahSchema)
  .merge(ortuSchema)
  .merge(waliSchema)
  .merge(systemSchema)

// Tip: Gunakan .partial() jika ingin membuat semua field menjadi opsional (berguna untuk update)
export const updatePendaftaranSchema = pendaftaranSchema.partial()

/**

// server/utils/pendaftaranSchema.ts
import { z } from 'zod'

export const pendaftaranSchema = z.object({
  // --- IDENTITAS UTAMA ---
  id_pendaftar: z.string(),
  id_psb: z.string(),
  nama_lengkap: z.string().min(3),
  nik: z.string().length(16),
  jenis_kelamin: z.enum(['L', 'P']),
  
  // --- DATA SEKOLAH ---
  sekolah_asal: z.string().min(1),
  npsn_sekolah: z.string().optional(),
  
  // --- DATA ORANG TUA (Contoh beberapa dari 80+ field) ---
  nama_ayah: z.string().min(3),
  pekerjaan_ayah: z.string(),
  penghasilan_ayah: z.string(),
  
  // --- METADATA ---
  updated_by: z.string(),
  // Tambahkan semua field lainnya di sini...
}).partial() // Gunakan .partial() jika ingin semua field opsional kecuali yang divalidasi manual

 */