'use client'

import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStudio } from './studio-context'
import { Separator } from '@/components/ui/separator'
import { RotateCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface GenerationSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const aspectRatios = [
  'Auto',
  '1:1',
  '9:16',
  '16:9',
  '3:4',
  '4:3',
  '3:2',
  '2:3',
  '5:4',
  '4:5',
]
const resolutions = ['1K', '2K', '4K']

export const GenerationSettingsModal = ({
  isOpen,
  onClose,
}: GenerationSettingsModalProps) => {
  const t = useTranslations('GenerationSettings')
  const { aspectRatio, resolution, textModel, imageModel, setProject } =
    useStudio()

  const [textModels, setTextModels] = useState<string[]>([])
  const [imageModels, setImageModels] = useState<string[]>([])
  const [isFetchingModels, setIsFetchingModels] = useState(false)

  const fetchModels = async () => {
    setIsFetchingModels(true)
    try {
      const response = await fetch('/api/models')
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }
      const data = await response.json()
      setTextModels(data.textModels)
      setImageModels(data.imageModels)
      toast.success(t('modelsUpdated'))
    } catch (error) {
      console.error('Error fetching models:', error)
      toast.error(t('modelsUpdateFailed'))
    } finally {
      setIsFetchingModels(false)
    }
  }

  useEffect(() => {
    // The effect should only run once when the component mounts.
    fetchModels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleValueChange = (key: string, value: string) => {
    setProject((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">{t('imageSettings')}</h4>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="aspect-ratio" className="text-right">
                  {t('aspectRatio')}
                </Label>
                <Select
                  value={aspectRatio}
                  onValueChange={(v) => handleValueChange('aspectRatio', v)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('selectAspectRatio')} />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => {
                      const [w, h] = ratio.split(':').map(Number)
                      const isAuto = ratio === 'Auto'

                      return (
                        <SelectItem key={ratio} value={ratio}>
                          <div className="flex items-center justify-between w-full">
                            <div style={{ width: '40px' }}>
                              {!isAuto && (
                                <div
                                  className="border border-foreground/50 rounded-xs"
                                  style={{
                                    width: `${(w / h) * 20}px`,
                                    height: `20px`,
                                  }}
                                ></div>
                              )}
                            </div>
                            <span className="ml-2 flex-1 text-right">
                              {ratio}
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resolution" className="text-right">
                  {t('resolution')}
                </Label>
                <Select
                  value={resolution}
                  onValueChange={(v) => handleValueChange('resolution', v)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('selectResolution')} />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutions.map((res) => (
                      <SelectItem key={res} value={res}>
                        {res}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium leading-none">{t('modelSettings')}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchModels}
                disabled={isFetchingModels}
              >
                {isFetchingModels ? (
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RotateCw className="mr-2 h-4 w-4" />
                )}
                {t('update')}
              </Button>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text-model" className="text-right">
                  {t('textModel')}
                </Label>
                <Select
                  value={textModel}
                  onValueChange={(v) => handleValueChange('textModel', v)}
                >
                  <SelectTrigger className="col-span-3 truncate">
                    <SelectValue placeholder={t('selectTextModel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {textModels.map((model: string) => (
                      <SelectItem key={model} value={model}>
                        <span className="truncate">{model}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image-model" className="text-right">
                  {t('imageModel')}
                </Label>
                <Select
                  value={imageModel}
                  onValueChange={(v) => handleValueChange('imageModel', v)}
                >
                  <SelectTrigger className="col-span-3 truncate">
                    <SelectValue placeholder={t('selectImageModel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {imageModels.map((model: string) => (
                      <SelectItem key={model} value={model}>
                        <span className="truncate">{model}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
