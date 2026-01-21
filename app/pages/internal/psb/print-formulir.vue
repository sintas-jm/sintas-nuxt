<script setup lang="ts">
// Menonaktifkan layout utama agar bersih
definePageMeta({ layout: false })

const printData = ref<any>(null)
const currentYear = new Date().getFullYear()

onMounted(() => {
  const raw = localStorage.getItem('print_data_formulir')
  if (raw) {
    printData.value = JSON.parse(raw)
    // Berikan sedikit jeda untuk render DOM sebelum buka dialog print
    setTimeout(() => {
       // window.print() // Aktifkan jika ingin otomatis buka dialog
    }, 500)
  }
})

// Fungsi Helper (Persis seperti logika GAS Anda)
const val = (data: any) => (data && data !== '-' ? data : '')

const formatTgl = (strDate: string) => {
  if (!strDate || strDate === '-') return ''
  const bulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  try {
    const d = new Date(strDate)
    if (isNaN(d.getTime())) return strDate
    return `${d.getDate().toString().padStart(2, '0')} ${bulanIndo[d.getMonth()]} ${d.getFullYear()}`
  } catch { return strDate }
}

const handlePrintAction = () => {
  // Nuxt 3 built-in flag untuk mengecek client-side
  if (import.meta.client) {
    window.print()
  }
}
</script>

<template>
  <div v-if="printData" class="print-page">
    <div class="no-print-area">
      <div class="flex gap-2">
        <button @click="$router.back()" class="btn-back">← Kembali</button>
        <button @click="handlePrintAction" class="btn-cetak">🖨️ Cetak PDF / Printer</button>
      </div>
      <p class="text-xs text-white/50 italic mt-2">Ukuran Kertas: F4/Folio | Margin: Kiri 2cm, Kanan 1cm, Atas/Bawah 1cm</p>
    </div>

    <div class="print-container">
      <table class="header-table"><tbody>
        <tr style="vertical-align: bottom;">
          <td class="title-area" style="padding-right: 10px;">
            <h2 style="font-weight: bold;">PONDOK PESANTREN MATLABUS SALIK</h2>
            <h2 style="font-weight: bold;">( A L &nbsp;-&nbsp; M A T L A B )</h2>
            <p>TAHUN PELAJARAN {{ currentYear }}/{{ currentYear + 1 }}</p>
            <h2 style="margin-top: 30px; font-weight:400; border-bottom: solid 3px gray;">FORMULIR PENDAFTARAN SANTRI BARU</h2>
          </td>
          <td class="photo-box">FOTO<br>3 x 4</td>
        </tr>
      </tbody></table>

      <div class="section-header">I. DATA CALON SANTRI</div>
      <table class="data-table"><tbody>
        <tr>
          <td class="label">ID Pendaftar &nbsp; | &nbsp; Jenjang</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.id_pendaftar) }}</span>
            <span class="font-normal text-black mr-5">|</span> {{ val(printData.jenjang_daftar?.toUpperCase()) }}
          </td>
        </tr>
        <tr><td class="label">Nama Lengkap</td><td class="colon">:</td><td class="value">{{ val(printData.nama_lengkap) }}</td></tr>
        <tr><td class="label">Tempat, Tanggal Lahir</td><td class="colon">:</td><td class="value">{{ val(printData.tempat_lahir) }}, {{ formatTgl(printData.tanggal_lahir) }}</td></tr>
        <tr><td class="label">Jenis Kelamin</td><td class="colon">:</td><td class="value">{{ printData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td></tr>
        <tr><td class="label">Agama</td><td class="colon">:</td><td class="value">{{ val(printData.agama) }}</td></tr>
        <tr>
          <td class="label">Anak Ke-</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[30px] text-center">{{ val(printData.anak_ke) }}</span>
            <span class="font-normal text-black mx-4">dari</span>
            <span class="inline-block min-w-[30px] text-center">{{ val(printData.jumlah_saudara) }}</span>
            <span class="font-normal text-black ml-4">bersaudara</span>
          </td>
        </tr>
        <tr><td class="label">Alamat</td><td class="colon">:</td><td class="value">{{ val(printData.alamat) }}</td></tr>
        <tr>
          <td class="label">Desa &nbsp; | &nbsp; Kecamatan</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.desa) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.kecamatan) }}
          </td>
        </tr>
        <tr>
          <td class="label">Kabupaten &nbsp; | &nbsp; Provinsi</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.kabupaten) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.provinsi) }}
          </td>
        </tr>
        <tr>
          <td class="label">Negara &nbsp; | &nbsp; Kode Pos</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.negara) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.kode_pos) }}
          </td>
        </tr>
      </tbody></table>

      <span class="sub-title" style="padding-top: 15px">KESEHATAN & HOBI</span>
      <table class="data-table"><tbody>
        <tr>
          <td class="label">Gol. Darah &nbsp; | &nbsp; TB &nbsp; | &nbsp; BB</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[70px] text-center">{{ val(printData.golongan_darah) }}</span>
            <span class="font-normal text-black mx-4">|</span>
            <span class="inline-block min-w-[70px] text-center">{{ val(printData.tinggi_badan) }}</span>
            <span class="font-normal text-black ml-2 mr-4">(cm) |</span>
            <span class="inline-block min-w-[70px] text-center">{{ val(printData.berat_badan) }}</span>
            <span class="font-normal text-black ml-2">(kg)</span>
          </td>
        </tr>
        <tr><td class="label">Riwayat Sakit</td><td class="colon">:</td><td class="value">{{ val(printData.riwayat_penyakit) }}</td></tr>
        <tr><td class="label">Kelainan Jasmani</td><td class="colon">:</td><td class="value">{{ val(printData.kelainan_jasmani) }}</td></tr>
        <tr><td class="label">Hobi Seni</td><td class="colon">:</td><td class="value">{{ val(printData.hobi_seni_budaya) }}</td></tr>
        <tr><td class="label">Olahraga</td><td class="colon">:</td><td class="value">{{ val(printData.hobi_olahraga) }}</td></tr>
        <tr><td class="label">Hobi lainnya</td><td class="colon">:</td><td class="value">{{ val(printData.hobi_lainnya) }}</td></tr>
      </tbody></table>

      <div class="section-header">II. DATA SEKOLAH ASAL</div>
      <table class="data-table"><tbody>
        <tr><td class="label">NISN</td><td class="colon">:</td><td class="value">{{ val(printData.nisn) }}</td></tr>
        <tr><td class="label">No. Ijazah</td><td class="colon">:</td><td class="value">{{ val(printData.no_ijazah) }}</td></tr>
        <tr><td class="label">No. SKHUN</td><td class="colon">:</td><td class="value">{{ val(printData.no_skhun) }}</td></tr>
        <tr><td class="label">Nama Sekolah</td><td class="colon">:</td><td class="value">{{ val(printData.nama_sekolah_asal) }}</td></tr>
        <tr><td class="label">Alamat Sekolah</td><td class="colon">:</td><td class="value">{{ val(printData.alamat_sekolah_asal) }}</td></tr>
        <tr>
          <td class="label">Kabupaten &nbsp; | &nbsp; Provinsi</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.kota_sekolah_asal) }} </span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.provinsi_sekolah_asal) }}
          </td>
        </tr>
        <tr><td class="label">Negara</td><td class="colon">:</td><td class="value">{{ val(printData.negara_sekolah_asal) }}</td></tr>
        <tr><td class="label">Tahun Lulus</td><td class="colon">:</td><td class="value">{{ val(printData.tahun_lulus) }}</td></tr>
      </tbody></table>

      <div class="section-header">III. DATA ORANG TUA</div>
      <span class="sub-title">DATA AYAH</span>
      <table class="data-table"><tbody>
        <tr><td class="label">No. KK</td><td class="colon">:</td><td class="value">{{ val(printData.no_kk) }}</td></tr>
        <tr><td class="label">Nama Ayah</td><td class="colon">:</td><td class="value">{{ val(printData.nama_ayah) }}</td></tr>
        <tr><td class="label">NIK</td><td class="colon">:</td><td class="value">{{ val(printData.nik_ayah) }}</td></tr>
        <tr><td class="label">Tempat, Tanggal Lahir</td><td class="colon">:</td><td class="value">{{ val(printData.tempat_lahir_ayah) }}, {{ formatTgl(printData.tgl_lahir_ayah) }}</td></tr>
        <tr><td class="label">Agama</td><td class="colon">:</td><td class="value">{{ val(printData.agama_ayah) }}</td></tr>
        <tr><td class="label">No. HP</td><td class="colon">:</td><td class="value">{{ val(printData.telp_ayah) }}</td></tr>
        <tr><td class="label">Pendidikan</td><td class="colon">:</td><td class="value">{{ val(printData.pendidikan_ayah) }}</td></tr>
        <tr><td class="label">Pekerjaan</td><td class="colon">:</td><td class="value">{{ val(printData.pekerjaan_ayah) }}</td></tr>
        <tr></tr>
      </tbody></table>
      
      <span class="sub-title" style="padding-top: 15px">DATA IBU</span>
      <table class="data-table"><tbody>
        <tr><td class="label">Nama Ibu</td><td class="colon">:</td><td class="value">{{ val(printData.nama_ibu) }}</td></tr>
        <tr><td class="label">NIK</td><td class="colon">:</td><td class="value">{{ val(printData.nik_ibu) }}</td></tr>
        <tr><td class="label">Tempat, Tanggal Lahir</td><td class="colon">:</td><td class="value">{{ val(printData.tempat_lahir_ibu) }}, {{ formatTgl(printData.tgl_lahir_ibu) }}</td></tr>
        <tr><td class="label">Agama</td><td class="colon">:</td><td class="value">{{ val(printData.agama_ibu) }}</td></tr>
        <tr><td class="label">No. HP</td><td class="colon">:</td><td class="value">{{ val(printData.telp_ibu) }}</td></tr>
        <tr><td class="label">Pendidikan</td><td class="colon">:</td><td class="value">{{ val(printData.pendidikan_ibu) }}</td></tr>
        <tr><td class="label">Pekerjaan</td><td class="colon">:</td><td class="value">{{ val(printData.pekerjaan_ibu) }}</td></tr>
      </tbody></table>

      <table class="data-table"><tbody>
        <tr class="spacer-row"><td class="label">Alamat Orang Tua</td><td class="colon">:</td><td class="value">{{ val(printData.alamat_orangtua) }}</td></tr>
        <tr>
          <td class="label">Desa &nbsp; | &nbsp; Kecamatan</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.desa_ortu) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.kecamatan_ortu) }}
          </td>
        </tr>
        <tr>
          <td class="label">Kabupaten &nbsp; | &nbsp; Provinsi</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.kabupaten_ortu) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.provinsi_ortu) }}
          </td>
        </tr>
        <tr><td class="label">Kode Pos</td><td class="colon">:</td><td class="value">{{ val(printData.kode_pos_ortu) }}</td></tr>
      </tbody></table>

      <span class="sub-title" style="padding-top: 15px">KONTAK & INFORMASI</span>
      <table class="data-table"><tbody>
        <tr><td class="label">Keluarga masih Hidup</td><td class="colon">:</td><td class="value">{{ val(printData.orangtua_hidup) }}</td></tr>
        <tr><td class="label">Penanggung Santri</td><td class="colon">:</td><td class="value capitalize">{{ val(printData.penanggung_santri) }}</td></tr>
        <tr>
          <td class="label">Kontak Infomasi &nbsp; | &nbsp; Email</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.hp_informasi) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.email_ortu) }}
          </td>
        </tr>
        <tr><td class="label">Penghasilan</td><td class="colon">:</td><td class="value">{{ val(printData.penghasilan_bulanan) }}</td></tr>
      </tbody></table>

      <div class="section-header">IV. DATA WALI (JIKA ADA)</div>
      <table class="data-table"><tbody>
        <tr><td class="label">Nama Wali</td><td class="colon">:</td><td class="value">{{ val(printData.nama_wali) }}</td></tr>
        <tr><td class="label">Hubungan dg Santri</td><td class="colon">:</td><td class="value">{{ val(printData.hubungan_dengan_santri) }}</td></tr>
        <tr><td class="label">Tempat, Tanggal Lahir</td><td class="colon">:</td><td class="value">{{ val(printData.tempat_lahir_wali) }}, {{ formatTgl(printData.tgl_lahir_wali) }}</td></tr>
        <tr>
          <td class="label">Kontak Infomasi &nbsp; | &nbsp; Email</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.hp_wali) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.email_wali) }}
          </td>
        </tr>
        <tr><td class="label">Alamat</td><td class="colon">:</td><td class="value">{{ val(printData.alamat_wali) }}</td></tr>
        <tr>
          <td class="label">Desa &nbsp; | &nbsp; Kecamatan</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.desa_wali) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.kecamatan_wali) }}
          </td>
        </tr>
        <tr>
          <td class="label">Kabupaten &nbsp; | &nbsp; Provinsi</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.kabupaten_wali) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.provinsi_wali) }}
          </td>
        </tr>
        <tr>
          <td class="label">Negara &nbsp; | &nbsp; Kode Pos</td> <td class="colon">:</td>
          <td class="value">
            <span class="inline-block min-w-[200px]">{{ val(printData.negara_wali) }}</span>
            <span class="font-normal text-black mr-5">|</span>{{ val(printData.kode_pos_wali) }}
          </td>
        </tr>
        <tr><td class="label">Pendidikan</td><td class="colon">:</td><td class="value">{{ val(printData.pendidikan_wali) }}</td></tr>
        <tr><td class="label">Pekerjaan</td><td class="colon">:</td><td class="value">{{ val(printData.pekerjaan_wali) }}</td></tr>
      </tbody></table>

      <table class="sig-section"><tbody>
        <tr>
          <td class="w-[20%]">
            <span class="sig-label">Petugas</span>
            <div class="sig-name-box"></div>
          </td>
          <td class="w-[35%]">
            <span class="sig-label">Orang Tua / Wali</span>
            <div class="sig-name-box"></div>
          </td>
          <td class="w-[45%]">
            <span class="sig-label">Calon Santri</span>
            <div class="sig-name-box uppercase">{{ val(printData.nama_lengkap) }}</div>
          </td>
        </tr>
      </tbody></table>
    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Kertas F4 */
@page {
  size: 210mm 330mm;
  margin: 1cm 1cm 1cm 2cm; /* Atas, Kanan, Bawah, Kiri */
}

.print-page {
  background: #333;
  min-height: 100vh;
  padding: 20px 0;
}

.print-container {
  width: 210mm;
  min-height: 330mm;
  margin: 0 auto;
  background: white;
  padding: 10mm;
  color: black;
  font-family: Arial, sans-serif;
  font-size: 10pt;
}

/* Header & Table Styling */
.header-table { width: 100%; margin-bottom: 10px; }
.photo-box { width: 3cm; height: 4cm; border: 1px dotted #000; text-align: center; vertical-align: middle; font-size: 8pt; }
.title-area { padding-left: 0px; text-align: left; }
.title-area h2 { margin: 0; font-size: 14pt; }
.title-area h3 { margin: 0; font-size: 11pt; }

.section-header { 
  background: #ccc !important; 
  -webkit-print-color-adjust: exact; 
  padding: 4px 10px; 
  font-weight: bold; 
  border: 1px solid #ccc; 
  margin: 15px 0 5px 0;
}

.data-table { width: 100%; border-collapse: collapse; }
.data-table td { padding: 4px 0; vertical-align: top; }
.label { width: 180px; }
.colon { width: 15px; text-align: center; }
.value { border-bottom: 0.5px solid #eee; }

.sig-section { width: 100%; margin-top: 50px; border-collapse: collapse; }
.sig-section td { border: 1px solid #ccc; padding: 10px; text-align: center; height: 120px; vertical-align: top; }
.sig-label { font-weight: bold; font-size: 8pt; display: block; }
.sig-name-box { margin-top: 80px; font-weight: bold; border-top: 1px dotted white; padding-top: 5px; }

/* Control Area */
.no-print-area { width: 210mm; margin: 0 auto 10px auto; text-align: right; }
.btn-cetak { background: #e67e22; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; }
.btn-back { background: #666; color: white; padding: 8px 16px; border-radius: 6px; }

@media print {
  body, .print-page { background: white; padding: 0; }
  .no-print-area { display: none; }
  .print-container { margin: 0; box-shadow: none; border: none; }
  .value { border-bottom: 0.5px solid #000 !important; }
}

.spacer-row td {
  padding-top: 20px !important;
}
.sub-title {
  font-weight: bold;
  text-decoration: underline;
  margin: 10px 0 5px 0;
  display: block;
  font-size: 9pt;
}
.inline-block {
  display: inline-block;
}
.capitalize {
  text-transform: capitalize;
}
</style>