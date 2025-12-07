'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { InspireButton } from './inspire-button'
import { Textarea } from '@/components/ui/textarea'
import {
  Loader2,
  Sparkles,
  Download,
  Trash2,
  Pencil,
  Check,
  ImageIcon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ICharacterAsset,
  IEnvironmentAsset,
  IImageHistory,
  IPhoto,
} from '@/types'
import { useStudio } from './studio-context'
import { ImageFinetuneModal } from './image-finetune-modal'
import {
  getArtStyleDescription,
  getStyles,
  PhotoshootStyle,
} from '@/lib/prompts/photoshoot'

export function PhotoshootStudio() {
  const t = useTranslations('PhotoshootStudio')
  const locale = useLocale()
  const {
    characters,
    environments,
    photos,
    addPhoto,
    updatePhoto,
    deletePhoto,
    aspectRatio,
    resolution,
  } = useStudio()

  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<
    string | null
  >(null)
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<Set<string>>(
    new Set(),
  )
  const [selectedStyle, setSelectedStyle] =
    useState<PhotoshootStyle>('candid_street')
  const [prompt, setPrompt] = useState('')
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null)
  const [isInspiring, setIsInspiring] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFinetuneModalOpen, setIsFinetuneModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isInternalUpdate = useRef(false)

  useEffect(() => {
    // If the update was triggered internally (by generating a photo),
    // we don't want to sync the state from the photos array.
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }

    // When a project is imported, sync the state of the photoshoot studio
    // with the latest photo available in the project.
    if (photos && photos.length > 0) {
      const lastPhoto = photos[photos.length - 1]
      if (lastPhoto) {
        setActivePhotoId(lastPhoto.id)
        let promptToShow = lastPhoto.prompt
        if (lastPhoto.history && lastPhoto.selectedHistoryId) {
          const selectedHistory = lastPhoto.history.find(
            (h) => h.id === lastPhoto.selectedHistoryId,
          )
          if (selectedHistory) {
            promptToShow = selectedHistory.prompt
          }
        }
        setPrompt(promptToShow)
        setSelectedCharacterIds(new Set(lastPhoto.characterIds))
        setSelectedEnvironmentId(lastPhoto.environmentId || null)
      }
    } else {
      // If there are no photos, reset the studio state
      setActivePhotoId(null)
      setPrompt('')
      setSelectedCharacterIds(new Set())
      setSelectedEnvironmentId(null)
    }
    // We only want to run this effect when the photos array is replaced,
    // such as on project import. Not on every photo addition/deletion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos])

  const handleInspire = async () => {
    setIsInspiring(true)
    try {
      const selectedEnvironment = environments.find(
        (e) => e.id === selectedEnvironmentId,
      )
      const selectedCharacters = characters.filter((c) =>
        selectedCharacterIds.has(c.id),
      )

      if (selectedCharacters.length === 0) {
        // TODO: Show a toast notification
        console.error('Please select characters first.')
        return
      }

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

      const charactersWithBase64 = await Promise.all(
        selectedCharacters.map(async (character) => ({
          ...character,
          imageUrl: await urlToPureBase64(character.imageUrl),
        })),
      )

      const environmentWithBase64 = selectedEnvironment
        ? {
            ...selectedEnvironment,
            imageUrl: await urlToPureBase64(selectedEnvironment.imageUrl),
          }
        : undefined

      const response = await fetch('/api/inspire/photoshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characters: charactersWithBase64,
          environment: environmentWithBase64,
          aspectRatio,
          locale,
          style: selectedStyle,
          userIdea: prompt,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const result = await response.json()
      setPrompt(result.prompt)
    } catch (error) {
      console.error('Failed to get prompt:', error)
      // TODO: Show an error toast
    } finally {
      setIsInspiring(false)
    }
  }

  const handleCharacterSelection = (characterId: string) => {
    setSelectedCharacterIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(characterId)) {
        newSet.delete(characterId)
      } else {
        newSet.add(characterId)
      }
      return newSet
    })
  }

  const handleGenerate = async (finetunePrompt?: string) => {
    setIsGenerating(true)
    try {
      const selectedEnvironment = environments.find(
        (e) => e.id === selectedEnvironmentId,
      )
      const selectedCharacters = characters.filter((c) =>
        selectedCharacterIds.has(c.id),
      )

      if (selectedCharacters.length === 0) {
        console.error('Selection is not valid')
        return
      }

      const urlToPureBase64 = async (
        url: string | undefined,
      ): Promise<string | undefined> => {
        if (!url) return undefined
        if (url.startsWith('data:')) {
          return url.split(',')[1]
        }
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

      const allAssets = selectedEnvironment
        ? [...selectedCharacters, selectedEnvironment]
        : [...selectedCharacters]
      const referenceAssetPromises = allAssets
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

      const activePhoto = photos.find((p) => p.id === activePhotoId)

      const finetuneImageBase64 = finetunePrompt
        ? await urlToPureBase64(activePhoto?.imageUrl)
        : undefined

      const requestBody = {
        characterIds: Array.from(selectedCharacterIds),
        environmentId: selectedEnvironmentId || '',
        photoPrompt: finetunePrompt || prompt,
        characters: selectedCharacters.map(
          ({ id, name, descriptor, type }) => ({
            id,
            name,
            descriptor,
            type,
          }),
        ),
        environment: selectedEnvironment
          ? {
              id: selectedEnvironment.id,
              name: selectedEnvironment.name,
              prompt: selectedEnvironment.prompt,
              type: selectedEnvironment.type,
            }
          : undefined,
        referenceAssets,
        finetuneImage: finetuneImageBase64,
        locale,
        artStyle: getArtStyleDescription(selectedStyle, locale),
        aspectRatio: aspectRatio,
        resolution: resolution,
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const result = await response.json()

      const newHistoryEntry: IImageHistory = {
        id: `hist-${Date.now()}`,
        imageUrl: result.imageUrl,
        prompt: finetunePrompt || prompt,
        createdAt: new Date().toISOString(),
      }

      if (finetunePrompt) {
        setPrompt(finetunePrompt)
      }

      if (activePhoto) {
        // This is a finetune, update the existing photo
        const updatedPhoto: IPhoto = {
          ...activePhoto,
          imageUrl: result.imageUrl,
          history: [...(activePhoto.history || []), newHistoryEntry],
          selectedHistoryId: newHistoryEntry.id,
        }
        isInternalUpdate.current = true
        updatePhoto(updatedPhoto)
      } else {
        // This is a new photo
        const newPhoto: IPhoto = {
          id: `photo-${Date.now()}`,
          prompt: prompt,
          characterIds: Array.from(selectedCharacterIds),
          environmentId: selectedEnvironmentId || '',
          imageUrl: result.imageUrl,
          history: [newHistoryEntry],
          selectedHistoryId: newHistoryEntry.id,
        }
        isInternalUpdate.current = true
        addPhoto(newPhoto)
        setActivePhotoId(newPhoto.id)
      }
    } catch (error) {
      console.error('Failed to generate photo:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFinetune = async (
    baseImage: IImageHistory,
    prompt: string,
    referenceImage: string | null,
  ) => {
    await handleGenerate(prompt)
  }

  const activePhoto = photos.find((p) => p.id === activePhotoId)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!activePhoto?.imageUrl) return
    try {
      const response = await fetch(activePhoto.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `photo-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDeleting) {
      if (activePhotoId) {
        isInternalUpdate.current = true
        deletePhoto(activePhotoId)
        setActivePhotoId(null)
      }
      setIsDeleting(false)
    } else {
      setIsDeleting(true)
    }
  }

  const handleSelectHistory = (historyId: string) => {
    if (!activePhoto) return
    const selectedHistoryItem = activePhoto.history?.find(
      (h) => h.id === historyId,
    )
    if (selectedHistoryItem) {
      isInternalUpdate.current = true
      setPrompt(selectedHistoryItem.prompt)
      updatePhoto({
        ...activePhoto,
        imageUrl: selectedHistoryItem.imageUrl,
        selectedHistoryId: historyId,
      })
    }
  }

  const handleDeleteHistory = (historyId: string) => {
    if (!activePhoto || !activePhoto.history) return

    const newHistory = activePhoto.history.filter((h) => h.id !== historyId)

    if (newHistory.length === 0) {
      // If no history is left, delete the entire photo object
      isInternalUpdate.current = true
      deletePhoto(activePhoto.id)
      setActivePhotoId(null)
    } else {
      // If the deleted image was the one being displayed,
      // switch to the latest available image in the history.
      const isDeletingCurrent =
        activePhoto.imageUrl ===
        activePhoto.history.find((h) => h.id === historyId)?.imageUrl

      const newImageUrl = isDeletingCurrent
        ? newHistory[newHistory.length - 1].imageUrl
        : activePhoto.imageUrl

      const newHistoryItem = isDeletingCurrent
        ? newHistory[newHistory.length - 1]
        : activePhoto.history.find(
            (h) => h.id === (activePhoto.selectedHistoryId || ''),
          )

      if (isDeletingCurrent && newHistoryItem) {
        setPrompt(newHistoryItem.prompt)
      }

      isInternalUpdate.current = true
      updatePhoto({
        ...activePhoto,
        history: newHistory,
        imageUrl: newImageUrl,
        selectedHistoryId: newHistory[newHistory.length - 1].id,
      })
    }
  }

  const selectedHistoryId = activePhoto?.selectedHistoryId || null

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </div>
        <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md font-bold">
          {aspectRatio} · {resolution}
        </div>
      </CardHeader>
      <CardContent className="flex-grow grid grid-rows-[auto_1fr_auto] gap-4">
        {/* Settings */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">{t('environment')}</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-2">
              {environments
                .filter((e) => e.imageUrl)
                .map((env) => (
                  <div
                    key={env.id}
                    className={`relative aspect-square group rounded-md cursor-pointer ${
                      selectedEnvironmentId === env.id
                        ? 'ring-2 ring-offset-2 ring-blue-500'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedEnvironmentId(
                        selectedEnvironmentId === env.id ? null : env.id,
                      )
                    }
                  >
                    <Image
                      src={env.imageUrl!}
                      alt={env.name}
                      fill
                      className="rounded-md object-cover border"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs rounded-b-md">
                      <p className="font-bold truncate">{env.name}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">{t('characters')}</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-2">
              {characters
                .filter((c) => c.imageUrl)
                .map((char) => (
                  <div
                    key={char.id}
                    className={`relative aspect-square group rounded-md cursor-pointer ${
                      selectedCharacterIds.has(char.id)
                        ? 'ring-2 ring-offset-2 ring-blue-500'
                        : ''
                    }`}
                    onClick={() => handleCharacterSelection(char.id)}
                  >
                    <Image
                      src={char.imageUrl!}
                      alt={char.name}
                      fill
                      className="rounded-md object-cover border"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute top-1 right-1 z-10">
                      <Checkbox
                        id={char.id}
                        checked={selectedCharacterIds.has(char.id)}
                        onCheckedChange={() =>
                          handleCharacterSelection(char.id)
                        }
                        className="bg-background"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs rounded-b-md">
                      <p className="font-bold truncate">{char.name}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="story-prompt" className="text-sm font-medium">
                {t('photoPrompt')}
              </label>
              <div className="flex items-center space-x-2">
                <div>
                  <Select
                    value={selectedStyle}
                    onValueChange={(value) =>
                      setSelectedStyle(value as PhotoshootStyle)
                    }
                  >
                    <SelectTrigger id="style-select" className="h-8 text-xs">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStyles().map((style) => (
                        <SelectItem
                          key={style}
                          value={style}
                          className="text-xs"
                        >
                          {t(`styles.${style}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <InspireButton
                  onClick={handleInspire}
                  disabled={isInspiring || selectedCharacterIds.size === 0}
                  isLoading={isInspiring}
                />
              </div>
            </div>
            <Textarea
              id="story-prompt"
              placeholder={t('photoPromptPlaceholder')}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Image Display */}
        <div
          className="relative flex items-center justify-center bg-muted rounded-lg group border-2 border-dashed"
          onMouseLeave={() => setIsDeleting(false)}
          onDoubleClick={() => activePhoto && setIsFinetuneModalOpen(true)}
        >
          {activePhoto ? (
            <>
              <img
                src={activePhoto.imageUrl!}
                alt="Generated photo"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <div className="absolute top-1 left-1 right-1 z-10 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="h-8 w-8 bg-black/50 hover:bg-black/75"
                >
                  <Download className="h-4 w-4 text-white" />
                </Button>
                <div className="flex items-center space-x-1">
                  <div className="relative">
                    {isDeleting ? (
                      <Button
                        onClick={handleDeleteClick}
                        className="h-8 w-8 text-white border-0"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.75)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'rgba(239, 68, 68, 0.75)'
                        }}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleDeleteClick}
                        className="h-8 w-8 text-white border-0"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.75)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'rgba(239, 68, 68, 0.75)'
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFinetuneModalOpen(true)}
                    className="h-8 w-8 bg-black/50 hover:bg-black/75"
                  >
                    <Pencil className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </>
          ) : isGenerating ? (
            <div className="p-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-2">
              <ImageIcon className="h-10 w-10 mb-2 text-gray-400 inline-block" />
              <p>{t('imagePlaceholder')}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => handleGenerate()}
          disabled={isGenerating || selectedCharacterIds.size === 0 || !prompt}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {t('generateButton')}
        </Button>
      </CardContent>
      {activePhoto && activePhoto.history && (
        <ImageFinetuneModal
          isOpen={isFinetuneModalOpen}
          onClose={() => setIsFinetuneModalOpen(false)}
          imageHistory={activePhoto.history}
          selectedHistoryId={selectedHistoryId || undefined}
          onGenerate={handleFinetune}
          onSelect={handleSelectHistory}
          onDelete={handleDeleteHistory}
          onReferenceImageChange={() => {}}
        />
      )}
    </Card>
  )
}
