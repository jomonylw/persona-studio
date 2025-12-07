'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ICharacterAsset, IPersonAppearance } from '@/types'
import { CharacterEditor } from './character-editor'
import { ImageUploader } from './image-uploader'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useStudio } from './studio-context'
import { generateUUID } from '@/lib/utils'

interface CharacterCreatorProps {
  onAssetCreated: (asset: ICharacterAsset) => void
  existingAsset?: ICharacterAsset | null
}

export function CharacterCreator({
  onAssetCreated,
  existingAsset,
}: CharacterCreatorProps) {
  const t = useTranslations('CharacterCreator')
  const locale = useLocale()
  const { addCharacter } = useStudio()

  const [name, setName] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (existingAsset) {
      setName(existingAsset.name)
      setImage(existingAsset.imageUrl || null)
    } else {
      setName('')
      setImage(null)
    }
  }, [existingAsset])

  const handleCreateCharacter = () => {
    if (!name.trim()) {
      toast.error(t('errorNameRequired'))
      return
    }
    if (!image) {
      toast.error(t('errorImageRequired'))
      return
    }

    setIsCreating(true)

    // Create a minimal descriptor
    const minimalDescriptor: IPersonAppearance = {
      person_appearance: {
        basic_info: {
          name: name,
          perceived_age: '',
          gender: 'Other',
          ethnicity: '',
        },
        body: { height: { value: 0, unit: 'cm' }, build: '' },
        head_and_face: {
          face_shape: '',
          skin: { tone: '' },
          hair: { color: '', length: '', style: '' },
          eyes: { color: '', shape: '' },
        },
        clothing_and_accessories: { style_vibe: '' },
        expression_and_mood: { primary_emotion: '' },
      },
    }

    const newAsset: ICharacterAsset = {
      id: generateUUID(),
      name: name,
      type: 'character',
      descriptor: minimalDescriptor,
      imageUrl: image,
      history: [
        {
          id: generateUUID(),
          imageUrl: image,
          prompt: 'Initial upload',
          createdAt: new Date().toISOString(),
        },
      ],
      selectedHistoryId: undefined, // Explicitly set for clarity
    }

    onAssetCreated(newAsset) // Notify parent

    toast.success(t('successCharacterCreated'))

    // Reset form
    setName('')
    setImage(null)
    setIsCreating(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">{t('tabGenerate')}</TabsTrigger>
            <TabsTrigger value="upload">{t('tabUpload')}</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="pt-4">
            <CharacterEditor
              onAssetCreated={onAssetCreated}
              existingAsset={existingAsset}
            />
          </TabsContent>
          <TabsContent value="upload" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="character-name">{t('characterNameLabel')}</Label>
              <Input
                id="character-name"
                placeholder={t('characterNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('characterImageLabel')}</Label>
              <ImageUploader image={image} setImage={setImage} />
            </div>
            <Button
              onClick={handleCreateCharacter}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {t('createButton')}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
