'use client'

import { useManga } from './manga-context'
import { useTranslations } from 'next-intl'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { IStoryPlan } from '@/types'
import { ChevronsUpDown, Trash2, Plus, RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { EditableTruncatedText } from './editable-truncated-text'

const PlanSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
)

const PageBreakdownSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2 rounded-lg border bg-background p-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    ))}
  </>
)

interface StoryPlanEditorProps {
  isPlanning: boolean
  isRegeneratingPages: boolean
  onRegeneratePages: () => void
}

export function StoryPlanEditor({
  isPlanning,
  isRegeneratingPages,
  onRegeneratePages,
}: StoryPlanEditorProps) {
  const t = useTranslations('StoryFoundation')
  const { storyPlan, setStoryPlan, pages, updatePageSummary } = useManga()

  // Handlers for editing the plan directly
  const handlePlanChange = (
    field: keyof IStoryPlan,
    value: IStoryPlan[keyof IStoryPlan],
  ) => {
    setStoryPlan((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handlePlanListItemChange = (
    list: 'characters' | 'environments' | 'pages',
    index: number,
    field: string,
    value: string | number,
  ) => {
    setStoryPlan((prev) => {
      if (!prev) return null
      const newList = [...prev[list]]
      const item = newList[index]
      if (item && typeof item === 'object' && field in item) {
        newList[index] = { ...item, [field]: value }
      }
      return { ...prev, [list]: newList }
    })
  }

  const handleAddItem = (list: 'characters' | 'environments') => {
    setStoryPlan((prev) => {
      if (!prev) return null
      const newItem = { name: '', description: '' }
      const newList = [...prev[list], newItem]
      return { ...prev, [list]: newList }
    })
  }

  const handleDeleteItem = (
    list: 'characters' | 'environments',
    index: number,
  ) => {
    setStoryPlan((prev) => {
      if (!prev) return null
      const newList = [...prev[list]]
      newList.splice(index, 1)
      return { ...prev, [list]: newList }
    })
  }

  return (
    <div className="space-y-4">
      {isPlanning && <PlanSkeleton />}
      {!isPlanning && storyPlan && (
        <div className="space-y-4 p-4 bg-muted rounded-lg border">
          <EditableTruncatedText
            label={t('storyDetails')}
            value={storyPlan.detailedStorySummary}
            onChange={(v) => handlePlanChange('detailedStorySummary', v)}
          />
          <EditableTruncatedText
            label={t('artStyleDetails')}
            value={storyPlan.detailedArtStyle}
            onChange={(v) => handlePlanChange('detailedArtStyle', v)}
          />

          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center px-2"
              >
                <h4 className="font-semibold">
                  {t('characters')} ({storyPlan.characters.length})
                </h4>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 p-2">
              {storyPlan.characters.map((char, i) => (
                <div
                  key={i}
                  className="space-y-1.5 p-2 border bg-background rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={char.name}
                      onChange={(e) =>
                        handlePlanListItemChange(
                          'characters',
                          i,
                          'name',
                          e.target.value,
                        )
                      }
                      placeholder={t('characterNamePlaceholder')}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => handleDeleteItem('characters', i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={char.description}
                    onChange={(e) =>
                      handlePlanListItemChange(
                        'characters',
                        i,
                        'description',
                        e.target.value,
                      )
                    }
                    placeholder={t('characterDescriptionPlaceholder')}
                    className="text-xs"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => handleAddItem('characters')}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('addCharacter')}
              </Button>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center px-2"
              >
                <h4 className="font-semibold">
                  {t('environments')} ({storyPlan.environments.length})
                </h4>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 p-2">
              {storyPlan.environments.map((env, i) => (
                <div
                  key={i}
                  className="space-y-1.5 p-2 border bg-background rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={env.name}
                      onChange={(e) =>
                        handlePlanListItemChange(
                          'environments',
                          i,
                          'name',
                          e.target.value,
                        )
                      }
                      placeholder={t('environmentNamePlaceholder')}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => handleDeleteItem('environments', i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={env.description}
                    onChange={(e) =>
                      handlePlanListItemChange(
                        'environments',
                        i,
                        'description',
                        e.target.value,
                      )
                    }
                    placeholder={t('environmentDescriptionPlaceholder')}
                    className="text-xs"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => handleAddItem('environments')}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('addEnvironment')}
              </Button>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center px-2">
                <h4 className="font-semibold">
                  {t('pageBreakdown')} (
                  {isRegeneratingPages ? '...' : storyPlan.pages.length})
                </h4>
                <span
                  role="button"
                  aria-label={t('regeneratePages')}
                  title={t('regeneratePages')}
                  className={`ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md ${
                    isPlanning || isRegeneratingPages
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-background'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!isPlanning && !isRegeneratingPages) {
                      onRegeneratePages()
                    }
                  }}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRegeneratingPages ? 'animate-spin' : ''
                    }`}
                  />
                </span>
                <ChevronsUpDown className="h-4 w-4 ml-auto" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 p-2">
              {isRegeneratingPages ? (
                <PageBreakdownSkeleton />
              ) : (
                pages.length > 0 &&
                pages.map((page, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 border bg-background rounded-lg"
                  >
                    <b className="pt-2 text-sm">{page.pageNumber}.</b>
                    <Textarea
                      value={page.summary}
                      onChange={(e) =>
                        updatePageSummary(page.pageNumber, e.target.value)
                      }
                      placeholder={t('pageDescriptionPlaceholder')}
                      className="text-xs"
                    />
                  </div>
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  )
}
