export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const data = await $fetch(`${config.gasUrlBackend}?action=getPiketImam`)
  return data
})