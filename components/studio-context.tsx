'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
  MutableRefObject,
  useCallback,
} from 'react'
import {
  IStudioProject,
  ICharacterAsset,
  IEnvironmentAsset,
  IPhoto,
} from '@/types'

// Define the shape of the context
interface StudioContextType extends IStudioProject {
  setProject: Dispatch<SetStateAction<IStudioProject>>
  addCharacter: (character: ICharacterAsset) => void
  updateCharacter: (character: ICharacterAsset) => void
  deleteCharacter: (characterId: string) => void
  addEnvironment: (environment: IEnvironmentAsset) => void
  updateEnvironment: (environment: IEnvironmentAsset) => void
  deleteEnvironment: (environmentId: string) => void
  addPhoto: (photo: IPhoto) => void
  updatePhoto: (photo: IPhoto) => void
  deletePhoto: (photoId: string) => void
  isUserUploadingRef: MutableRefObject<boolean>
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  resetProject: () => void
}

// Create the context with a default value
const StudioContext = createContext<StudioContextType | undefined>(undefined)

// Create the provider component
export function StudioProvider({
  children,
  textModel,
  imageModel,
}: {
  children: ReactNode
  textModel: string
  imageModel: string
}) {
  const getInitialProjectState = useCallback(
    () => ({
      characters: [],
      environments: [],
      photos: [],
      artStyle: 'cinematic, hyperrealistic',
      aspectRatio: '4:3',
      resolution: '1K',
      textModel: textModel,
      imageModel: imageModel,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    }),
    [textModel, imageModel],
  )

  const [project, setProject] = useState<IStudioProject>(
    getInitialProjectState(),
  )
  const [currentPage, setCurrentPage] = useState(1)
  const isUserUploadingRef = useRef(false)

  const addCharacter = (character: ICharacterAsset) => {
    setProject((prev) => ({
      ...prev,
      characters: [...prev.characters, character],
    }))
  }

  const updateCharacter = (updatedCharacter: ICharacterAsset) => {
    setProject((prev) => ({
      ...prev,
      characters: prev.characters.map((c) =>
        c.id === updatedCharacter.id ? updatedCharacter : c,
      ),
    }))
  }

  const deleteCharacter = (characterId: string) => {
    setProject((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== characterId),
    }))
  }

  const addEnvironment = (environment: IEnvironmentAsset) => {
    setProject((prev) => ({
      ...prev,
      environments: [...prev.environments, environment],
    }))
  }

  const updateEnvironment = (updatedEnvironment: IEnvironmentAsset) => {
    setProject((prev) => ({
      ...prev,
      environments: prev.environments.map((e) =>
        e.id === updatedEnvironment.id ? updatedEnvironment : e,
      ),
    }))
  }

  const deleteEnvironment = (environmentId: string) => {
    setProject((prev) => ({
      ...prev,
      environments: prev.environments.filter((e) => e.id !== environmentId),
    }))
  }

  const addPhoto = (photo: IPhoto) => {
    setProject((prev) => ({
      ...prev,
      photos: [...prev.photos, photo],
    }))
  }

  const updatePhoto = (updatedPhoto: IPhoto) => {
    setProject((prev) => ({
      ...prev,
      photos: prev.photos.map((p) =>
        p.id === updatedPhoto.id ? updatedPhoto : p,
      ),
    }))
  }

  const deletePhoto = (photoId: string) => {
    setProject((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId),
    }))
  }

  const resetProject = useCallback(() => {
    setProject(getInitialProjectState())
    setCurrentPage(1)
  }, [getInitialProjectState])

  const value: StudioContextType = {
    ...project,
    setProject,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addEnvironment,
    updateEnvironment,
    deleteEnvironment,
    addPhoto,
    updatePhoto,
    deletePhoto,
    isUserUploadingRef,
    currentPage,
    setCurrentPage,
    resetProject,
  }

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}

// Create a custom hook for easy access to the context
export function useStudio() {
  const context = useContext(StudioContext)
  if (context === undefined) {
    throw new Error('useStudio must be used within a StudioProvider')
  }
  return context
}
