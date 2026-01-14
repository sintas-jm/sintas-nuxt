<template>
  <div class="py-4">
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div class="flex items-center gap-3">
        <span class="text-2xl">📝</span>
        <h3 class="font-bold text-blue-800 uppercase text-sm tracking-wide">Pernyataan Kebenaran Data</h3>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-gray-50 border border-gray-200 p-6 rounded-xl">
        <p class="text-sm text-gray-700 leading-relaxed mb-6">
          Dengan menekan tombol <strong>"Kirim Pendaftaran"</strong>, saya selaku orang tua/wali calon santri menyatakan bahwa:
        </p>
        
        <ul class="space-y-3">
          <li v-for="(point, i) in pernyataan" :key="i" class="flex gap-3 text-xs text-gray-600">
            <span class="text-primary font-bold">{{ i + 1 }}.</span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>

      <label class="flex items-start gap-3 p-4 bg-white border-2 border-primary/10 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
        <input 
          type="checkbox" 
          v-model="localData.is_setuju" 
          class="mt-1 w-5 h-5 accent-primary rounded"
        >
        <span class="text-sm font-medium text-gray-800">
          Saya menjamin kebenaran data yang telah diisi dan bersedia menerima sanksi jika di kemudian hari ditemukan pemalsuan data.
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const localData = ref({ ...props.modelValue })

const pernyataan = [
  "Seluruh data yang saya masukkan adalah benar sesuai dengan dokumen asli (KK/Ijazah/Akte).",
  "Saya memahami bahwa pendaftaran ini adalah tahap awal dan akan mengikuti proses seleksi selanjutnya.",
  "Data yang sudah dikirimkan akan menjadi milik panitia PSB dan akan dijaga kerahasiaannya."
]

watch(localData, (newVal) => emit('update:modelValue', newVal), { deep: true })
</script>