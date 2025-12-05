'use client'

import { useCallback, useState } from 'react'
import { useDropzone, FileRejection, Accept } from 'react-dropzone'
import { toast } from 'sonner'
import { Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { Button } from './ui/button'
import { useManga } from './manga-context'

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
  const { isUserUploadingRef } = useManga()

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
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 512,
            useWebWorker: true,
          })
          const base64 = await fileToBase64(compressedFile)
          if (isUserUploadingRef) {
            isUserUploadingRef.current = true
          }
          setImage(base64)
          toast.success(t('imageUploaded'))
        } catch (error) {
          toast.error(t('compressionFailed'))
        } finally {
          setIsLoading(false)
        }
      }
    },
    [t, setImage],
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
        <div className="relative group w-full h-36 rounded-lg overflow-hidden border">
          <Image
            src={image}
            alt="Uploaded preview"
            fill
            className="object-cover"
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
