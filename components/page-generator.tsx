'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useManga } from './manga-context'
import { Pagination } from './ui/pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { IAsset, IMangaPage, IStoryPlan } from '@/types'
import { Loader2, Sparkles, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { InspireButton } from './inspire-button'
import { getPrompts, Locale } from '@/lib/prompts'
import { generateUUID } from '@/lib/utils'

interface PageGeneratorProps {
  storySummary: string
  artStyle: string
  artStyleImage?: string | null
  characters: IAsset[]
  environments: IAsset[]
  storyPlan: IStoryPlan | null
  selectedAssetIds: Set<string>
  setSelectedAssetIds: Dispatch<SetStateAction<Set<string>>>
}

const LAYOUT_SEPARATOR = '\n\n---LAYOUT---\n\n'

export function PageGenerator({
  storySummary,
  artStyle,
  artStyleImage,
  characters,
  environments,
  storyPlan,
  selectedAssetIds,
  setSelectedAssetIds,
}: PageGeneratorProps) {
  const t = useTranslations('PageGenerator')
  const locale = useLocale() as Locale

  const {
    currentPage,
    pages: contextPages,
    updatePageSummary,
    updatePanelPrompt,
    updatePanelImageUrl,
    updatePage,
    aspectRatio,
    resolution,
    textModel,
    imageModel,
  } = useManga()

  const [generationPrompt, setGenerationPrompt] = useState('')
  const [panelPrompts, setPanelPrompts] = useState<string[]>([''])
  const [layoutPrompt, setLayoutPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInspiring, setIsInspiring] = useState(false)

  const currentPageData = contextPages.find((p) => p.pageNumber === currentPage)

  // Sync local generation prompt state with context
  useEffect(() => {
    const fullPrompt = currentPageData?.panels[0]?.prompt || ''
    setGenerationPrompt(fullPrompt)

    if (!fullPrompt) {
      setPanelPrompts([''])
      setLayoutPrompt('')
      return
    }

    const parts = fullPrompt.split(LAYOUT_SEPARATOR)
    const panelsText = parts[0]
    const layoutText = parts.length > 1 ? parts[1] : ''

    setLayoutPrompt(layoutText)
    const panels = panelsText
      .split('\n\n')
      .filter((p: string) => p.trim() !== '')

    // If there are panels, use them; otherwise, initialize with one empty panel.
    const newPanelPrompts = panels.length > 0 ? panels : ['']
    setPanelPrompts(newPanelPrompts)
  }, [currentPage, currentPageData])

  const handlePanelPromptChange = (index: number, value: string) => {
    const newPanelPrompts = [...panelPrompts]
    newPanelPrompts[index] = value
    setPanelPrompts(newPanelPrompts)

    const combinedPrompt =
      newPanelPrompts.filter((p) => p.trim()).join('\n\n') +
      (layoutPrompt ? `${LAYOUT_SEPARATOR}${layoutPrompt}` : '')
    setGenerationPrompt(combinedPrompt)

    if (currentPageData) {
      updatePanelPrompt(currentPage, 1, combinedPrompt)
    }
  }

  const handleLayoutPromptChange = (value: string) => {
    setLayoutPrompt(value)

    const combinedPrompt =
      panelPrompts.filter((p) => p.trim()).join('\n\n') +
      (value ? `${LAYOUT_SEPARATOR}${value}` : '')
    setGenerationPrompt(combinedPrompt)

    if (currentPageData) {
      updatePanelPrompt(currentPage, 1, combinedPrompt)
    }
  }

  const handleAddPanel = () => {
    setPanelPrompts([...panelPrompts, ''])
  }

  const handleRemovePanel = (index: number) => {
    if (panelPrompts.length <= 1) {
      toast.error(t('errorLastPanel'))
      return
    }
    const newPanelPrompts = panelPrompts.filter((_, i) => i !== index)
    setPanelPrompts(newPanelPrompts)
  }

  const handleInspire = async () => {
    if (!storyPlan) {
      toast.error(t('errorPlanFirst'))
      return
    }
    setIsInspiring(true)
    toast.info(t('infoGeneratingSuggestion'))
    try {
      const response = await fetch('/api/inspire/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyPlan: storyPlan,
          previousPagePrompts: contextPages
            .filter(
              (p) =>
                p.pageNumber < currentPage &&
                (p.summary || p.panels[0]?.prompt),
            )
            .map((p) => p.summary || p.panels[0]?.prompt || ''),
          locale,
          aspectRatio,
          model: textModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('errorSuggestionFailed'))
      }

      const result = await response.json()

      let combinedPrompt = ''
      if (result.panel && Array.isArray(result.panel)) {
        // API returned new format, dynamically set panels
        const newPanelPrompts = result.panel.length > 0 ? result.panel : ['']
        setPanelPrompts(newPanelPrompts)

        const newLayoutPrompt = result.layout || ''
        setLayoutPrompt(newLayoutPrompt)

        combinedPrompt =
          newPanelPrompts.filter((p: string) => p.trim()).join('\n\n') +
          (newLayoutPrompt ? `${LAYOUT_SEPARATOR}${newLayoutPrompt}` : '')
      } else if (result.pagePrompt) {
        // Fallback for old format
        combinedPrompt = result.pagePrompt
        const parts = result.pagePrompt.split(LAYOUT_SEPARATOR)
        const panelsText = parts[0]
        const layoutText = parts.length > 1 ? parts[1] : ''
        setLayoutPrompt(layoutText)
        const panels = panelsText
          .split('\n\n')
          .filter((p: string) => p.trim() !== '')
        setPanelPrompts(panels.length > 0 ? panels : [''])
      }

      // Directly update the generation prompt and the context
      setGenerationPrompt(combinedPrompt)
      if (currentPageData) {
        updatePanelPrompt(currentPage, 1, combinedPrompt)
      }
      toast.success(t('successSuggestion'))
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : t('errorSuggestionFailed'),
      )
    } finally {
      setIsInspiring(false)
    }
  }

  const handleAssetSelection = (assetId: string) => {
    setSelectedAssetIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(assetId)) {
        newSet.delete(assetId)
      } else {
        newSet.add(assetId)
      }
      return newSet
    })
  }

  const handleGeneratePage = async () => {
    if (!generationPrompt.trim()) {
      toast.error(t('errorPrompt'))
      return
    }

    setIsLoading(true)
    toast.info(t('infoGeneratingPage', { pageNumber: currentPage }))

    try {
      // Helper to convert any image URL (blob or data) to a pure base64 string
      const urlToPureBase64 = async (
        url: string | undefined,
      ): Promise<string | undefined> => {
        if (!url) return undefined
        if (url.startsWith('data:')) {
          return url.split(',')[1]
        }
        // For blob URLs or other URLs, fetch and convert
        const response = await fetch(url)
        const blob = await response.blob()
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        return dataUrl.split(',')[1]
      }

      const allAssets = [...characters, ...environments]
      const selectedAssets = allAssets.filter((asset) =>
        selectedAssetIds.has(asset.id),
      )

      const recentPages = contextPages
        .filter(
          (p) => p.pageNumber < currentPage && p.isGenerated && p.finalImageUrl,
        )
        .slice(-3)

      const prompts = getPrompts(locale)
      const fullPrompt = prompts.page.generation(
        !!artStyleImage,
        storySummary,
        artStyle,
        currentPage,
        aspectRatio,
        generationPrompt,
        recentPages,
        selectedAssets,
      )

      // Convert all images to pure base64 concurrently
      const imageToSend = artStyleImage
        ? await urlToPureBase64(artStyleImage)
        : undefined

      const pageImagePromises = recentPages.map(
        (p) => p.finalImageUrl && urlToPureBase64(p.finalImageUrl),
      )

      // Convert selected assets to referenceAssets with names
      const referenceAssetPromises = selectedAssets
        .filter((asset) => asset.imageUrl)
        .map(async (asset) => {
          const base64 = await urlToPureBase64(asset.imageUrl)
          if (!base64) return null
          return {
            name: asset.name,
            image: base64,
            type: asset.type,
          }
        })

      const referenceAssets = (
        await Promise.all(referenceAssetPromises)
      ).filter((asset) => asset !== null)

      // Keep recent pages as baseImages (generic context)
      const baseImages = (await Promise.all(pageImagePromises)).filter(
        (b): b is string => !!b,
      )

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          image: imageToSend,
          baseImages,
          referenceAssets,
          aspectRatio,
          resolution,
          model: imageModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || t('errorGenerationFailed'))
      }

      const { imageUrl: newImageUrl } = await response.json()
      if (!newImageUrl) {
        throw new Error('Image URL not found in API response.')
      }

      const newHistoryItem = {
        id: `hist-page-${generateUUID()}`,
        imageUrl: newImageUrl,
        prompt: generationPrompt,
        createdAt: new Date().toISOString(),
      }

      if (currentPageData) {
        const updatedPage: IMangaPage = {
          ...currentPageData,
          isGenerated: true,
          finalImageUrl: newImageUrl,
          panels: [{ ...currentPageData.panels[0], imageUrl: newImageUrl }], // Assuming one panel
          history: [...(currentPageData.history || []), newHistoryItem],
          selectedHistoryId: newHistoryItem.id,
        }
        updatePage(updatedPage)
      }

      toast.success(t('successPageGenerated', { pageNumber: currentPage }))
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : t('unknownError'))
    } finally {
      setIsLoading(false)
    }
  }

  const hasAssets = characters.length > 0 || environments.length > 0

  return (
    <div className="space-y-6">
      {contextPages && contextPages.length > 0 && <Pagination />}

      <div className="pt-6 space-y-4">
        <div>
          <Label
            htmlFor="story-summary-display"
            className="font-semibold text-muted-foreground"
          >
            {t('pageOutline')}
          </Label>
          <Textarea
            id="story-summary-display"
            value={currentPageData?.summary || ''}
            onChange={(e) => {
              if (currentPageData) {
                updatePageSummary(currentPage, e.target.value)
              }
            }}
            placeholder={t('noOutline')}
            className="min-h-24 mt-2 bg-muted/50"
            disabled={!currentPageData}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">
              {t('promptForPage', { pageNumber: currentPage })}
            </Label>
            <InspireButton onClick={handleInspire} isLoading={isInspiring} />
          </div>

          {/* Dynamic Panel prompts */}
          <div className="space-y-4 mt-4">
            <Label className="text-base font-medium">
              {t('panelDescription')}
            </Label>
            {panelPrompts.map((panelPrompt, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`panel-${index}`}
                    className="text-sm text-muted-foreground"
                  >
                    {t('panelLabel', { number: index + 1 })}
                  </Label>
                  {panelPrompts.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemovePanel(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  id={`panel-${index}`}
                  placeholder={t('panelPlaceholder', { number: index + 1 })}
                  className="min-h-20"
                  value={panelPrompt}
                  onChange={(e) =>
                    handlePanelPromptChange(index, e.target.value)
                  }
                  disabled={isLoading || !currentPageData}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddPanel}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('addPanel')}
            </Button>
          </div>

          {/* Layout prompt */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="layout-prompt" className="text-base font-medium">
              {t('panelLayout')}
            </Label>
            <Textarea
              id="layout-prompt"
              placeholder={t('layoutPlaceholder')}
              className="min-h-20"
              value={layoutPrompt}
              onChange={(e) => handleLayoutPromptChange(e.target.value)}
              disabled={isLoading || !currentPageData}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold">{t('selectAssets')}</h4>
        {!hasAssets ? (
          <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
            {t('noAssets')}
          </p>
        ) : (
          <>
            {characters.length > 0 && (
              <div className="space-y-2">
                <Label>{t('characters')}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {characters
                    .filter((c) => c.imageUrl)
                    .map((char) => (
                      <div
                        key={char.id}
                        className="flex flex-col items-center gap-2"
                      >
                        <label
                          htmlFor={char.id}
                          className={`cursor-pointer relative rounded-md transition-all ${
                            selectedAssetIds.has(char.id)
                              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                              : ''
                          }`}
                        >
                          {char.imageUrl ? (
                            <Image
                              src={char.imageUrl}
                              alt={char.name}
                              width={120}
                              height={120}
                              className="rounded-md object-cover aspect-square border"
                            />
                          ) : (
                            <div className="w-[120px] h-[120px] bg-gray-200 rounded-md border flex items-center justify-center">
                              <p className="text-xs text-gray-500 text-center p-1">
                                {t('noImageForAsset')}
                              </p>
                            </div>
                          )}
                          <Checkbox
                            id={char.id}
                            onCheckedChange={() =>
                              handleAssetSelection(char.id)
                            }
                            checked={selectedAssetIds.has(char.id)}
                            className="absolute top-1 right-1 bg-background"
                            disabled={isLoading || !char.imageUrl}
                          />
                        </label>
                        <span className="text-sm text-center">{char.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {environments.length > 0 && (
              <div className="space-y-2">
                <Label>{t('environments')}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {environments
                    .filter((e) => e.imageUrl)
                    .map((env) => (
                      <div
                        key={env.id}
                        className="flex flex-col items-center gap-2"
                      >
                        <label
                          htmlFor={env.id}
                          className={`cursor-pointer relative rounded-md transition-all ${
                            selectedAssetIds.has(env.id)
                              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                              : ''
                          }`}
                        >
                          {env.imageUrl ? (
                            <Image
                              src={env.imageUrl}
                              alt={env.name}
                              width={120}
                              height={120}
                              className="rounded-md object-cover aspect-square border"
                            />
                          ) : (
                            <div className="w-[120px] h-[120px] bg-gray-200 rounded-md border flex items-center justify-center">
                              <p className="text-xs text-gray-500 text-center p-1">
                                {t('noImageForAsset')}
                              </p>
                            </div>
                          )}
                          <Checkbox
                            id={env.id}
                            onCheckedChange={() => handleAssetSelection(env.id)}
                            checked={selectedAssetIds.has(env.id)}
                            className="absolute top-1 right-1 bg-background"
                            disabled={isLoading || !env.imageUrl}
                          />
                        </label>
                        <span className="text-sm text-center">{env.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Button
        onClick={handleGeneratePage}
        disabled={
          isLoading ||
          !hasAssets ||
          !currentPageData ||
          (currentPage > 1 && !contextPages[currentPage - 2]?.isGenerated)
        }
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('generatingPage')}
          </>
        ) : currentPageData?.isGenerated ? (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            {t('regeneratePage', { pageNumber: currentPage })}
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            {t('generatePage', { pageNumber: currentPage })}
          </>
        )}
      </Button>
    </div>
  )
}
