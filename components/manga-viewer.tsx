'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { useManga } from './manga-context'
import { IMangaPage, IImageHistory } from '@/types'
import { ImageFinetuneModal } from './image-finetune-modal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Download,
  Archive,
  ChevronLeft,
  ChevronRight,
  Edit,
} from 'lucide-react'
import { toast } from 'sonner'
import JSZip from 'jszip'

export function MangaViewer() {
  const t = useTranslations('MangaViewer')
  const {
    pages,
    setPages,
    currentPage,
    setCurrentPage,
    totalPage,
    imageModel,
  } = useManga()
  const locale = useLocale()
  const [isFinetuneModalOpen, setIsFinetuneModalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<IMangaPage | null>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } else if (e.key === 'ArrowRight') {
        const nextPage = pages.find((p) => p.pageNumber === currentPage + 1)
        if (currentPage < totalPage && nextPage?.isGenerated) {
          setCurrentPage(currentPage + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentPage, totalPage, pages, setCurrentPage])

  const handleDownloadCurrentPage = () => {
    const currentPageData = pages.find((p) => p.pageNumber === currentPage)
    const imageUrl =
      currentPageData?.finalImageUrl || currentPageData?.panels[0]?.imageUrl
    if (currentPageData && imageUrl) {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `page-${currentPageData.pageNumber}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDownloadAllPages = async () => {
    const zip = new JSZip()
    const generatedPages = pages.filter((p) => p.isGenerated)

    if (generatedPages.length === 0) {
      toast.error(t('noPagesToDownload'))
      return
    }

    toast.info(t('packagingInProgress'))

    for (const page of generatedPages) {
      const imageUrl = page.finalImageUrl || page.panels[0]?.imageUrl
      if (imageUrl) {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        zip.file(`page-${page.pageNumber}.png`, blob)
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = 'persona.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      toast.success(t('packagingSuccess'))
    })
  }

  const generatedPages = pages.filter((p) => p.isGenerated)
  const currentPageData = pages.find((p) => p.pageNumber === currentPage)

  const handleDoubleClick = () => {
    if (currentPageData?.isGenerated && currentPageData.finalImageUrl) {
      setSelectedPage(currentPageData)
      setIsFinetuneModalOpen(true)
    }
  }

  const handleEditClick = () => {
    if (currentPageData?.isGenerated) {
      setSelectedPage(currentPageData)
      setIsFinetuneModalOpen(true)
    }
  }

  const updatePage = (updatedPage: IMangaPage) => {
    setPages((prevPages) =>
      prevPages.map((p) => (p.id === updatedPage.id ? updatedPage : p)),
    )
  }

  const handleGenerate = async (
    baseImage: IImageHistory,
    prompt: string,
    referenceImage: string | null,
  ) => {
    if (!selectedPage) return

    toast.info(
      t('generatingNewVersion', { pageNumber: selectedPage.pageNumber }),
    )

    try {
      // 1. Fetch the base image and convert to base64
      const imageResponse = await fetch(baseImage.imageUrl)
      const imageBlob = await imageResponse.blob()
      const reader = new FileReader()
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () =>
          resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(imageBlob)
      })

      let base64ReferenceImage: string | undefined = undefined
      if (referenceImage) {
        const refImageResponse = await fetch(referenceImage)
        const refImageBlob = await refImageResponse.blob()
        const reader = new FileReader()
        base64ReferenceImage = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () =>
            resolve((reader.result as string).split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(refImageBlob)
        })
      }

      // 2. Call the generate API with finetuning data
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'finetune',
          prompt: prompt,
          page: selectedPage, // Pass the whole page object
          finetuneImage: base64Image,
          referenceImage: base64ReferenceImage,
          locale,
          model: imageModel,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const newImageUrl = result.imageUrl

      // 3. Update the page state with the new history item
      const newHistoryItem: IImageHistory = {
        id: `hist-page-${Date.now()}`,
        imageUrl: newImageUrl,
        prompt: prompt,
        createdAt: new Date().toISOString(),
      }

      const updatedPage: IMangaPage = {
        ...selectedPage,
        history: [...(selectedPage.history || []), newHistoryItem],
        finalImageUrl: newHistoryItem.imageUrl,
        selectedHistoryId: newHistoryItem.id,
      }

      updatePage(updatedPage)
      setSelectedPage(updatedPage)
      toast.success(t('pageUpdated', { pageNumber: selectedPage.pageNumber }))
    } catch (error) {
      console.error('Finetuning generation for page failed:', error)
      toast.error(t('finetuningFailed'))
    }
  }

  const handleSelect = (historyId: string) => {
    if (!selectedPage) return
    const historyItem = selectedPage.history?.find((h) => h.id === historyId)
    if (!historyItem) return

    const updatedPage: IMangaPage = {
      ...selectedPage,
      selectedHistoryId: historyId,
      finalImageUrl: historyItem.imageUrl,
    }
    updatePage(updatedPage)
    setSelectedPage(updatedPage)
  }

  const handleDelete = (historyId: string) => {
    if (!selectedPage || !selectedPage.history) return
    if (selectedPage.history.length <= 1) {
      toast.error(t('cannotDeleteOnlyImage'))
      return
    }
    if (selectedPage.selectedHistoryId === historyId) {
      toast.error(t('cannotDeleteSelectedImage'))
      return
    }

    const updatedHistory = selectedPage.history.filter(
      (h) => h.id !== historyId,
    )
    const updatedPage: IMangaPage = {
      ...selectedPage,
      history: updatedHistory,
    }
    updatePage(updatedPage)
    setSelectedPage(updatedPage)
  }

  const handleReferenceImageChange = (newReferenceImage: string | null) => {
    if (!selectedPage) return
    const updatedPage: IMangaPage = {
      ...selectedPage,
      referenceImage: newReferenceImage,
    }
    updatePage(updatedPage)
    setSelectedPage(updatedPage)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {currentPageData?.isGenerated && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  title={t('editPage')}
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title={t('downloadCurrentPage')}
                  onClick={handleDownloadCurrentPage}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </>
            )}
            {generatedPages.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                title={t('downloadAllPages')}
                onClick={handleDownloadAllPages}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {generatedPages.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">{t('noPages')}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                title={t('previousPageTitle')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <div
                className="relative group w-full max-w-2xl cursor-pointer"
                onDoubleClick={handleDoubleClick}
              >
                {currentPageData?.isGenerated &&
                (currentPageData.finalImageUrl ||
                  currentPageData.panels[0]?.imageUrl) ? (
                  <Image
                    src={
                      currentPageData.finalImageUrl ||
                      currentPageData.panels[0]!.imageUrl!
                    }
                    alt={`Manga Page ${currentPage}`}
                    width={800}
                    height={1200}
                    className="h-auto w-full rounded-md border"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                ) : (
                  <div className="flex items-center justify-center aspect-[3/4] w-full border-2 border-dashed rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground text-center px-4">
                      {t('pageNotGenerated', { pageNumber: currentPage })}
                    </p>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                  {t('pageIndicator', { currentPage, totalPage })}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage >= totalPage ||
                  !pages.find((p) => p.pageNumber === currentPage + 1)
                    ?.isGenerated
                }
                title={t('nextPageTitle')}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedPage && isFinetuneModalOpen && (
        <ImageFinetuneModal
          isOpen={isFinetuneModalOpen}
          onClose={() => setIsFinetuneModalOpen(false)}
          imageHistory={selectedPage.history || []}
          selectedHistoryId={selectedPage.selectedHistoryId}
          referenceImage={selectedPage.referenceImage}
          onGenerate={handleGenerate}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onReferenceImageChange={handleReferenceImageChange}
        />
      )}
    </>
  )
}
