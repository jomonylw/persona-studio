'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useStudio } from './studio-context'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IEnvironmentAsset, IImageHistory } from '@/types'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { generateUUID } from '@/lib/utils'
import { ImageUploader } from './image-uploader'
import { Input } from './ui/input'

interface EnvironmentEditorProps {
  onAssetCreated: (asset: IEnvironmentAsset) => void
  existingAsset?: IEnvironmentAsset | null
}

export function EnvironmentEditor({
  onAssetCreated,
  existingAsset,
}: EnvironmentEditorProps) {
  const t = useTranslations('EnvironmentEditor')
  const locale = useLocale()
  const {
    imageModel,
    updateEnvironment,
    addEnvironment,
    aspectRatio,
    resolution,
  } = useStudio()

  const [name, setName] = useState(existingAsset?.name || '')
  const [prompt, setPrompt] = useState(existingAsset?.prompt || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [referenceImage, setReferenceImage] = useState<string | null>(
    existingAsset?.referenceImage || null,
  )
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    existingAsset?.imageUrl,
  )

  useEffect(() => {
    setName(existingAsset?.name || '')
    setPrompt(existingAsset?.prompt || '')
    setImageUrl(existingAsset?.imageUrl)
    setReferenceImage(existingAsset?.referenceImage || null)
  }, [existingAsset])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(t('errorPromptRequired'))
      return
    }
    if (!name.trim()) {
      toast.error(t('errorNameRequired'))
      return
    }
    setIsGenerating(true)
    toast.info(t('infoGeneratingImage'))
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environmentPrompt: prompt,
          referenceImage: referenceImage,
          model: imageModel,
          locale,
          aspectRatio,
          resolution,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to generate image.')
      }
      const { imageUrl: newImageUrl } = await response.json()
      setImageUrl(newImageUrl)

      const newAsset: IEnvironmentAsset = {
        id: existingAsset?.id || generateUUID(),
        name: name,
        type: 'environment',
        prompt: prompt,
        imageUrl: newImageUrl,
        referenceImage: referenceImage,
        history: [],
      }

      const newHistoryEntry: IImageHistory = {
        id: generateUUID(),
        imageUrl: newImageUrl,
        prompt: prompt,
        createdAt: new Date().toISOString(),
      }

      const existingHistory = existingAsset?.history || []

      // If a reference image was used for inspiration and there's no history yet,
      // add the reference image as the first history item.
      if (referenceImage && existingHistory.length === 0) {
        existingHistory.push({
          id: generateUUID(),
          imageUrl: referenceImage,
          prompt: 'Reference Image',
          createdAt: new Date().toISOString(),
        })
      } else if (existingHistory.length === 0 && existingAsset?.imageUrl) {
        // If this is the first image being generated for an existing asset that doesn't have a history yet,
        // and it has a previous imageUrl, add that to the history first.
        existingHistory.push({
          id: generateUUID(),
          imageUrl: existingAsset.imageUrl,
          prompt: 'Initial image',
          createdAt: new Date().toISOString(),
        })
      }

      newAsset.history = [...existingHistory, newHistoryEntry]
      newAsset.selectedHistoryId = newHistoryEntry.id

      if (existingAsset) {
        updateEnvironment(newAsset)
      } else {
        addEnvironment(newAsset)
      }
      onAssetCreated(newAsset)

      toast.success(t('successImageGenerated'))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('errorImageFailed'),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="environment-name">{t('nameLabel')}</Label>
        <Input
          id="environment-name"
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('referenceImage')}</Label>
        <ImageUploader image={referenceImage} setImage={setReferenceImage} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="environment-prompt">{t('promptLabel')}</Label>
        <Textarea
          id="environment-prompt"
          placeholder={t('promptPlaceholder')}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          className="min-h-[120px] text-base"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {imageUrl ? t('regenerateButton') : t('generateButton')}
      </Button>

      {imageUrl && (
        <Card>
          <CardContent className="pt-6">
            <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Generated Environment"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
