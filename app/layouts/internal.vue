<script setup>
const logout = () => {
  // Ambil cookie auth_pin
  const authCookie = useCookie('auth_pin')
  
  // Hapus isi cookie (set jadi null)
  authCookie.value = null
  
  // Tendang balik ke halaman login atau portal publik
  navigateTo('/login')
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

        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="hidden md:block text-[10px] tracking-widest text-slate-400 hover:text-orange-400 uppercase transition-colors">
            Portal Publik
          </NuxtLink>
          
          <button @click="logout" 
            class="flex items-center gap-2 px-4 py-2 border border-red-900/30 rounded-full bg-red-950/10 text-red-400 hover:bg-red-900/20 hover:border-red-500/50 transition-all duration-300">
            <span class="text-[10px] font-bold tracking-widest uppercase">Keluar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
.glass-card-admin {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(249, 115, 22, 0.1);
}

.btn-hover-admin:hover {
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.4);
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.15);
  transform: translateY(-2px);
}
</style>
