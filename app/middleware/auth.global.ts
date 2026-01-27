export default defineNuxtRouteMiddleware((to) => {
  // 1. Ambil cookie auth
  const authCookie = useCookie('auth_pin')

  // 2. Jika user mencoba masuk ke area internal tapi cookie kosong
  if (to.path.startsWith('/internal') && !authCookie.value) {
    return navigateTo('/login')
  }

  // 3. Jika user sudah login (punya cookie) tapi malah buka halaman login
  if (to.path === '/login' && authCookie.value) {
    return navigateTo('/internal')
  }
})