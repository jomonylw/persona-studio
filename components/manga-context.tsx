'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react'
import useLocalStorageState from '@/lib/hooks'
import { IMangaPage, IPanel, IProjectState, IStoryPlan } from '@/types'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

// 定义 Context 的类型
interface MangaContextType extends IProjectState {
  setGenre: Dispatch<SetStateAction<string>>
  setColorStyle: Dispatch<SetStateAction<string>>
  setStorySummary: Dispatch<SetStateAction<string>>
  setArtStyle: Dispatch<SetStateAction<string>>
  setArtStyleImage: Dispatch<SetStateAction<string | null>>
  setStoryPlan: Dispatch<SetStateAction<IStoryPlan | null>>
  setCharacters: Dispatch<SetStateAction<IProjectState['characters']>>
  setEnvironments: Dispatch<SetStateAction<IProjectState['environments']>>
  setPages: Dispatch<SetStateAction<IMangaPage[]>>
  setAspectRatio: Dispatch<SetStateAction<string>>
  setResolution: Dispatch<SetStateAction<string>>
  setTextModel: Dispatch<SetStateAction<string>>
  setImageModel: Dispatch<SetStateAction<string>>
  selectedAssetName: string
  setSelectedAssetName: Dispatch<SetStateAction<string>>
  textModels: string[]
  setTextModels: Dispatch<SetStateAction<string[]>>
  imageModels: string[]
  setImageModels: Dispatch<SetStateAction<string[]>>
  isFetchingModels: boolean
  fetchModels: () => Promise<void>
  updatePageSummary: (pageNumber: number, newSummary: string) => void
  updatePanelPrompt: (
    pageNumber: number,
    panelNumber: number,
    newPrompt: string,
  ) => void
  updatePanelImageUrl: (
    pageNumber: number,
    panelNumber: number,
    imageUrl: string,
  ) => void
  updatePage: (updatedPage: IMangaPage) => void
  inspirationConstraints: string
  setInspirationConstraints: Dispatch<SetStateAction<string>>
  resetProject: () => void
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPage: number
  isUserUploadingRef: MutableRefObject<boolean>
}

// 创建 Context，并提供一个默认值
const MangaContext = createContext<MangaContextType | undefined>(undefined)

// 创建一个 Provider 组件
export const MangaProvider = ({
  children,
  defaultTextModel,
  defaultImageModel,
}: {
  children: ReactNode
  defaultTextModel?: string
  defaultImageModel?: string
}) => {
  const t = useTranslations('GenerationSettings')
  const [genre, setGenre] = useState('')
  const [colorStyle, setColorStyle] = useState('bw')
  const [storySummary, setStorySummary] = useState('')
  const [artStyle, setArtStyle] = useState('')
  const [artStyleImage, setArtStyleImage] = useState<string | null>(null)
  const [storyPlan, setStoryPlan] = useState<IStoryPlan | null>(null)
  const [characters, setCharacters] = useState<IProjectState['characters']>([])
  const [environments, setEnvironments] = useState<
    IProjectState['environments']
  >([])
  const [pages, setPages] = useState<IMangaPage[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [aspectRatio, setAspectRatio] = useLocalStorageState(
    'aspectRatio',
    '3:4',
  )
  const [resolution, setResolution] = useLocalStorageState('resolution', '1K')
  const [textModel, setTextModel] = useLocalStorageState(
    'textModel',
    defaultTextModel || 'gemini-1.5-flash',
  )
  const [imageModel, setImageModel] = useLocalStorageState(
    'imageModel',
    defaultImageModel || 'gemini-1.5-pro-image-generation-preview',
  )
  const [selectedAssetName, setSelectedAssetName] = useState('')
  const [inspirationConstraints, setInspirationConstraints] = useState('')
  const [textModels, setTextModels] = useLocalStorageState<string[]>(
    'textModels',
    [],
  )
  const [imageModels, setImageModels] = useLocalStorageState<string[]>(
    'imageModels',
    [],
  )
  const [isFetchingModels, setIsFetchingModels] = useState(false)
  const isUserUploadingRef = useRef(false)

  const fetchModels = useCallback(async () => {
    setIsFetchingModels(true)
    try {
      const response = await fetch('/api/models')
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }
      const data = await response.json()
      if (data.textModels) {
        setTextModels(data.textModels)
      }
      if (data.imageModels) {
        setImageModels(data.imageModels)
      }
      toast.success(t('modelsUpdated'))
    } catch (error) {
      console.error('Failed to fetch models:', error)
      toast.error(t('modelsUpdateFailed'))
    } finally {
      setIsFetchingModels(false)
    }
  }, [setTextModels, setImageModels])

  useEffect(() => {
    // Fetch models on initial load if they are not already cached in local storage
    if (!textModels.length || !imageModels.length) {
      fetchModels()
    }
  }, [fetchModels, textModels.length, imageModels.length])

  const totalPage = pages.length > 0 ? pages.length : 1

  const updatePageSummary = useCallback(
    (pageNumber: number, newSummary: string) => {
      setPages((currentPages) =>
        currentPages.map((p) =>
          p.pageNumber === pageNumber ? { ...p, summary: newSummary } : p,
        ),
      )
    },
    [],
  )

  const updatePanelPrompt = useCallback(
    (pageNumber: number, panelNumber: number, newPrompt: string) => {
      setPages((currentPages) =>
        currentPages.map((p) =>
          p.pageNumber === pageNumber
            ? {
                ...p,
                panels: p.panels.map((panel) =>
                  panel.panelNumber === panelNumber
                    ? { ...panel, prompt: newPrompt }
                    : panel,
                ),
              }
            : p,
        ),
      )
    },
    [],
  )

  const updatePanelImageUrl = useCallback(
    (pageNumber: number, panelNumber: number, imageUrl: string) => {
      setPages((currentPages) => {
        const newPages = currentPages.map((p) => {
          if (p.pageNumber !== pageNumber) {
            return p
          }

          const newPanels = p.panels.map((panel) =>
            panel.panelNumber === panelNumber ? { ...panel, imageUrl } : panel,
          )

          const allPanelsGenerated = newPanels.every((panel) => panel.imageUrl)

          return {
            ...p,
            panels: newPanels,
            isGenerated: allPanelsGenerated,
            finalImageUrl: imageUrl, // Assuming one panel for now
          }
        })
        return newPages
      })
    },
    [],
  )

  const updatePage = useCallback((updatedPage: IMangaPage) => {
    setPages((currentPages) =>
      currentPages.map((p) => (p.id === updatedPage.id ? updatedPage : p)),
    )
  }, [])

  const resetProject = useCallback(() => {
    setGenre('')
    setColorStyle('bw')
    setStorySummary('')
    setArtStyle('')
    setArtStyleImage(null)
    setStoryPlan(null)
    setCharacters([])
    setEnvironments([])
    setPages([])
    setCurrentPage(1)
    // setAspectRatio('3:4')
    // setResolution('1K')
    // setTextModel('gemini-1.5-flash')
    // setImageModel('gemini-1.5-pro-image-generation-preview')
    setSelectedAssetName('')
    setInspirationConstraints('')
  }, [])

  const value = {
    genre,
    setGenre,
    colorStyle,
    setColorStyle,
    storySummary,
    setStorySummary,
    artStyle,
    setArtStyle,
    artStyleImage,
    setArtStyleImage,
    storyPlan,
    setStoryPlan,
    characters,
    setCharacters,
    environments,
    setEnvironments,
    pages,
    setPages,
    updatePageSummary,
    updatePanelPrompt,
    updatePanelImageUrl,
    updatePage,
    resetProject,
    currentPage,
    setCurrentPage,
    totalPage,
    aspectRatio,
    setAspectRatio,
    resolution,
    setResolution,
    textModel,
    setTextModel,
    imageModel,
    setImageModel,
    selectedAssetName,
    setSelectedAssetName,
    inspirationConstraints,
    setInspirationConstraints,
    textModels,
    setTextModels,
    imageModels,
    setImageModels,
    isFetchingModels,
    fetchModels,
    isUserUploadingRef,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
  }

  return <MangaContext.Provider value={value}>{children}</MangaContext.Provider>
}

// 创建一个自定义 Hook，方便在组件中使用
export const useManga = (): MangaContextType => {
  const context = useContext(MangaContext)
  if (context === undefined) {
    throw new Error('useManga must be used within a MangaProvider')
  }
  return context
}
