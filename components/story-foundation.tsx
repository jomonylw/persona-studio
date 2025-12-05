'use client'

import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { useManga } from './manga-context'
import { useTranslations, useLocale, useMessages } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IStoryPlan, IMangaPage } from '@/types'
import { toast } from 'sonner'
import {
  Loader2,
  BookCheck,
  Wand2,
  ChevronsUpDown,
  Sparkles,
  Trash2,
  Plus,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Locale } from '@/lib/prompts'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { EditableTruncatedText } from './editable-truncated-text'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Combobox } from './ui/combobox'
import { ImageUploader } from './image-uploader'
import { urlToPureBase64, generateUUID } from '@/lib/utils'
import { StoryPlanEditor } from './story-plan-editor'

// Type for better type-safety with next-intl messages
type StoryFoundationMessages = {
  genres: Record<string, string>
  [key: string]: string | Record<string, string>
}

// No longer needs props, will get everything from context
// interface StoryFoundationProps { ... }

export function StoryFoundation() {
  const t = useTranslations('StoryFoundation')
  const t_genres = useTranslations('StoryFoundation.genres')
  const locale = useLocale() as Locale
  const messages = useMessages()
  const {
    genre,
    setGenre,
    colorStyle,
    setColorStyle,
    storySummary,
    setStorySummary,
    artStyle,
    setArtStyle,
    artStyleImage,
    setArtStyleImage,
    storyPlan,
    setStoryPlan,
    pages,
    setPages,
    updatePageSummary,
    inspirationConstraints,
    setInspirationConstraints,
    textModel,
    isUserUploadingRef,
  } = useManga()
  const genreMessages =
    (messages.StoryFoundation as StoryFoundationMessages)?.genres ?? {}
  const initialGenres = [
    'Sci-Fi',
    'Fantasy',
    'Slice of Life',
    'Action',
    'Horror',
    'Cyberpunk',
    'Romance',
  ]
  const [numPages, setNumPages] = useState<number>(4)
  const [isInspiring, setIsInspiring] = useState(false)
  const [isPlanning, setIsPlanning] = useState(false)
  const [isRegeneratingPages, setIsRegeneratingPages] = useState(false)
  const [isInspiringArtStyle, setIsInspiringArtStyle] = useState(false)
  const [genreOptions, setGenreOptions] = useState(initialGenres)
  const [isFoundationOpen, setIsFoundationOpen] = useState(true)
  const prevArtStyleImageRef = useRef<string | null>(null)

  useEffect(() => {
    // Automatically generate the art style description when a new image is uploaded.
    // This triggers only when an image is added, not when it's cleared or on initial load.
    if (artStyleImage && isUserUploadingRef.current) {
      handleInspireArtStyle()
      isUserUploadingRef.current = false // Reset the flag immediately after use
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artStyleImage])

  const handleInspire = async (constraints?: string) => {
    setIsInspiring(true)
    toast.info(t('dreamingUpStory'))
    try {
      const response = await fetch('/api/inspire/foundation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, constraints, model: textModel }),
      })
      if (!response.ok) throw new Error('Failed to get inspiration.')
      const data = await response.json()

      // Dynamically add new genre to options if it doesn't exist
      if (!genreOptions.includes(data.genre)) {
        setGenreOptions((prev) => [...prev, data.genre])
      }

      setGenre(data.genre)
      setStorySummary(data.storySummary)
      setArtStyle(data.artStyle)
      setColorStyle(data.colorStyle)
      toast.success(t('inspirationStruck'))
    } catch (error) {
      toast.error(t('inspirationFailed'))
    } finally {
      setIsInspiring(false)
    }
  }

  const handleInspireArtStyle = async () => {
    if (!artStyleImage) {
      // This should not happen if the button is disabled correctly, but it's good practice.
      toast.error(t('errorUploadFirst'))
      return
    }
    setIsInspiringArtStyle(true)
    toast.info(t('infoAnalyzing'))
    try {
      const imageAsBase64 = await urlToPureBase64(artStyleImage)

      const response = await fetch('/api/inspire/art-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageAsBase64,
          locale,
          genre,
          storySummary,
          colorStyle,
          model: textModel,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get art style description.')
      }

      const data = await response.json()
      setArtStyle(data.artStyle)

      // If a plan already exists, update its detailed art style
      if (storyPlan && data.detailedArtStyle) {
        setStoryPlan((prev) =>
          prev ? { ...prev, detailedArtStyle: data.detailedArtStyle } : null,
        )
      }

      toast.success(t('successArtStyleGenerated'))
    } catch (error) {
      toast.error(t('errorArtStyleFailed'))
    } finally {
      setIsInspiringArtStyle(false)
    }
  }

  const handleMakePlan = async () => {
    if (!storySummary.trim()) {
      toast.error(t('provideSummaryError'))
      return
    }
    setIsPlanning(true)
    setStoryPlan(null)
    setPages([])
    toast.info(t('craftingPlan'))

    try {
      // Step 1: Generate the core plan (without pages)
      const imageAsBase64 = artStyleImage
        ? await urlToPureBase64(artStyleImage)
        : undefined

      const planResponse = await fetch('/api/inspire/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          storySummary,
          artStyle,
          colorStyle,
          numPages,
          locale,
          artStyleImage: imageAsBase64,
          model: textModel,
        }),
      })

      if (!planResponse.ok) {
        throw new Error('Failed to generate core plan.')
      }
      const corePlan: Omit<IStoryPlan, 'pages'> = await planResponse.json()

      // Immediately set the core plan to show characters/environments
      setStoryPlan({ ...corePlan, pages: [] })
      toast.info(t('corePlanCreated'))
      setIsPlanning(false) // Hide main skeleton, show partial results
      setIsRegeneratingPages(true) // Show skeleton only for pages section

      // Ensure skeleton shows for at least 800ms even if API responds quickly
      setTimeout(() => {
        // This ensures the skeleton is visible even if API responds quickly
      }, 800)

      // Step 2: Generate the page breakdown
      const pagesResponse = await fetch('/api/inspire/story-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: corePlan,
          numPages,
          locale,
          model: textModel,
        }),
      })

      if (!pagesResponse.ok) {
        throw new Error('Failed to generate page breakdown.')
      }
      const pagesData = await pagesResponse.json()

      // Combine core plan and pages
      const fullPlan: IStoryPlan = { ...corePlan, pages: pagesData.pages }
      setStoryPlan(fullPlan)

      // Convert plan pages to IMangaPage and set in context
      const pagesFromPlan: IMangaPage[] = fullPlan.pages.map((p) => ({
        id: generateUUID(),
        pageNumber: p.page,
        summary: p.description,
        panels: [
          {
            id: generateUUID(),
            panelNumber: 1,
            prompt: '',
            imageUrl: undefined,
          },
        ],
        isGenerated: false,
      }))
      setPages(pagesFromPlan)

      toast.success(t('planReady'))
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : t('planFailed'))
    } finally {
      // Ensure both loading states are reset
      setIsPlanning(false)
      setIsRegeneratingPages(false)
    }
  }

  const handleRegeneratePages = async () => {
    if (!storyPlan) {
      toast.error(t('generatePlanFirstError'))
      return
    }
    setIsRegeneratingPages(true)
    toast.info(t('regeneratingPages'))

    // Ensure skeleton shows for at least 800ms
    setTimeout(() => {
      // This ensures the skeleton is visible even if API responds quickly
    }, 800)
    try {
      const { pages, ...corePlan } = storyPlan

      const pagesResponse = await fetch('/api/inspire/story-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: corePlan,
          numPages,
          locale,
          model: textModel,
        }),
      })

      if (!pagesResponse.ok) {
        throw new Error('Failed to generate page breakdown.')
      }
      const pagesData = await pagesResponse.json()

      const fullPlan: IStoryPlan = { ...corePlan, pages: pagesData.pages }
      setStoryPlan(fullPlan)

      const pagesFromPlan: IMangaPage[] = fullPlan.pages.map((p) => ({
        id: generateUUID(),
        pageNumber: p.page,
        summary: p.description,
        panels: [
          {
            id: generateUUID(),
            panelNumber: 1,
            prompt: '',
            imageUrl: undefined,
          },
        ],
        isGenerated: false,
      }))
      setPages(pagesFromPlan)

      toast.success(t('pagesRegenerated'))
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : t('pagesRegenerationFailed'),
      )
    } finally {
      setIsRegeneratingPages(false)
    }
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription className="mt-1">
              {t('description')}
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={isInspiring || isPlanning}
                title={t('inspireMe')}
              >
                {isInspiring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('inspireTitle')}</DialogTitle>
                <DialogDescription>{t('inspireDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  id="inspiration-constraints"
                  placeholder={t('inspirePlaceholder')}
                  value={inspirationConstraints}
                  onChange={(e) => setInspirationConstraints(e.target.value)}
                  className="h-32"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() => handleInspire(inspirationConstraints)}
                    disabled={isInspiring}
                    className="w-full"
                  >
                    {isInspiring ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('inspireWithIdeas')}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Collapsible
          open={isFoundationOpen}
          onOpenChange={setIsFoundationOpen}
          className="space-y-6"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-2"
            >
              <h4 className="font-semibold">{t('foundationTitle')}</h4>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 pt-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-1.5">
                <Label>{t('genre')}</Label>
                <Combobox
                  value={genre}
                  onChange={setGenre}
                  options={genreOptions.map((g) => ({
                    value: g,
                    label: g.includes(' / ')
                      ? g
                          .split(' / ')
                          .map((part) => {
                            const p = part.trim()
                            return Object.prototype.hasOwnProperty.call(
                              genreMessages,
                              p,
                            )
                              ? t_genres(p)
                              : p
                          })
                          .join(' / ')
                      : Object.prototype.hasOwnProperty.call(genreMessages, g)
                        ? t_genres(g)
                        : g,
                  }))}
                  placeholder={t('genre')}
                  searchPlaceholder={t('searchGenre')}
                  emptyPlaceholder={t('noGenreFound')}
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('colorStyle')}</Label>
                <Select value={colorStyle} onValueChange={setColorStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('colorStyle')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Black and White">{t('bw')}</SelectItem>
                    <SelectItem value="Colorized">{t('color')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{t('numPages')}</Label>
                <Select
                  value={String(numPages)}
                  onValueChange={(v) => setNumPages(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 3, 4, 6, 8, 10, 12, 15].map((p) => (
                      <SelectItem key={p} value={String(p)}>
                        {t('pages', { count: p })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="story-summary">{t('storySummary')}</Label>
                <Textarea
                  id="story-summary"
                  placeholder={t('storySummaryPlaceholder')}
                  value={storySummary}
                  onChange={(e) => setStorySummary(e.target.value)}
                  className="h-30"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="art-style">{t('artStyle')}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleInspireArtStyle}
                    disabled={!artStyleImage || isInspiringArtStyle}
                  >
                    {isInspiringArtStyle ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {t('generateArtStyleDescription')}
                  </Button>
                </div>
                <Textarea
                  id="art-style"
                  placeholder={t('artStylePlaceholder')}
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  className="h-24"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="art-style-image">{t('artStyleImage')}</Label>
                <ImageUploader
                  image={artStyleImage || null}
                  setImage={setArtStyleImage}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleMakePlan}
                disabled={!storySummary || isPlanning}
                className="w-full"
                size="lg"
              >
                {isPlanning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BookCheck className="mr-2 h-4 w-4" />
                )}
                {t('makePlan')}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <StoryPlanEditor
          isPlanning={isPlanning}
          isRegeneratingPages={isRegeneratingPages}
          onRegeneratePages={handleRegeneratePages}
        />
      </CardContent>
    </Card>
  )
}
