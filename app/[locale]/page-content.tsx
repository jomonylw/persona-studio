'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useManga } from '@/components/manga-context'
import { StoryFoundation } from '@/components/story-foundation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AssetCreator } from '@/components/asset-creator'
import { AssetList } from '@/components/asset-list'
import { PageGenerator } from '@/components/page-generator'
import { MangaViewer } from '@/components/manga-viewer'
import { IAsset, IProjectState } from '@/types'
import { GenerationSettingsModal } from '@/components/generation-settings-modal'
import { GenerationSettingsDisplay } from '@/components/generation-settings-display'
import { Header } from '@/components/header'

export default function ProjectPage() {
  const t = useTranslations('Index')
  const t_assetCreator = useTranslations('AssetCreator')
  const t_assetList = useTranslations('AssetList')
  const t_pageGenerator = useTranslations('PageGenerator')

  const mangaState = useManga()
  const {
    storyPlan,
    artStyle,
    artStyleImage,
    characters,
    environments,
    storySummary,
    selectedAssetName,
    setSelectedAssetName,
    setGenre,
    setColorStyle,
    setStorySummary,
    setArtStyle,
    setArtStyleImage,
    setStoryPlan,
    setCharacters,
    setEnvironments,
    setPages,
    setAspectRatio,
    setResolution,
    imageModel,
    setTextModel,
    setImageModel,
    isUserUploadingRef,
  } = mangaState

  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set(),
  )
  const [assetType, setAssetType] = useState<'character' | 'environment'>(
    'character',
  )
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleAssetSelection = (asset: IAsset) => {
    setSelectedAssetName(asset.name)
    setAssetType(asset.type)
  }

  const handleAssetCreated = (newAsset: IAsset) => {
    const updateAssets = (prevAssets: IAsset[]) => {
      const assetIndex = prevAssets.findIndex(
        (asset) => asset.name === newAsset.name,
      )
      if (assetIndex > -1) {
        const updatedAssets = [...prevAssets]
        updatedAssets[assetIndex] = newAsset
        return updatedAssets
      } else {
        return [...prevAssets, newAsset]
      }
    }

    if (newAsset.type === 'character') {
      setCharacters(updateAssets)
    } else {
      setEnvironments(updateAssets)
    }
  }

  const handleDeleteAsset = (assetId: string) => {
    setCharacters((prev) => prev.filter((asset) => asset.id !== assetId))
    setEnvironments((prev) => prev.filter((asset) => asset.id !== assetId))
  }

  const handleUpdateAsset = (updatedAsset: IAsset) => {
    const updateLogic = (prevAssets: IAsset[]) => {
      return prevAssets.map((asset) =>
        asset.id === updatedAsset.id ? updatedAsset : asset,
      )
    }

    if (updatedAsset.type === 'character') {
      setCharacters(updateLogic)
    } else {
      setEnvironments(updateLogic)
    }
  }

  const finalArtStylePrompt = storyPlan ? storyPlan.detailedArtStyle : artStyle

  const gatherProjectState = (): IProjectState => {
    return {
      ...mangaState,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    }
  }

  const restoreProjectState = (newState: IProjectState) => {
    setGenre(newState.genre)
    setColorStyle(newState.colorStyle)
    setStorySummary(newState.storySummary)
    setArtStyle(newState.artStyle)
    setArtStyleImage(newState.artStyleImage || null)
    setStoryPlan(newState.storyPlan || null)
    setCharacters(newState.characters)
    setEnvironments(newState.environments)
    setPages(newState.pages)
    setAspectRatio(newState.aspectRatio)
    setResolution(newState.resolution)
    if (newState.textModel) {
      setTextModel(newState.textModel)
    }
    if (newState.imageModel) {
      setImageModel(newState.imageModel)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <GenerationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <Header
        gatherProjectState={gatherProjectState}
        restoreProjectState={restoreProjectState}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <StoryFoundation />
          <Card>
            <CardHeader>
              <CardTitle>{t_assetCreator('title')}</CardTitle>
              <CardDescription>{t_assetCreator('description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AssetCreator
                onAssetCreated={handleAssetCreated}
                existingAssets={[...characters, ...environments]}
                assetType={assetType}
                onAssetTypeChange={setAssetType}
              />
              <hr className="border-dashed" />
              <AssetList
                title={t_assetList('characters')}
                assets={characters}
                selectedAssetName={selectedAssetName}
                onAssetClick={handleAssetSelection}
                onDeleteAsset={handleDeleteAsset}
                onUpdateAsset={handleUpdateAsset}
                imageModel={imageModel}
              />
              <AssetList
                title={t_assetList('environments')}
                assets={environments}
                selectedAssetName={selectedAssetName}
                onAssetClick={handleAssetSelection}
                onDeleteAsset={handleDeleteAsset}
                onUpdateAsset={handleUpdateAsset}
                imageModel={imageModel}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t_pageGenerator('title')}</CardTitle>
                <GenerationSettingsDisplay />
              </div>
              <CardDescription>
                {t_pageGenerator('description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageGenerator
                storySummary={
                  storyPlan ? storyPlan.detailedStorySummary : storySummary
                }
                artStyle={finalArtStylePrompt}
                artStyleImage={artStyleImage}
                characters={characters}
                environments={environments}
                storyPlan={storyPlan}
                selectedAssetIds={selectedAssetIds}
                setSelectedAssetIds={setSelectedAssetIds}
              />
            </CardContent>
          </Card>
          <MangaViewer />
        </div>
      </div>
    </div>
  )
}
