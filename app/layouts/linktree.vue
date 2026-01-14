<template>
  <div class="linktree-layout min-h-screen overflow-x-hidden">
    <slot />
  </div>
</template>

<style>
.linktree-layout {
  /* Pindahkan style gradient ke sini agar tidak merusak halaman lain */
  background: radial-gradient(circle at top right, #5e4406 0%, #0f172a 40%, #020617 100%);
  background-attachment: fixed;
  color: #e2e8f0; /* text-slate-200 */
  font-family: 'Montserrat', sans-serif;
}

/* Glass card & Hover efek khusus Linktree */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-hover:hover {
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.4);
  transform: translateY(-2px);
}
</style>