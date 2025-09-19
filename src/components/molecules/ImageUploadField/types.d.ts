export interface ImageUploadFieldProps {
  label: string
  required?: boolean
  onImageUploaded: (filename: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  placeholder?: string
}
