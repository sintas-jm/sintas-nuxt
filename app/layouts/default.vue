<script setup>
// Kita tetap siapkan logika auth jika sewaktu-waktu ingin menampilkan status login di portal publik
const authCookie = useCookie('auth_pin')

const logout = () => {
  authCookie.value = null
  navigateTo('/')
}
</script>

<template>
<!--Tema Glassmorphism dan Dark Mode-->
  <div class="default-layout min-h-screen">
    <nav class="border-b border-orange-900/30 bg-black/5 backdrop-blur-md sticky top-0 z-50">
      <div class="w-full px-4 md:px-8 py-4 flex justify-between items-center">
        
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 bg-orange-500/70 rounded-lg flex items-center justify-center font-bold text-black transform group-hover:rotate-12 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            S
          </div>
          <span class="text-sm font-bold tracking-[0.3em] uppercase text-orange-200">Sintas</span>
        </NuxtLink>

        <div class="flex items-center gap-2 md:gap-4">
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink to="/publik/psb" class="nav-item">Pendaftaran</NuxtLink>
            <NuxtLink to="/publik/informasi" class="nav-item">Presensi</NuxtLink>
            <NuxtLink to="/publik/informasi" class="nav-item">Informasi</NuxtLink>
          </nav>

          <div class="w-px h-4 bg-orange-900/30 hidden md:block mx-2"></div>

          <NuxtLink to="/internal" 
            class="flex glass-card btn-hover items-center gap-2 text-[10px] px-3 py-2 rounded-lg md:rounded-full tracking-widest text-slate-400 hover:text-orange-400 uppercase transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span class="hidden md:inline">Internal</span>
          </NuxtLink>
          
          <button v-if="authCookie" @click="logout" 
            class="flex items-center gap-2 px-3 py-2 border border-red-900/50 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main class="w-full p-4 md:px-8 md:py-6">
      <slot />
    </main>

    <footer class="py-16 text-center opacity-30">
      <p class="text-[10px] tracking-[0.5em] uppercase text-slate-200">Sintas Ecosystem • 2026</p>
    </footer>
  </div>
</template>

<style>
/* Load Font Montserrat agar persis Internal */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap');

.default-layout {
  background: linear-gradient(174deg, #020617 20%, #0f172a 60%, #291c03 100%);
  background-attachment: fixed;
  color: #f8fafc;
  font-family: 'Montserrat', sans-serif;
}

.nav-item {
  @apply text-[11px] px-4 py-2 text-slate-400 hover:text-orange-300 tracking-widest uppercase transition-all;
}

.nav-item.router-link-active {
  @apply text-orange-400 font-bold;
}

/* Glass card & Hover Effect dari Internal */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(249, 115, 22, 0.1);
}

.btn-head {
  @apply px-3 py-2 text-[10px] uppercase tracking-widest text-slate-100 border border-white/5 rounded-full transition-all duration-300;
  &:hover {
    @apply text-orange-400 
           bg-orange-500/10 
           border-orange-500/40 
           shadow-[0_0_30px_rgba(249,115,22,0.15)] 
           -translate-y-0.5;
  }
}

.btn-body {
  @apply  p-3 md:p-4 rounded-xl duration-500 relative overflow-hidden block border border-white/5 transition-all;
  &:hover {
    @apply bg-orange-500/10 
           border-orange-500/40 
           shadow-[0_0_30px_rgba(249,115,22,0.15)] 
           -translate-y-0.5;
  }
}

.emoji-btn {
  @apply shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform duration-500
}

.btn-hover:hover {
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.4);
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.15);
  transform: translateY(-2px);
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(10px);
}

.page-heading-1 {
  @apply text-orange-400/80 text-[11px] font-bold uppercase tracking-[0.3em]
}
</style>