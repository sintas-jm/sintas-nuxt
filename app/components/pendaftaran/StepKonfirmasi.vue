<template>
  <div class="py-4 space-y-8">
    <div class="relative overflow-hidden bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl group">
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Konfirmasi Akhir</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Tinjau kembali data Anda sebelum melakukan pengiriman</p>
        </div>
      </div>
    </div>

    <div v-if="emptyFieldsCount > 0" class="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start">
      <div class="p-2 bg-amber-500/20 rounded-lg text-amber-500 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <div class="space-y-1">
        <h4 class="text-[11px] font-black text-amber-500 uppercase tracking-widest">Data Belum Lengkap</h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          Ditemukan <span class="text-amber-200 font-bold">{{ emptyFieldsCount }} field</span> data opsional yang belum terisi. Anda tetap dapat mendaftar, namun pastikan untuk melengkapi data tersebut saat proses <span class="text-amber-400 underline italic">daftar ulang</span> di sekolah.
        </p>
      </div>
    </div>

    <div v-else class="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex gap-4 items-start">
      <div class="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="space-y-1">
        <h4 class="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Data Sangat Lengkap</h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          Terima kasih telah mengisi seluruh data pendaftaran dengan lengkap. Ini akan sangat mempercepat proses daftar ulang Anda nanti.
        </p>
      </div>
    </div>

    <div class="space-y-6">
      <label class="relative flex items-start gap-4 p-6 bg-white/[0.03] border border-white/10 rounded-2xl cursor-pointer transition-all duration-300 group hover:bg-white/[0.05] hover:border-blue-500/30">
        <div class="relative flex items-center h-6">
          <input 
            type="checkbox" 
            v-model="localData.is_setuju" 
            :class="[
              'peer w-6 h-6 rounded-lg transition-all cursor-pointer appearance-none',
              // Tambahkan logika warna merah di sini (misal jika validasi gagal)
              !localData.is_setuju ? 'border- border-red-500/40 bg-red-500/5' : 'bg-white/[0.05] border-white/20'
            ]"
          >
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Saya Menjamin Kebenaran Data</span>
          <span class="text-[11px] text-slate-500 leading-relaxed uppercase tracking-tighter">
            Saya bersedia melengkapi seluruh kekurangan data pada saat verifikasi fisik/daftar ulang.
          </span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const localData = ref({ ...props.modelValue })

// Hitung field kosong yang krusial tapi tidak mandatory di awal
const emptyFieldsCount = computed(() => {
  // Daftar field yang ingin dipantau kelengkapannya
  const watchedFields = [
    'nama_lengkap',
    'tempat_lahir',
    'tanggal_lahir',
    'jenis_kelamin',
    'agama',
    'anak_ke',
    'jumlah_saudara',
    'status_keluarga',
    'alamat',
    'desa',
    'kecamatan',
    'kabupaten',
    'provinsi',
    'kode_pos',
    'negara',
    'golongan_darah',
    'tinggi_badan',
    'berat_badan',
    'riwayat_penyakit',
    'kelainan_jasmani',
    'hobi_seni_budaya',
    'hobi_olahraga',
    'hobi_lainnya',
    'nisn',
    'tahun_lulus',
    'no_ijazah',
    'no_skhun',
    'nama_sekolah_asal',
    'alamat_sekolah_asal',
    'kota_sekolah_asal',
    'provinsi_sekolah_asal',
    'negara_sekolah_asal',
    'no_kk',
    'nama_ayah',
    'nik_ayah',
    'tempat_lahir_ayah',
    'tgl_lahir_ayah',
    'agama_ayah',
    'pekerjaan_ayah',
    'pendidikan_ayah',
    'nama_ibu',
    'nik_ibu',
    'tempat_lahir_ibu',
    'tgl_lahir_ibu',
    'agama_ibu',
    'pekerjaan_ibu',
    'pendidikan_ibu',
    'alamat_orangtua',
    'desa_ortu',
    'kecamatan_ortu',
    'kabupaten_ortu',
    'provinsi_ortu',
    'kode_pos_ortu',
    'hp_ayah',
    'hp_ibu',
    'telp_rumah',
    'hp_informasi',
    'email_ortu',
    'penghasilan_bulanan',
    'orangtua_hidup'
  ]
  
  return watchedFields.filter(field => {
    const value = localData.value[field as keyof typeof localData.value]
    return !value || value.toString().trim() === ''
  }).length
})

const pernyataan = [
  "Seluruh data yang saya masukkan adalah benar dan siap dibuktikan dengan dokumen asli saat daftar ulang.",
  "Saya memahami bahwa kekurangan data pada formulir ini wajib dilengkapi sebelum proses seleksi berakhir.",
  "Data ini akan disimpan dengan aman oleh Panitia PSB untuk keperluan administrasi awal."
]

watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>

<style scoped>
input[type="checkbox"] {
  @apply border transition-all cursor-pointer;
}

/* State ketika dicentang (tetap biru agar kontras) */
input[type="checkbox"]:checked {
  @apply bg-blue-600 border-blue-400 !important;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-size: 100% 100%;
}

/* Efek Glow Merah jika belum dicentang (Opsional) */
.border-red-500\/40 {
  @apply animate-pulse;
  box-shadow: 0 0 10px rgba(239, 68, 68, 1);
}
</style>