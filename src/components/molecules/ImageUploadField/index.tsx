'use client'

import { Eye, Image as ImageIcon, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useMutationQuery } from '@/@core/hooks/use-query'
import { LangProps } from '@/types/langProps'
import { useImageUpload } from '@/utils/api/internal/uploadImageByClient'

interface ImageUploadFieldProps {
  label: string
  value?: string // ✅ controlled value (filename)
  onChange?: (value: string) => void // ✅ react-hook-form change handler
  required?: boolean
  onImageUploaded: (filename: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  placeholder?: string
  lang?: LangProps
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  required = false,
  onImageUploaded,
  onError,
  accept = '.jpeg,.jpg,.png,.bmp',
  maxSize = 5, // 5MB default
  className = '',
  placeholder = 'Click to upload image',
  lang
}: ImageUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    mutateAsync: uploadImage,
    isPending,
    isError
  } = useMutationQuery<any, any>(
    ['uploadImage'],
    'post',
    'formdata',
    true,
    lang?.register?.uploadSuccess || 'Image uploaded successfully'
  )

  // const { mutateAsync: uploadImage, isPending } = useImageUpload({
  //   key: ['uploadImage'],
  //   isShowMsg: true,
  //   successMessage: lang?.register?.uploadSuccess || 'Image uploaded successfully'
  // })

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      const errorMsg = `${lang?.register?.fileSizeMsg} ${maxSize}MB`
      // toast.error(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Validate file type
    const validTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!validTypes.includes(fileExtension)) {
      const errorMsg = lang?.register?.invalidFileType
      // toast.error(errorMsg)
      onError?.(errorMsg)
      return
    }

    setSelectedFile(file)

    // Create preview URL
    // const url = URL.createObjectURL(file)
    // setPreviewUrl(url)

    // Auto upload the image
    await uploadImageToAPI(file)
  }

  const uploadImageToAPI = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      // formData.forEach((value, key) => {
      //   console.log(`[FormData] ${key}:`, value)
      // })

      const response = await uploadImage({
        url: '/uploadImage',
        body: formData
      })

      // const response = await uploadImage({ formData })

      if (response?.data?.filename) {
        const filename = response.data.filename
        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        onChange?.(filename) // ✅ set react-hook-form value
        onImageUploaded?.(filename)
      } else {
        const errorMsg = lang?.register?.uploadFailed
        // toast.error(errorMsg)
        onError?.(errorMsg)
        setSelectedFile(null)
        onChange?.('')
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        onImageUploaded('')
      }
    } catch (error) {
      const errorMsg = lang?.register?.uploadFailed
      // toast.error(errorMsg)
      onError?.(errorMsg)
      setSelectedFile(null)
      onChange?.('')
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onImageUploaded('')
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    onChange?.('')
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageUploaded('') // Clear the filename
    toast.info(lang?.register?.fileRemoved || 'File removed successfully')
  }

  const handleViewImage = () => {
    if (previewUrl || value) {
      setIsModalOpen(true)
    }
  }

  return (
    <div className={className}>
      <label className='text-app-text-color font-medium mb-2 block'>
        {label}
        {required && <span className='text-app-danger'>*</span>}
      </label>

      <div className='border-2 rounded-lg p-4 text-center bg-app-background-primary border-app-neutral300 transition-colors overflow-hidden'>
        {!isPending && (selectedFile || value) ? (
          <div className='space-y-3'>
            <ImageIcon className='mx-auto h-8 w-8 text-app-primary' />
            <p className='text-app-text-color text-sm mb-2'>
              {value ? lang?.register?.imageUploaded : lang?.register?.imageSelected}
            </p>

            {/* Clickable filename to view image */}

            <button
              className='text-app-primary text-sm font-medium hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto'
              type='button'
              onClick={handleViewImage}
            >
              <Eye className='h-4 w-4' />
              {/* {uploadedFilename || selectedFile?.name} */}
              {lang?.register?.viewImage || 'View Image'}
            </button>

            <Button
              className='mt-2 bg-app-background-primary border-app-neutral500 text-app-text-color hover:bg-app-neutral300'
              disabled={isPending}
              size='sm'
              type='button'
              variant='outline'
              onClick={handleRemoveFile}
            >
              {lang?.register?.remove}
            </Button>
          </div>
        ) : (
          <div className='space-y-2'>
            <Upload className='mx-auto h-8 w-8 text-app-text-color mb-2' />
            <>
              <p className='text-app-text-color text-sm mb-2 uppercase'>
                {placeholder} ({accept})
              </p>
              <p className='text-app-neutral500 text-xs mb-2'>
                {lang?.common?.max} {maxSize}MB
              </p>
            </>

            <Button
              className='mt-2 bg-app-background-primary border-app-neutral500 text-app-text-color hover:bg-app-neutral300'
              size='sm'
              type='button'
              variant='outline'
              disabled={isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {isPending ? (
                <p className='text-app-text-color text-xs'>{lang?.register?.uploading}...</p>
              ) : (
                lang?.register?.chooseFile
              )}
            </Button>
          </div>
        )}
      </div>

      <input ref={fileInputRef} accept={accept} className='hidden' type='file' onChange={handleFileSelect} />

      {/* Image Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='bg-app-background-primary border border-app-neutral300 max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-app-text-color'>
              {lang?.common?.imagePreview}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {(previewUrl || value) && (
              <div className='relative aspect-video bg-app-background-secondary rounded overflow-hidden'>
                {previewUrl ? (
                  <Image
                    fill
                    unoptimized // For blob URLs
                    alt='Preview Url Image'
                    className='object-contain'
                    src={previewUrl}
                  />
                ) : (
                  <Image
                    fill
                    alt='Preview Image'
                    className='object-contain'
                    src={`/api/images/${value}`} // Adjust this path based on your image serving setup
                  />
                )}
              </div>
            )}

            <div className='flex justify-end'>
              <Button
                className='border-app-neutral500 bg-app-background-primary text-app-text-color hover:bg-app-neutral300'
                type='button'
                variant='outline'
                onClick={() => setIsModalOpen(false)}
              >
                {lang?.common?.close || 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
