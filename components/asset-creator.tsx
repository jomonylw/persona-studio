'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useDropzone, FileRejection, Accept } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { useManga } from './manga-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { IAsset, IStoryPlan } from '@/types'
import { Loader2, CheckCircle2, Upload, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { InspireButton } from './inspire-button'
import { getPrompts, Locale } from '@/lib/prompts'
import { generateUUID } from '@/lib/utils'

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

interface AssetCreatorProps {
  existingAssets: IAsset[]
  onAssetCreated: (asset: IAsset) => void
  assetType: 'character' | 'environment'
  onAssetTypeChange: (type: 'character' | 'environment') => void
}

export function AssetCreator({
  existingAssets,
  onAssetCreated,
  assetType,
  onAssetTypeChange,
}: AssetCreatorProps) {
  const t = useTranslations('AssetCreator')
  const {
    artStyle,
    artStyleImage,
    storyPlan,
    selectedAssetName,
    setSelectedAssetName,
    textModel,
    imageModel,
  } = useManga()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isInspiring, setIsInspiring] = useState(false)
  const locale = useLocale() as Locale

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        toast.error(t('fileRejected'))
        return
      }

      if (acceptedFiles.length > 0) {
        if (!selectedAssetName.trim()) {
          toast.error(t('errorNameFirst'))
          return
        }

        const file = acceptedFiles[0]
        setIsUploading(true)
        toast.info(
          t('infoUploadingAsset', { assetType, name: selectedAssetName }),
        )

        try {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 512,
            useWebWorker: true,
          })
          const base64 = await fileToBase64(compressedFile)

          const existingAsset = existingAssets.find(
            (asset) => asset.name === selectedAssetName,
          )

          const newHistoryItem = {
            id: `hist-${generateUUID()}`,
            imageUrl: base64,
            prompt: existingAsset?.prompt || prompt,
            createdAt: new Date().toISOString(),
          }
          const newAsset: IAsset = {
            id: existingAsset?.id || generateUUID(),
            name: selectedAssetName,
            type: assetType,
            prompt: existingAsset?.prompt || prompt,
            imageUrl: base64,
            history: [newHistoryItem],
            selectedHistoryId: newHistoryItem.id,
          }

          onAssetCreated(newAsset)
          toast.success(
            t('successAssetUploaded', { assetType, name: selectedAssetName }),
          )

          setSelectedAssetName('')
          setPrompt('')
        } catch (error) {
          toast.error(t('compressionFailed'))
        } finally {
          setIsUploading(false)
        }
      }
    },
    [
      t,
      selectedAssetName,
      assetType,
      onAssetCreated,
      setSelectedAssetName,
      existingAssets,
      prompt,
    ],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] } as Accept,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  useEffect(() => {
    if (selectedAssetName) {
      const existingAsset = existingAssets.find(
        (asset) => asset.name === selectedAssetName,
      )
      if (existingAsset) {
        setPrompt(existingAsset.prompt)
      } else {
        // This case happens when a plan asset is selected but not yet created.
        // Or when the name is being typed manually.
        // We can choose to clear it or leave it, let's clear it for consistency.
        setPrompt('')
      }
    } else {
      // Clear prompt when name is cleared from parent
      setPrompt('')
    }
  }, [selectedAssetName, existingAssets])

  const handleNameChange = (newName: string) => {
    setSelectedAssetName(newName)
    // The prompt will be updated by the useEffect hook.
  }

  const handleInspire = async () => {
    // Button is disabled if !name, this is a safeguard.
    if (!selectedAssetName || !storyPlan) {
      toast.error(t('errorPlanFirst')) // Should cover both cases
      return
    }

    const plannedAssets =
      assetType === 'character' ? storyPlan.characters : storyPlan.environments
    const assetDetails = plannedAssets.find(
      (pAsset) => pAsset.name === selectedAssetName,
    )

    // This should not happen if the UI is consistent.
    if (!assetDetails) {
      console.error(
        'Selected asset not found in story plan:',
        selectedAssetName,
      )
      toast.error(t('errorSuggestionFailed'))
      return
    }

    setIsInspiring(true)
    toast.info(t('infoGeneratingPrompt', { name: assetDetails.name }))
    try {
      const response = await fetch('/api/inspire/asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetType,
          name: assetDetails.name,
          description: assetDetails.description,
          locale,
          model: textModel,
        }),
      })
      if (!response.ok) throw new Error('Failed to get suggestion.')

      const { prompt: newPrompt } = await response.json()
      setPrompt(newPrompt)

      // --- BEGIN MODIFICATION: Save asset immediately after inspiration ---
      const existingAsset = existingAssets.find(
        (asset) => asset.name === selectedAssetName,
      )

      const assetToSave: IAsset = {
        id: existingAsset?.id || generateUUID(),
        name: selectedAssetName,
        type: assetType,
        prompt: newPrompt,
        // Preserve existing image if it exists, otherwise it's undefined
        imageUrl: existingAsset?.imageUrl,
      }
      onAssetCreated(assetToSave)
      // --- END MODIFICATION ---

      toast.success(t('successSuggestion', { name: assetDetails.name }))
    } catch (error) {
      toast.error(t('errorSuggestionFailed'))
    } finally {
      setIsInspiring(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedAssetName.trim() || !prompt.trim()) {
      toast.error(t('errorNameAndPrompt'))
      return
    }

    setIsLoading(true)
    toast.info(t('infoGeneratingAsset', { assetType, name: selectedAssetName }))

    const prompts = getPrompts(locale)

    // Find the asset being edited, if any.
    const existingAsset = existingAssets.find(
      (asset) => asset.name === selectedAssetName,
    )

    // To maintain consistency, use another existing asset as a style reference.
    // Filter out the asset being edited to avoid using it as its own reference.
    const otherAssets = existingAssets.filter(
      (asset) => asset.id !== existingAsset?.id,
    )

    // Prioritize a consistent style from another asset.
    // If no other assets exist, fall back to the global art style image.
    const styleReferenceImage =
      otherAssets.length > 0 ? otherAssets[0].imageUrl : artStyleImage

    const fullPrompt = prompts.asset.generation(
      !!styleReferenceImage,
      assetType,
      selectedAssetName,
      prompt,
      artStyle,
    )

    try {
      let imageToSend = styleReferenceImage

      // If the art style image is a blob URL, we need to convert it to base64
      if (styleReferenceImage && styleReferenceImage.startsWith('blob:')) {
        const response = await fetch(styleReferenceImage)
        const blob = await response.blob()
        imageToSend = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          image: imageToSend,
          model: imageModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || t('errorGenerationFailed'))
      }

      const { imageUrl } = await response.json()
      if (!imageUrl) {
        throw new Error('Image URL not found in API response.')
      }

      const existingAsset = existingAssets.find(
        (asset) => asset.name === selectedAssetName,
      )

      const newImageUrl = imageUrl
      const newHistoryItem = {
        id: `hist-${generateUUID()}`,
        imageUrl: newImageUrl,
        prompt: prompt,
        createdAt: new Date().toISOString(),
      }

      // If there's an existing asset, we add to its history. Otherwise, start a new history.
      const baseHistory = existingAsset?.history || []

      const newAsset: IAsset = {
        id: existingAsset?.id || generateUUID(),
        name: selectedAssetName,
        type: assetType,
        prompt: prompt, // Store the user-editable prompt
        imageUrl: newImageUrl,
        history: [...baseHistory, newHistoryItem],
        selectedHistoryId: newHistoryItem.id,
      }

      onAssetCreated(newAsset)
      toast.success(
        t('successAssetCreated', { assetType, name: selectedAssetName }),
      )

      // Reset form
      setSelectedAssetName('')
      setPrompt('')
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : t('unknownError'))
    } finally {
      setIsLoading(false)
    }
  }

  const placeholderText =
    assetType === 'character'
      ? t('characterPromptPlaceholder')
      : t('environmentPromptPlaceholder')

  const plannedAssets = storyPlan
    ? assetType === 'character'
      ? storyPlan.characters
      : storyPlan.environments
    : []

  const isEditing = existingAssets.some(
    (asset) => asset.name === selectedAssetName && !!asset.imageUrl,
  )

  return (
    <div className="space-y-4">
      <Tabs
        value={assetType}
        onValueChange={(v) => {
          onAssetTypeChange(v as 'character' | 'environment')
          // Reset name and prompt when switching asset types
          setSelectedAssetName('')
          setPrompt('')
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="character">{t('character')}</TabsTrigger>
          <TabsTrigger value="environment">{t('environment')}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="asset-name">{t('name')}</Label>
        <div className="flex w-full items-center gap-2">
          {storyPlan ? (
            <div className="flex-grow min-w-0">
              <Select
                value={selectedAssetName}
                onValueChange={handleNameChange}
              >
                <SelectTrigger className="w-full truncate">
                  <SelectValue placeholder={t('selectAssetPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {plannedAssets
                    .filter((pAsset) => pAsset.name)
                    .map((pAsset) => {
                      const createdAsset = existingAssets.find(
                        (a) => a.name === pAsset.name,
                      )
                      const isCreated = !!createdAsset?.imageUrl
                      return (
                        <SelectItem key={pAsset.name} value={pAsset.name}>
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{pAsset.name}</span>
                            {isCreated && (
                              <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                            )}
                          </div>
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Input
              id="asset-name"
              placeholder={
                assetType === 'character'
                  ? t('characterNamePlaceholder')
                  : t('environmentNamePlaceholder')
              }
              value={selectedAssetName}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={isLoading || isUploading}
              className="flex-grow"
            />
          )}
          {storyPlan && (
            <InspireButton
              onClick={handleInspire}
              isLoading={isInspiring}
              disabled={!selectedAssetName || isLoading || isUploading}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="asset-prompt">{t('prompt')}</Label>
        <Textarea
          id="asset-prompt"
          placeholder={placeholderText}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading || isUploading}
          className="min-h-28"
        />
      </div>

      <div {...getRootProps()} className="hidden">
        <input {...getInputProps()} />
      </div>

      <div className="flex w-full items-center gap-2">
        <Button
          onClick={handleGenerate}
          disabled={isLoading || isUploading}
          className="flex-grow"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('generating')}
            </>
          ) : isEditing ? (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t('regenerate')}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t('generateAsset', { assetType: t(assetType) })}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={open}
          disabled={isLoading || isUploading || !selectedAssetName}
          aria-label={t('uploadAriaLabel')}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
