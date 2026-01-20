// app/composables/useActionLoading.ts
export const useActionLoading = () => {
  const dataLoading = useState('global_data_loading')
  const loadingText = useState('global_loading_text')

  const startAction = (text = 'Sedang Menyimpan...') => {
    loadingText.value = text
    dataLoading.value = true
  }

  const stopAction = () => {
    dataLoading.value = false
  }

  return { startAction, stopAction }
}