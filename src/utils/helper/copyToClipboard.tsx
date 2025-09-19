// utils/helper/copyToClipboard.ts
import { LangProps } from '@/types/langProps'
import { toast } from 'react-toastify'

export const copyToClipboard = async (text: string, lang?: LangProps) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(lang?.common?.copiedToClipboard)
  } catch (err) {
    toast.error(lang?.common?.failedToCopy)
    console.error('Clipboard copy failed:', err)
  }
}
