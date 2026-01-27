// app/plugins/click-outside.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el, binding) {
      // 1. Logika Klik Luar
      el.clickOutsideEvent = (event: Event) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event);
        }
      };

      // 2. Logika Tombol ESC
      el.escKeyEvent = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          binding.value(event);
        }
      };

      document.addEventListener('mousedown', el.clickOutsideEvent); // Gunakan mousedown agar lebih responsif
      document.addEventListener('keydown', el.escKeyEvent);
    },
    unmounted(el) {
      document.removeEventListener('mousedown', el.clickOutsideEvent);
      document.removeEventListener('keydown', el.escKeyEvent);
    },
  });
});

/** sudah dipakai di :
      - penempatan.vue
 */