<script setup>
definePageMeta({ layout: 'internal' })

const pinInput = ref('')
const isError = ref(false)
const isLoading = ref(false)
const authCookie = useCookie('auth_pin', { maxAge: 60 * 60 * 12 }) // Login bertahan 12 jam

const handleLogin = async () => {
  if (!pinInput.value) return
  isLoading.value = true
  isError.value = false

  try {
    const data = await $fetch('/api/auth', {
      method: 'POST',
      body: { pin: pinInput.value }
    })

    if (data.success) {
      authCookie.value = pinInput.value
      navigateTo('/internal')
    }
  } catch (err) {
    isError.value = true
    pinInput.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 px-6">
    <div class="glass-card-admin p-10 rounded-[2rem] border-orange-500/20 text-center">
      <div class="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
        <span class="text-4xl">🔑</span>
      </div>
      
      <h1 class="text-2xl font-bold text-white mb-2 tracking-tight">Staff Access</h1>
      <p class="text-slate-400 text-xs mb-10 tracking-[0.2em] uppercase">Sintas Security System</p>
      
      <div class="space-y-6">
        <input v-model="pinInput" type="password" placeholder="Masukkan PIN" 
          class="w-full bg-black/40 border border-orange-900/40 rounded-2xl p-4 text-center text-xl tracking-[0.5em] focus:border-orange-500 outline-none transition-all placeholder:text-[10px] placeholder:tracking-widest"
          @keyup.enter="handleLogin" :disabled="isLoading">
        
        <div v-if="isError" class="text-red-400 text-[10px] uppercase tracking-widest animate-shake">
          ⚠️ PIN tidak sesuai
        </div>
        
        <button @click="handleLogin" :disabled="isLoading"
          class="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-950/40 disabled:opacity-50">
          {{ isLoading ? 'MENGECEK...' : 'MASUK' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-shake { animation: shake 0.4s linear; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>