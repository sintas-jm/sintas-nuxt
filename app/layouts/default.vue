<template>
  <div class="h-screen flex flex-col font-sans bg-bgGrey overflow-hidden">

    <header class="flex-none h-12 md:h-14 bg-primary z-[1000] shadow-sm overflow-y-scroll scrollbar-hide">
      <div class="max-w-1440 mx-auto px-4 md:px-6 h-full flex items-center justify-between text-white">
        <span class="font-semibold text-lg tracking-tight uppercase">Sintas</span>
        <nav class="flex gap-4">
          <NuxtLink to="/pendaftaran" class="text-sm text-gray-400 hover:text-white transition-colors [&.router-link-active]:text-white">Pendaftaran</NuxtLink>
          <NuxtLink to="/presensi" class="text-sm text-gray-400 hover:text-white transition-colors [&.router-link-active]:text-white">Presensi</NuxtLink>
          <NuxtLink to="/informasi" class="text-sm text-gray-400 hover:text-white transition-colors [&.router-link-active]:text-white">Informasi</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="flex-1 overflow-y-scroll">
      <div class="max-w-1440 mx-auto px-4 md:px-6 py-6 min-h-full flex flex-col">
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </main>

    <footer class="py-1 text-[12px] text-muted text-center bg-white border-t border-borderGrey">
      <div class="max-w-1440 mx-auto">
        <small>dev: Tim Sintas Al-Matlab | © 2026</small>
      </div>
    </footer>

  </div>
</template>

<style>
/* 1. Impor Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* 2. Reset Global */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* 3. Custom Scrollbar Logic */
.scrollbar-hide::-webkit-scrollbar {
  width: 8px;
}
.scrollbar-hide::-webkit-scrollbar-thumb {
  background: transparent;
}

main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-track {
  background: #f1f1f1;
}
main::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
main::-webkit-scrollbar-thumb:hover {
  background: #1B211A;
}
</style>