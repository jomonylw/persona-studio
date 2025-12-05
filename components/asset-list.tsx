import { useState, useMemo } from 'react'
import { IAsset, IImageHistory } from '@/types'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Download, Trash2, Check, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageFinetuneModal } from './image-finetune-modal'
import { toast } from 'sonner'

interface AssetListProps {
  title: string
  assets: IAsset[]
  selectedAssetName?: string
  onAssetClick?: (asset: IAsset) => void
  onDeleteAsset?: (assetId: string) => void
  onUpdateAsset: (asset: IAsset) => void
  imageModel?: string
}

export function AssetList({
  title,
  assets,
  selectedAssetName,
  onAssetClick,
  onDeleteAsset,
  onUpdateAsset,
  imageModel,
}: AssetListProps) {
  const t = useTranslations('AssetList')
  const [modalOpen, setModalOpen] = useState(false)
  const locale = useLocale()
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId),
    [assets, selectedAssetId],
  )
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null)

  const handleDeleteClick = (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation()
    if (deletingAssetId === assetId) {
      // 确认删除
      if (onDeleteAsset) {
        onDeleteAsset(assetId)
      }
      setDeletingAssetId(null)
    } else {
      // 进入确认状态
      setDeletingAssetId(assetId)
    }
  }

  const handleEditClick = (e: React.MouseEvent, asset: IAsset) => {
    e.stopPropagation()
    if (asset.imageUrl) {
      setSelectedAssetId(asset.id)
      setModalOpen(true)
    }
  }

  const handleGenerate = async (
    baseImage: IImageHistory,
    prompt: string,
    referenceImage: string | null,
  ) => {
    if (!selectedAsset) return

    toast.info(t('generatingNewImage', { name: selectedAsset.name }))

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
          asset: selectedAsset,
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

      // 3. Update the asset state with the new history item
      const newHistoryItem: IImageHistory = {
        id: `hist-${Date.now()}`,
        imageUrl: newImageUrl,
        prompt: prompt,
        createdAt: new Date().toISOString(),
      }

      const updatedAsset: IAsset = {
        ...selectedAsset,
        history: [...(selectedAsset.history || []), newHistoryItem],
        imageUrl: newHistoryItem.imageUrl, // Update main image to the new one
        selectedHistoryId: newHistoryItem.id,
      }

      onUpdateAsset(updatedAsset)
      // The parent state will update, and the selectedAsset will be recalculated by useMemo.
      toast.success(t('newImageGenerated', { name: selectedAsset.name }))
    } catch (error) {
      console.error('Finetuning generation failed:', error)
      toast.error(t('finetuningFailed'))
    }
  }

  const handleSelect = (historyId: string) => {
    if (!selectedAsset) return
    const historyItem = selectedAsset.history?.find((h) => h.id === historyId)
    if (!historyItem) return

    const updatedAsset: IAsset = {
      ...selectedAsset,
      selectedHistoryId: historyId,
      imageUrl: historyItem.imageUrl,
    }
    onUpdateAsset(updatedAsset)
    // Parent state update will flow down.
    setSelectedAssetId(updatedAsset.id)
  }

  const handleDelete = (historyId: string) => {
    if (!selectedAsset || !selectedAsset.history) return
    if (selectedAsset.history.length <= 1) {
      toast.error(t('cannotDeleteOnlyImage'))
      return
    }
    if (selectedAsset.selectedHistoryId === historyId) {
      toast.error(t('cannotDeleteSelectedImage'))
      return
    }

    const updatedHistory = selectedAsset.history.filter(
      (h) => h.id !== historyId,
    )
    const updatedAsset: IAsset = {
      ...selectedAsset,
      history: updatedHistory,
    }
    onUpdateAsset(updatedAsset)
    // Parent state update will flow down.
    setSelectedAssetId(updatedAsset.id)
  }

  const handleReferenceImageChange = (newReferenceImage: string | null) => {
    if (!selectedAsset) return
    const updatedAsset: IAsset = {
      ...selectedAsset,
      referenceImage: newReferenceImage,
    }
    onUpdateAsset(updatedAsset)
  }

  const handleDownload = async (
    e: React.MouseEvent,
    imageUrl: string,
    imageName: string,
  ) => {
    e.stopPropagation()
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${imageName}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const assetType = title === t('characters') ? 'characters' : 'environments'
  const completeAssets = assets.filter((asset) => asset.imageUrl)

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {completeAssets.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('noAssets', { assetType })}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
          {completeAssets.map((asset) => {
            const isSelected = asset.name === selectedAssetName
            return (
              <div
                key={asset.id}
                className={`relative aspect-square group rounded-md cursor-pointer ${
                  isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                onClick={() => onAssetClick && onAssetClick(asset)}
                onDoubleClick={(e) => handleEditClick(e, asset)}
                onMouseLeave={() => setDeletingAssetId(null)}
              >
                {asset.imageUrl ? (
                  <Image
                    src={asset.imageUrl}
                    alt={asset.name}
                    fill
                    className="rounded-md object-cover border"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-md border flex items-center justify-center">
                    <p className="text-xs text-gray-500">{t('noImage')}</p>
                  </div>
                )}
                <div className="absolute top-1 left-1 right-1 z-10 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  {asset.imageUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) =>
                        handleDownload(e, asset.imageUrl!, asset.name)
                      }
                      className="h-8 w-8 bg-black/50 hover:bg-black/75"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </Button>
                  )}
                  <div className="flex items-center space-x-1">
                    <div className="relative">
                      {deletingAssetId === asset.id ? (
                        // 确认删除状态 - 只显示确认按钮
                        <Button
                          onClick={(e) => handleDeleteClick(e, asset.id)}
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
                        // 普通状态 - 显示红色删除按钮
                        <Button
                          onClick={(e) => handleDeleteClick(e, asset.id)}
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
                      onClick={(e) => handleEditClick(e, asset)}
                      className="h-8 w-8 bg-black/50 hover:bg-black/75"
                    >
                      <Pencil className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs rounded-b-md">
                  <p className="font-bold truncate">{asset.name}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {selectedAsset && modalOpen && (
        <ImageFinetuneModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedAssetId(null)
          }}
          imageHistory={selectedAsset.history || []}
          selectedHistoryId={selectedAsset.selectedHistoryId}
          referenceImage={selectedAsset.referenceImage}
          onGenerate={handleGenerate}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onReferenceImageChange={handleReferenceImageChange}
        />
      )}
    </div>
  )
}
