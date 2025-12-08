'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useStudio } from './studio-context' // Use the new context
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox' // Import Checkbox
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ICharacterAsset,
  IPersonAppearance,
  IntlMessages,
  IImageHistory,
} from '@/types'
import { Loader2, Sparkles, ChevronsUpDown, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateUUID } from '@/lib/utils'
import { ImageUploader } from './image-uploader'
import { ImageFinetuneModal } from './image-finetune-modal'

interface CharacterEditorProps {
  onAssetCreated: (asset: ICharacterAsset) => void
  existingAsset?: ICharacterAsset | null
}

export function CharacterEditor({
  onAssetCreated,
  existingAsset,
}: CharacterEditorProps) {
  const t = useTranslations('CharacterEditor')
  const locale = useLocale()

  const snakeToCamel = (s: string) =>
    s.replace(/(_\w)/g, (m) => m[1].toUpperCase())

  // Helper function with type assertion to satisfy TypeScript
  const translateKey = (key: string) => {
    // First, convert snake_case to camelCase for lookup
    const camelKey = snakeToCamel(key)
    return t(camelKey as keyof IntlMessages['CharacterEditor'])
  }
  const {
    textModel,
    imageModel,
    updateCharacter,
    addCharacter,
    aspectRatio,
    resolution,
  } = useStudio()

  const [userIdea, setUserIdea] = useState('')
  const [isInspiring, setIsInspiring] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)

  const [descriptor, setDescriptor] = useState<IPersonAppearance | null>(
    existingAsset?.descriptor || null,
  )
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    existingAsset?.imageUrl,
  )
  const [isFinetuneModalOpen, setIsFinetuneModalOpen] = useState(false)
  const [currentAsset, setCurrentAsset] = useState<ICharacterAsset | null>(
    existingAsset || null,
  )

  useEffect(() => {
    setDescriptor(existingAsset?.descriptor || null)
    setImageUrl(existingAsset?.imageUrl)
    setCurrentAsset(existingAsset || null)
  }, [existingAsset])

  const handleInspire = async () => {
    if (!userIdea.trim() && !referenceImage) {
      toast.error(t('errorIdeaRequired'))
      return
    }
    setIsInspiring(true)
    toast.info(t('infoGeneratingDescriptor'))
    try {
      const response = await fetch('/api/inspire/character-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIdea,
          image: referenceImage,
          model: textModel,
          locale,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to get suggestion.')
      }
      const newDescriptor: IPersonAppearance = await response.json()
      console.log('LLM Response JSON:', JSON.stringify(newDescriptor, null, 2))
      setDescriptor(newDescriptor)
      toast.success(t('successDescriptorGenerated'))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('errorDescriptorFailed'),
      )
    } finally {
      setIsInspiring(false)
    }
  }

  const handleExpandIdea = async () => {
    setIsExpanding(true)
    toast.info(t('infoExpandingIdea'))
    try {
      const response = await fetch('/api/inspire/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIdea,
          model: textModel,
          locale,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to expand idea.')
      }
      const { text } = await response.json()
      setUserIdea(text)
      toast.success(t('successIdeaExpanded'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('errorIdeaFailed'))
    } finally {
      setIsExpanding(false)
    }
  }

  const handleGenerate = async () => {
    if (!descriptor) {
      toast.error(t('errorDescriptorRequired'))
      return
    }
    setIsGenerating(true)
    toast.info(t('infoGeneratingPortrait'))
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterDescriptor: descriptor,
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

      // Create or update the asset
      const newAsset: ICharacterAsset = {
        id: existingAsset?.id || generateUUID(),
        name: descriptor.person_appearance.basic_info.name,
        type: 'character',
        descriptor: descriptor,
        imageUrl: newImageUrl,
        history: [], // Initialize with an empty array
      }

      // --- History Management ---
      const newHistoryEntry: IImageHistory = {
        id: generateUUID(),
        imageUrl: newImageUrl,
        prompt: JSON.stringify(descriptor), // Storing the descriptor as prompt
        createdAt: new Date().toISOString(),
      }

      // Get the existing history, or initialize it.
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
          createdAt: new Date().toISOString(), // This might not be accurate, but it's a fallback
        })
      }

      newAsset.history = [...existingHistory, newHistoryEntry]
      newAsset.selectedHistoryId = newHistoryEntry.id // Select the latest image

      if (existingAsset) {
        updateCharacter(newAsset)
      } else {
        addCharacter(newAsset)
      }
      onAssetCreated(newAsset) // Keep this to notify parent components if needed

      toast.success(t('successPortraitGenerated'))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('errorPortraitFailed'),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFinetune = async (
    baseImage: IImageHistory,
    prompt: string,
    referenceImage: string | null,
  ) => {
    // Similar to handleGenerate, but for finetuning
    if (!descriptor) return
    setIsGenerating(true)
    toast.info(t('infoGeneratingPortrait'))
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterDescriptor: descriptor,
          model: imageModel,
          locale,
          aspectRatio,
          resolution,
          finetunePrompt: prompt,
          finetuneImage: baseImage.imageUrl,
          referenceImage: referenceImage,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to generate image.')
      }
      const { imageUrl: newImageUrl } = await response.json()
      // Create a new history entry and update the asset
      const newHistoryEntry: IImageHistory = {
        id: generateUUID(),
        imageUrl: newImageUrl,
        prompt: prompt,
        createdAt: new Date().toISOString(),
      }
      const updatedAsset: ICharacterAsset = {
        ...(existingAsset as ICharacterAsset),
        imageUrl: newImageUrl,
        history: [...(existingAsset?.history || []), newHistoryEntry],
        selectedHistoryId: newHistoryEntry.id,
      }
      updateCharacter(updatedAsset)
      onAssetCreated(updatedAsset)
      setImageUrl(newImageUrl) // Update local state to show the new image
      toast.success(t('successPortraitGenerated'))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('errorPortraitFailed'),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const updateDescriptorByPath = (
    path: string[],
    newValue: string | number | boolean,
  ) => {
    setDescriptor((prev) => {
      if (!prev) return null
      // Create a deep copy to avoid direct state mutation
      const newDescriptor = JSON.parse(JSON.stringify(prev))

      // Use a reducer to traverse and update the nested structure
      path
        .slice(0, -1)
        .reduce((acc, key) => acc[key] || (acc[key] = {}), newDescriptor)[
        path[path.length - 1]
      ] = newValue

      return newDescriptor
    })
  }

  // A single, simplified render function for form fields
  const renderField = (
    path: string[],
    value: string | number | boolean | null,
    isArrayItem: boolean,
  ) => {
    const key = path[path.length - 1]

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      updateDescriptorByPath(path, e.target.value)
    }

    const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return
      updateDescriptorByPath(path, checked)
    }

    // Render a checkbox for boolean values
    if (typeof value === 'boolean') {
      return (
        <div
          key={path.join('.')}
          className="grid grid-cols-3 items-center gap-4"
        >
          <Label htmlFor={path.join('.')} className="text-right">
            {translateKey(key)}
          </Label>
          <Checkbox
            id={path.join('.')}
            checked={value}
            onCheckedChange={handleCheckboxChange}
            className="col-span-2 justify-self-start"
          />
        </div>
      )
    }

    // Render an input for string, number, or null values
    return (
      <div
        key={path.join('.')}
        className={`grid items-center gap-4 ${
          isArrayItem ? 'grid-cols-1' : 'grid-cols-3'
        }`}
      >
        {!isArrayItem && (
          <Label htmlFor={path.join('.')} className="text-right">
            {translateKey(key)}
          </Label>
        )}
        <Input
          id={path.join('.')}
          value={String(value ?? '')}
          onChange={handleInputChange}
          className={!isArrayItem ? 'col-span-2' : ''}
        />
      </div>
    )
  }

  // Type helper for recursive rendering
  type Renderable =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Renderable }
    | Renderable[]

  // The new, robust recursive rendering function
  const renderProperties = (
    data: Renderable,
    path: string[],
  ): React.ReactNode => {
    // Case 1: It's an array. Iterate over items.
    if (Array.isArray(data)) {
      return data.map((item, index) => {
        const itemPath = [...path, String(index)]
        // If item is an object (e.g., in 'significant_features'), recursively render it inside a bordered div.
        if (typeof item === 'object' && item !== null) {
          return (
            <div
              key={index}
              className="space-y-4 pt-4 border-t first:border-t-0 first:pt-0"
            >
              {renderProperties(item, itemPath)}
            </div>
          )
        }
        // If item is a primitive (e.g., a string in 'accessories'), render a field for it.
        return renderField(itemPath, item, true) // Pass true for isArrayItem
      })
    }

    // Case 2: It's an object. Iterate over key-value pairs.
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => {
        const newPath = [...path, key]
        // If value is an object or array, it's a subsection with a title.
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={newPath.join('.')} className="w-full space-y-2">
              <h5 className="text-base font-semibold">{translateKey(key)}</h5>
              <div className="pl-4 border-l space-y-4 pt-2 mt-2">
                {renderProperties(value, newPath)}
              </div>
            </div>
          )
        }
        // If value is a primitive, it's a simple field with a label.
        return renderField(
          newPath,
          value as string | number | boolean | null,
          false,
        )
      })
    }

    return null
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* 1. Reference Image Uploader (Top) */}
        <div className="space-y-2">
          <Label>{t('referenceImage')}</Label>
          <ImageUploader image={referenceImage} setImage={setReferenceImage} />
        </div>

        {/* 2. User Idea Textarea (Middle) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="user-idea">{t('ideaLabel')}</Label>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExpandIdea}
              disabled={isExpanding || isInspiring}
            >
              {isExpanding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Textarea
            id="user-idea"
            placeholder={t('ideaPlaceholder')}
            value={userIdea}
            onChange={(e) => setUserIdea(e.target.value)}
            disabled={isInspiring || isExpanding}
            className="min-h-[120px] text-base"
          />
        </div>

        {/* 3. Generate Button (Bottom) */}
        <Button
          onClick={handleInspire}
          disabled={isInspiring}
          className="w-full"
        >
          {isInspiring ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {t('inspireButton')}
        </Button>
      </div>

      {descriptor && (
        <Card>
          <CardHeader>
            <CardTitle>
              {descriptor.person_appearance.basic_info.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {imageUrl && (
              <div
                className="w-full aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setIsFinetuneModalOpen(true)}
              >
                <img
                  src={imageUrl}
                  alt="Character Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

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

            {/* This is a simplified editor. A real implementation would be more complex. */}
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
                {t('detailsSectionTitle')}
                <ChevronsUpDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {Object.entries(descriptor.person_appearance).map(
                  ([section, values]) => (
                    <div key={section} className="space-y-4 pt-4">
                      <h4 className="text-lg font-semibold border-b pb-2 mb-2">
                        {translateKey(section)}
                      </h4>
                      <div className="space-y-4">
                        {renderProperties(values, [
                          'person_appearance',
                          section,
                        ])}
                      </div>
                    </div>
                  ),
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}
      {currentAsset && isFinetuneModalOpen && (
        <ImageFinetuneModal
          isOpen={isFinetuneModalOpen}
          onClose={() => setIsFinetuneModalOpen(false)}
          imageHistory={currentAsset.history || []}
          selectedHistoryId={currentAsset.selectedHistoryId}
          referenceImage={referenceImage}
          onGenerate={handleFinetune}
          onSelect={(id) => {
            const selectedImage = currentAsset.history?.find((h) => h.id === id)
            if (selectedImage) {
              const updatedAsset = {
                ...currentAsset,
                selectedHistoryId: id,
                imageUrl: selectedImage.imageUrl,
              } as ICharacterAsset
              updateCharacter(updatedAsset)
              setCurrentAsset(updatedAsset)
              setImageUrl(selectedImage.imageUrl)
            }
          }}
          onDelete={(id) => {
            const newHistory = currentAsset.history?.filter((h) => h.id !== id)
            const updatedAsset = {
              ...currentAsset,
              history: newHistory,
            } as ICharacterAsset
            updateCharacter(updatedAsset)
            setCurrentAsset(updatedAsset)
          }}
          onReferenceImageChange={setReferenceImage}
        />
      )}
    </div>
  )
}
