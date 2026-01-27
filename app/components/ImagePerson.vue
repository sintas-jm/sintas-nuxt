<script setup lang="ts">
const props = defineProps<{
  fotoId: any
  alt?: string
  // Tambahkan prop class khusus jika ingin mengubah styling ikon dari luar
  iconClass?: string 
}>()

const isError = ref(false)
watch(() => props.fotoId, () => { isError.value = false })  // Pantau jika fotoId berubah (misal saat ganti kategori), reset status error

const finalUrl = computed(() => {
  if (isError.value) return ""
  return formatFotoUrl(props.fotoId)  // Memakai utils
})
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
    <img 
      v-if="finalUrl"
      :src="finalUrl"
      :alt="alt || 'Foto'"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      @error="isError = true"
    />

    <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-4 text-center">
      <svg :class="iconClass || 'w-10 h-10'" class="mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      
      <span class="text-[10px] font-black uppercase tracking-widest opacity-40">
        {{ isError ? 'Gagal Memuat' : 'Foto Belum Ada' }}
      </span>

      <slot name="footer" />  <!--<slot /> agar bagian bawah ikon bisa diisi teks apa saja secara dinamis.-->
    </div>
  </div>
</template>


<!-- CARA PAKAI 

## Cara Pakai di Halaman Penempatan (Ukuran Kecil). 
  Ukuran dikontrol oleh div pembungkusnya (misal w-full aspect-square).

  <div class="aspect-square rounded-xl overflow-hidden mb-3 bg-white/5 relative border border-white/5">
    <ImagePerson :foto-id="p.foto_profil" />
  </div>

## Cara Pakai di Halaman Edit (Ukuran Khusus + Teks Tambahan)
  <div 
    @click="triggerUpload"
    class="relative w-52 h-64 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl group cursor-pointer bg-slate-800/50"
  >
    <ImagePerson :foto-id="imageUrl" icon-class="w-12 h-12">
      <template #footer>
        <span class="text-[9px] mt-1 text-orange-400/60 font-bold uppercase">Klik Untuk Unggah</span>
      </template>
    </ImagePerson>
  </div>
-->