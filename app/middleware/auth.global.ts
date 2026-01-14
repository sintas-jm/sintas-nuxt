// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const pinCookie = useCookie('auth_pin')

  // Jika mencoba masuk ke folder /internal tapi tidak punya cookie PIN
  if (to.path.startsWith('/internal') && !pinCookie.value) {
    return navigateTo('/login')
  }
})