export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    // Kita format data di sini atau biarkan GAS yang memproses 'items'
    const res: any = await $fetch(config.gasUrlBackend, {
      method: 'POST',
      body: {
        action: 'simpanPenempatan',
        payload: body // berisi id_org dan items (keranjang)
      }
    })

    return res
  } catch (error: any) {
    return { success: false, message: 'Gagal menghubungi GAS' }
  }
})