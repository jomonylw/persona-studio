'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IEnvironmentAsset } from '@/types'
import { EnvironmentEditor } from './environment-editor'
import { ImageUploader } from './image-uploader'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useStudio } from './studio-context'
import { generateUUID } from '@/lib/utils'

interface EnvironmentCreatorProps {
  onAssetCreated: (asset: IEnvironmentAsset) => void
  existingAsset?: IEnvironmentAsset | null
}

export function EnvironmentCreator({
  onAssetCreated,
  existingAsset,
}: EnvironmentCreatorProps) {
  const t = useTranslations('EnvironmentCreator')
  const locale = useLocale()
  const { addEnvironment } = useStudio()

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

  const handleCreateEnvironment = () => {
    if (!name.trim()) {
      toast.error(t('errorNameRequired'))
      return
    }
    if (!image) {
      toast.error(t('errorImageRequired'))
      return
    }

    setIsCreating(true)

    const newAsset: IEnvironmentAsset = {
      id: generateUUID(),
      name: name,
      type: 'environment',
      prompt: `A scene of ${name}`, // A default prompt
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

    toast.success(t('successEnvironmentCreated'))

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
            <EnvironmentEditor
              onAssetCreated={onAssetCreated}
              existingAsset={existingAsset}
            />
          </TabsContent>
          <TabsContent value="upload" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="environment-name">
                {t('environmentNameLabel')}
              </Label>
              <Input
                id="environment-name"
                placeholder={t('environmentNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('environmentImageLabel')}</Label>
              <ImageUploader image={image} setImage={setImage} />
            </div>
            <Button
              onClick={handleCreateEnvironment}
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
