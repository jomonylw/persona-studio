'use client'

import { StudioProvider } from '@/components/studio-context'
import { ReactNode } from 'react'

export default function ProjectProvider({
  children,
  textModel,
  imageModel,
}: {
  children: ReactNode
  textModel: string
  imageModel: string
}) {
  return (
    <StudioProvider textModel={textModel} imageModel={imageModel}>
      {children}
    </StudioProvider>
  )
}
