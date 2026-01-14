<template>
  <div class="internal-layout min-h-screen">
    <nav class="border-b border-orange-900/30 bg-black/5 backdrop-blur-md sticky top-0 z-50">
      <div class="w-full px-8 py-4 flex justify-between items-center">
        <NuxtLink to="/1" class="flex items-center gap-3 group">
          <div class="w-8 h-8 bg-orange-500/70 rounded-lg flex items-center justify-center font-bold text-black transform group-hover:rotate-12 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            S
          </div>
          <span class="text-sm font-bold tracking-[0.3em] uppercase text-orange-200">Sintas</span>
        </NuxtLink>
        <NuxtLink to="/" class="text-[10px] tracking-widest text-slate-400 hover:text-orange-400 uppercase transition-colors px-4 py-2 border border-orange-900/30 rounded-full hover:bg-orange-950/30">
          ← Portal Publik
        </NuxtLink>
      </div>
    </nav>

    <main class="w-full px-8 py-10">
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


<!--
<template>
  <div class="internal-layout min-h-screen">
    <nav class="border-b border-admin-border/50 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div class="w-full px-8 py-4 flex justify-between items-center">
        <NuxtLink to="/1" class="flex items-center gap-3 group">
          <div class="w-8 h-8 bg-admin-glow rounded-lg flex items-center justify-center font-bold text-admin-dark transform group-hover:rotate-12 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            S
          </div>
          <span class="text-sm font-bold tracking-[0.3em] uppercase text-emerald-100">Sintas Admin</span>
        </NuxtLink>
        <NuxtLink to="/" class="text-[10px] tracking-widest text-emerald-500/60 hover:text-admin-glow uppercase transition-colors px-4 py-2 border border-emerald-900/30 rounded-full hover:bg-emerald-950/30">
          ← Portal Publik
        </NuxtLink>
      </div>
    </nav>

    <main class="w-full px-8 py-10">
      <slot />
    </main>

    <footer class="py-10 text-center opacity-20">
      <p class="text-[10px] tracking-[0.4em] uppercase text-emerald-500">Sintas Staff System • 2026</p>
    </footer>
  </div>
</template>

<style>
.internal-layout {
  /* Gradasi hijau gelap yang kalem dan profesional */
  background: linear-gradient(190deg, #010804 30%, #010a05 60%, #032419 100%);
  /* background: linear-gradient(190deg, #020617 20%, #0f172a 60%, #43300b 100%); */
  background-attachment: fixed;
  color: #ecfdf5; /* emerald-50 */
  font-family: 'Montserrat', sans-serif;
}

.glass-card-admin {
  background: rgba(5, 33, 18, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.btn-hover-admin:hover {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.4);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.1);
}
</style>
-->

<!--  ORANGE BLUE
<template>
  <div class="internal-layout min-h-screen">
    <nav class="border-b border-orange-900/30 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <NuxtLink to="/1" class="flex items-center gap-2 group">
          <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-black transform group-hover:rotate-12 transition-transform">
            S
          </div>
          <span class="text-sm font-bold tracking-[0.2em] uppercase text-orange-200">Sintas Admin</span>
        </NuxtLink>
        <NuxtLink to="/" class="text-[10px] tracking-widest text-slate-400 hover:text-orange-400 uppercase transition-colors">
          ← Lihat Web Publik
        </NuxtLink>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-6 py-10">
      <slot />
    </main>

    <footer class="py-10 text-center opacity-30">
      <p class="text-[10px] tracking-[0.3em] uppercase text-slate-500">Internal Dashboard v1.0</p>
    </footer>
  </div>
</template>

<style>
.internal-layout {
  background: linear-gradient(190deg, #020617 20%, #0f172a 60%, #43300b 100%);
  background-attachment: fixed;
  color: #e2e8f0;
  font-family: 'Montserrat', sans-serif;
}

/* Scrollbar agar tetap elegan */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #43300b;
  border-radius: 10px;
}
</style>
-->