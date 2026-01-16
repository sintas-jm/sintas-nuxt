<template>
  <div class="py-4 space-y-8">
    <div class="relative overflow-hidden bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl group">
      <div class="absolute top-0 right-0 p-4 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-[0.2em]">Konfirmasi Akhir</h3>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest text-wrap max-w-xs">Tinjau kembali data Anda sebelum melakukan pengiriman</p>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-white/[0.02] border border-white/10 p-8 rounded-2xl shadow-inner relative">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f172a] px-4 py-1 border border-white/10 rounded-full">
           <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Pernyataan Orang Tua</span>
        </div>

        <p class="text-sm text-slate-300 leading-relaxed mb-8 text-center italic">
          "Dengan menekan tombol <span class="text-blue-400 font-bold">Kirim Pendaftaran</span>, saya selaku orang tua/wali calon santri menyatakan dengan penuh kesadaran bahwa:"
        </p>
        
        <ul class="space-y-4">
          <li v-for="(point, i) in pernyataan" :key="i" class="flex gap-4 items-start group">
            <div class="mt-1 w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
              <span class="text-[10px] text-blue-400 font-bold">{{ i + 1 }}</span>
            </div>
            <span class="text-xs text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{{ point }}</span>
          </li>
        </ul>
      </div>

      <label class="relative flex items-start gap-4 p-6 bg-white/[0.03] border border-white/10 rounded-2xl cursor-pointer transition-all duration-300 group hover:bg-white/[0.05] hover:border-blue-500/30">
        <div class="relative flex items-center h-5">
          <input 
            type="checkbox" 
            v-model="localData.is_setuju" 
            class="peer w-6 h-6 rounded-lg bg-slate-800 border-white/10 text-blue-600 focus:ring-offset-0 focus:ring-blue-500/20"
          >
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
            Saya Menjamin Kebenaran Data
          </span>
          <span class="text-[11px] text-slate-500 leading-relaxed uppercase tracking-tighter">
            Saya bersedia menerima sanksi pembatalan pendaftaran jika di kemudian hari ditemukan pemalsuan dokumen atau data.
          </span>
        </div>
        
        <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none transition-opacity"></div>
      </label>
    </div>

    <div class="flex items-center gap-3 px-2">
      <div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
      <p class="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
        Pastikan nomor WhatsApp aktif untuk menerima kartu ujian
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const localData = ref({ ...props.modelValue })

const pernyataan = [
  "Seluruh data yang saya masukkan adalah benar sesuai dengan dokumen asli yang sah (KK, Ijazah, atau Akta Kelahiran).",
  "Saya memahami bahwa pendaftaran ini merupakan tahap administrasi awal dan akan mengikuti prosedur seleksi sesuai jadwal.",
  "Data yang telah dikirimkan akan disimpan secara aman oleh Panitia Penerimaan Santri Baru untuk kepentingan administrasi sekolah."
]

watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>

<style scoped>
/* Custom checkbox styling untuk kecocokan dark theme */
input[type="checkbox"] {
  appearance: none;
  @apply bg-white/[0.05] border border-white/20 transition-all cursor-pointer;
}

input[type="checkbox"]:checked {
  @apply bg-blue-600 border-blue-400;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>