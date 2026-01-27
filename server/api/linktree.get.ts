export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Memanggil GAS dengan parameter action
  const data = await $fetch(`${config.gasUrlBackend}?action=getLinktree`)
  return data
})

// setting halaman utama linktree