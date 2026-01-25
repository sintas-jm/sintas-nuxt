<template>
  <!-- mx-auto membuat kontainer section berada di tengah layar -->
  <!-- p-6 memberikan jarak (padding) di dalam section -->
  <section class="p-6 flex flex-col items-center">
    
    <!-- text-center membuat tulisan rata tengah -->
    <h2 class="text-2xl font-bold text-center">Jejak Langkah</h2>
    <p class="text-gray-400 text-center mt-2">Halaman ini nanti berisi tentang sintas dan log update</p>

    <!-- Implementasi Card dengan w-40 dan h-48 -->
    <!-- justify-center: rata tengah horizontal -->
    <!-- items-center: rata tengah vertikal -->
    <div class="card w-40 h-48 bg-white shadow-lg border rounded-lg mt-6 flex items-center justify-center text-center p-4 text-sm italic text-gray-400">
      Konten form nanti di sini. ditunggu ya...
    </div>
    
  </section>
</template>

<script>
  definePageMeta({ layout: 'linktree' })
</script>

<style scoped>
.card {
  margin-top: 16px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
}
</style>