'use client'

import { useCallback, useState } from 'react'
import { useDropzone, FileRejection, Accept } from 'react-dropzone'
import { toast } from 'sonner'
import { Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { Button } from './ui/button'
import { useStudio } from './studio-context'

interface ImageUploaderProps {
  image: string | null
  setImage: (base64: string | null) => void
  className?: string
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function ImageUploader({
  image,
  setImage,
  className,
}: ImageUploaderProps) {
  const t = useTranslations('ImageUploader')
  const [isLoading, setIsLoading] = useState(false)
  const { isUserUploadingRef } = useStudio()

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        toast.error(t('fileRejected'))
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setIsLoading(true)
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: false, // Disable web worker to prevent file reference issues on mobile
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          const base64 = await fileToBase64(compressedFile)
          if (isUserUploadingRef) {
            isUserUploadingRef.current = true
          }
          setImage(base64)
          toast.success(t('imageUploaded'))
        } catch (error: any) {
          let errorMessage: string
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (error?.target?.error) {
            errorMessage = error.target.error.message || 'FileReader error'
          } else {
            errorMessage = String(error)
          }

          console.error('Image compression error:', error)

          if (error instanceof Error && error.name === 'AbortError') {
            toast.error(
              `Image compression timed out. Please try a smaller file.`,
            )
          } else {
            toast.error(t('compressionFailed'), {
              description: errorMessage,
            })
          }
        } finally {
          setIsLoading(false)
        }
      }
    },
    [t, setImage, isUserUploadingRef],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] } as Accept,
    multiple: false,
  })

  const handleRemoveImage = () => {
    setImage(null)
  }

  return (
    <div className={className}>
      {image ? (
        <div className="relative group w-full rounded-lg overflow-hidden border">
          <Image
            src={image}
            alt="Uploaded preview"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-contain"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full h-36 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-gray-500">{t('compressing')}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {isDragActive ? t('dropHere') : t('dragOrClick')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
