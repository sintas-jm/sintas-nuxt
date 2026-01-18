<template>
  <Transition
    enter-active-class="transform transition duration-300 ease-out"
    enter-from-class="translate-y-10 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="toast.show" 
      class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[999] min-w-[300px]">
      <div :class="[
        'px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-4',
        toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 
        toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 
        'bg-blue-500/10 border-blue-500/50 text-blue-400'
      ]">
        <span class="text-xl">
          <i v-if="toast.type === 'success'" class="i-heroicons-check-circle-20-solid">✓</i>
          <i v-else-if="toast.type === 'error'" class="i-heroicons-x-circle-20-solid">✕</i>
          <i v-else class="i-heroicons-information-circle-20-solid">ℹ</i>
        </span>
        
        <p class="text-sm font-bold tracking-wide uppercase">{{ toast.message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Nuxt otomatis meng-import useToast, jadi tinggal panggil
const { toast } = useToast()
</script>