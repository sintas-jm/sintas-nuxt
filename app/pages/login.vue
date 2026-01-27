<script setup>
definePageMeta({ layout: 'linktree' })

const passwordInput = ref('')
const isError = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

// 1. Definisikan Cookie untuk Auth
const authCookie = useCookie('auth_pin', {
  maxAge: 60 * 60 * 24, // Berlaku 24 Jam
  path: '/',           // Wajib agar bisa dibaca di folder /internal
  sameSite: 'lax'
})

const handleLogin = async () => {
  if (!passwordInput.value || isLoading.value) return
  
  isLoading.value = true
  isError.value = false

  try {
    const data = await $fetch('/api/auth', {
      method: 'POST',
      body: { password: passwordInput.value }
    })

    if (data.success) {
      // 2. Simpan password (atau token dari server jika ada) ke cookie
      authCookie.value = passwordInput.value
      
      // 3. Gunakan navigateTo agar lebih "Nuxt"
      await navigateTo('/internal')
    }
  } catch (err) {
    isError.value = true
    errorMsg.value = err.data?.message || 'Akses Ditolak'
    passwordInput.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 px-6">
    <div class="glass-card p-10 rounded-[2rem] border-orange-500/20 text-center">
      <div class="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
        <span class="text-4xl">🔑</span>
      </div>
      
      <h1 class="text-2xl font-bold text-white mb-2 tracking-tight">Staff Access</h1>
      <p class="text-slate-400 text-xs mb-10 tracking-[0.2em] uppercase">Sintas Security System</p>
      
      <div class="space-y-6">
        <input 
          v-model="passwordInput" 
          type="password"
          @keyup.enter="handleLogin"
          :disabled="isLoading"
          placeholder="Masukkan Password"
          class="w-full bg-black/40 border border-orange-900/40 rounded-2xl p-4 text-center text-xl tracking-[0.5em] focus:border-orange-500 outline-none transition-all placeholder:text-[10px] placeholder:tracking-widest"
        />

        <p v-if="isError" class="text-red-400 text-[10px] uppercase tracking-widest animate-shake">
          ⚠️ {{ errorMsg }}
        </p>
        
        <button @click="handleLogin" :disabled="isLoading"
          class="w-full bg-gradient-to-r from-orange-600/60 to-orange-400/60 hover:from-orange-800/70 hover:to-orange-500/70 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-950/40 hover:scale-95 hover:text-slate-200/90 disabled:opacity-50">
          {{ isLoading ? 'Memproses...' : 'Verifikasi Akses' }}
        </button>
      </div>
      
    </div>
    <div>
      <NuxtLink to="/" class="w-full flex items-center justify-center gap-2 py-6 text-[11px] text-slate-400 hover:text-orange-400 transition-all uppercase tracking-widest">
      ← Kembali
      </NuxtLink>
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