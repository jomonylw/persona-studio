import { MangaProvider } from '@/components/manga-context'
import { ReactNode } from 'react'
export default async function ProjectProvider({
  children,
}: {
  children: ReactNode
}) {
  const defaultTextModel = process.env.GEMINI_TEXT_MODEL
  const defaultImageModel = process.env.GEMINI_IMAGE_MODEL

  return (
    <MangaProvider
      defaultTextModel={defaultTextModel}
      defaultImageModel={defaultImageModel}
    >
      {children}
    </MangaProvider>
  )
}
