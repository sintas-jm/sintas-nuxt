<script setup>
const nuxtApp = useNuxtApp()
const loading = ref(false)

// Hook Nuxt untuk mendeteksi navigasi
nuxtApp.hook('page:start', () => { loading.value = true })
nuxtApp.hook('page:finish', () => { loading.value = false })
</script>

<template>
  <Transition name="fade">
    <div v-if="loading" class="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="mt-4 text-[10px] tracking-[0.5em] uppercase text-orange-200 animate-pulse">
        Mohon Tunggu Sebentar...
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>