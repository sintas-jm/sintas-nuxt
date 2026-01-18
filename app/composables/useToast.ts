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