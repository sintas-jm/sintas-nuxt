<script setup>
const authCookie = useCookie('auth_pin')  // Ambil cookie auth_pin

// tombol logout muncul jika user sudah login
const logout = () => {
  authCookie.value = null  // Hapus isi cookie (set jadi null)
  navigateTo('/')  // Tendang balik ke halaman login atau portal publik
}
</script>

<template>
  <div class="internal-layout min-h-screen">
    <nav class="border-b border-orange-900/30 bg-black/5 backdrop-blur-md sticky top-0 z-50">
      <div class="w-full px-4 md:px-8 py-4 flex justify-between items-center">
        <NuxtLink to="/internal" class="flex items-center gap-3 group">
          <div class="w-8 h-8 bg-orange-500/70 rounded-lg flex items-center justify-center font-bold text-black transform group-hover:rotate-12 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            S
          </div>
          <span class="text-sm font-bold tracking-[0.3em] uppercase text-orange-200">Sintas</span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <NuxtLink to="/" 
            class="flex glass-card btn-hover items-center gap-2 text-[10px] px-3 py-2 rounded-lg md:rounded-full tracking-widest text-slate-400 hover:text-orange-400 uppercase transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="hidden md:inline">Portal Publik</span>
          </NuxtLink>
          
          <button v-if="authCookie" @click="logout" 
            class="flex items-center gap-2 px-3 md:px-4 py-2 border border-red-900/50 rounded-lg md:rounded-full bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
            <span class="text-[10px] font-bold tracking-widest uppercase hidden md:inline">Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main class="w-full px-4 md:px-8 py-6">
      <slot />
    </main>

    <footer class="py-10 text-center opacity-40">
      <p class="text-[10px] tracking-[0.4em] uppercase text-slate-200">Sintas Staff System • 2026</p>
    </footer>
  </div>
</template>


<style>
.internal-layout {
  /* Kembali ke gairah Orange-Gold yang elegan */
  background: linear-gradient(174deg, #020617 20%, #0f172a 60%, #43300b 100%);
  /* background: linear-gradient(190deg, #020617 20%, #0f172a 60%, #43300b 100%); */
  background-attachment: fixed;
  color: #f8fafc;
  font-family: 'Montserrat', sans-serif;
}

/* Glass card dengan aksen Orange */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(249, 115, 22, 0.1);
}

.btn-hover:hover {
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.4);
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.15);
  transform: translateY(-2px);
}

/* transisi pindah halaman */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(5px);
}
</style>
