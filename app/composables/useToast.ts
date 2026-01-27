// app/composables/useToast.ts
type ToastType = 'success' | 'error' | 'info'

interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

// Gunakan ReturnType agar TS otomatis mendeteksi apakah itu number (browser) atau Timer (Node)
let toastTimeout: ReturnType<typeof setTimeout> | null = null

export const useToast = () => {
  const toast = useState<ToastState>('toast', () => ({
    show: false,
    message: '',
    type: 'success'
  }))

  const showToast = (message: string, type: ToastType = 'success', duration: number = 3000) => {
    if (toastTimeout) clearTimeout(toastTimeout)
    
    toast.value = {
      show: true,
      message,
      type
    }

    toastTimeout = setTimeout(() => {
      toast.value.show = false
    }, duration)
  }

  return {
    toast: readonly(toast),
    showToast
  }
}


/**
// Kita definisikan tipe data agar aman dari salah ketik
type ToastType = 'success' | 'error' | 'info'

interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

export const useToast = () => {
  // useState di Nuxt bersifat global secara otomatis
  const toast = useState<ToastState>('toast', () => ({
    show: false,
    message: '',
    type: 'success'
  }))

  const showToast = (message: string, type: ToastType = 'success', duration: number = 3000) => {
    toast.value = {
      show: true,
      message,
      type
    }

    // Auto-hide toast
    setTimeout(() => {
      toast.value.show = false
    }, duration)
  }

  return {
    toast: readonly(toast), // Agar state tidak bisa diubah sembarangan dari luar
    showToast
  }
}
 */