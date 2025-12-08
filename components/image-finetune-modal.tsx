'use client'

import { IImageHistory } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Sparkles,
  Trash2,
  Check,
  Download,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ImageUploader } from './image-uploader'
import { Label } from './ui/label'

interface ImageFinetuneModalProps {
  isOpen: boolean
  onClose: () => void
  imageHistory: IImageHistory[]
  selectedHistoryId?: string
  referenceImage?: string | null
  onGenerate: (
    baseImage: IImageHistory,
    prompt: string,
    referenceImage: string | null,
  ) => Promise<void>
  onSelect: (historyId: string) => void
  onDelete: (historyId: string) => void
  onReferenceImageChange: (image: string | null) => void
}

export function ImageFinetuneModal({
  isOpen,
  onClose,
  imageHistory,
  selectedHistoryId,
  referenceImage: initialReferenceImage,
  onGenerate,
  onSelect,
  onDelete,
  onReferenceImageChange,
}: ImageFinetuneModalProps) {
  const t = useTranslations('ImageFinetuneModal')
  const [finetunePrompt, setFinetunePrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [referenceImage, setReferenceImage] = useState<string | null>(
    initialReferenceImage || null,
  )
  const [activeImage, setActiveImage] = useState<IImageHistory | null>(
    imageHistory.find((h) => h.id === selectedHistoryId) ||
      imageHistory[0] ||
      null,
  )
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    // When history changes (e.g., after a new image is generated),
    // update the active image to be the latest one in the history.
    if (imageHistory && imageHistory.length > 0) {
      const latestImage = imageHistory[imageHistory.length - 1]
      const currentActive = imageHistory.find((h) => h.id === activeImage?.id)
      // Only update if the active image is no longer in the list or if a new image was added
      if (
        !currentActive ||
        imageHistory.length >
          (activeImage ? imageHistory.indexOf(currentActive) + 1 : 0)
      ) {
        setActiveImage(latestImage)
      }
    }
  }, [imageHistory])

  useEffect(() => {
    setReferenceImage(initialReferenceImage || null)
  }, [initialReferenceImage])

  const handleReferenceImageChange = (image: string | null) => {
    setReferenceImage(image)
    onReferenceImageChange(image)
  }

  const handleGenerate = async () => {
    if (!activeImage || !finetunePrompt.trim()) return
    setIsLoading(true)
    await onGenerate(activeImage, finetunePrompt, referenceImage)
    setFinetunePrompt('')
    setIsLoading(false)
  }

  const handleDeleteClick = (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation()
    if (deletingHistoryId === historyId) {
      // 确认删除
      onDelete(historyId)
      setDeletingHistoryId(null)
    } else {
      // 进入确认状态
      setDeletingHistoryId(historyId)
    }
  }

  const handleDownload = async (
    e: React.MouseEvent,
    imageUrl: string,
    imageName: string,
  ) => {
    e.stopPropagation()
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${imageName}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-7xl md:h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:grid md:grid-cols-5 gap-4 flex-grow overflow-hidden">
          {/* History List */}
          <div className="order-1 md:order-none md:col-span-1 flex flex-col gap-2 min-h-40 md:min-h-0">
            <ScrollArea className="border rounded-md flex-grow">
              <div className="p-2 flex flex-row md:block space-x-2 md:space-x-0 md:space-y-2 whitespace-nowrap md:whitespace-normal">
                {imageHistory
                  .filter((item) => item.imageUrl)
                  .toReversed()
                  .map((historyItem) => {
                    const isSelected = selectedHistoryId === historyItem.id
                    return (
                      <div
                        key={historyItem.id}
                        className={`relative w-36 aspect-square md:w-full flex-shrink-0 group cursor-pointer rounded-md ${
                          activeImage?.id === historyItem.id
                            ? 'ring-2 ring-offset-2 ring-blue-500'
                            : ''
                        }`}
                        onClick={() => setActiveImage(historyItem)}
                        onMouseLeave={() => setDeletingHistoryId(null)}
                      >
                        <Image
                          src={historyItem.imageUrl}
                          alt={`History ${historyItem.id}`}
                          fill
                          className="rounded-md object-cover"
                        />
                        <div className="absolute top-1 left-1 right-1 z-10 flex justify-between">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 bg-black/50 hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) =>
                              handleDownload(
                                e,
                                historyItem.imageUrl,
                                `history-${historyItem.id}`,
                              )
                            }
                          >
                            <Download className="h-4 w-4 text-white" />
                          </Button>
                          <div className="flex gap-1">
                            {deletingHistoryId === historyItem.id ? (
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) =>
                                  handleDeleteClick(e, historyItem.id)
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) =>
                                  handleDeleteClick(e, historyItem.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="default"
                              className={`h-7 w-7 transition-opacity ${
                                isSelected
                                  ? 'opacity-100 bg-green-500 text-white hover:bg-green-600'
                                  : 'opacity-0 group-hover:opacity-100'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelect(historyItem.id)
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Collapsible defaultOpen={false} className="space-y-1.5 md:hidden">
              <CollapsibleTrigger className="w-full flex items-center justify-between">
                <Label htmlFor="reference-image">{t('referenceImage')}</Label>
                <ChevronRight className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ImageUploader
                  image={referenceImage}
                  setImage={handleReferenceImageChange}
                />
              </CollapsibleContent>
            </Collapsible>
            <div className="space-y-1.5 hidden md:block">
              <Label htmlFor="reference-image">{t('referenceImage')}</Label>
              <ImageUploader
                image={referenceImage}
                setImage={handleReferenceImageChange}
              />
            </div>
          </div>

          {/* Main View */}
          <div className="order-2 md:order-none md:col-span-4 flex flex-col gap-4 min-h-0 flex-grow">
            <div className="flex-grow relative border rounded-md flex items-center justify-center bg-muted/20">
              {activeImage && activeImage.imageUrl ? (
                <Image
                  src={activeImage.imageUrl}
                  alt="Active"
                  fill
                  className="object-contain"
                />
              ) : (
                <p>{t('noImageSelected')}</p>
              )}
            </div>
            <Textarea
              value={finetunePrompt}
              onChange={(e) => setFinetunePrompt(e.target.value)}
              placeholder={t('promptPlaceholder')}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {t('close')}
              </Button>
            </DialogClose>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !activeImage}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('generating')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('generate')}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
