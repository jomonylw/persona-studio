'use client'

import { useManga } from './manga-context'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

export const GenerationSettingsDisplay = () => {
  const { aspectRatio, resolution } = useManga()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md font-bold">
        {aspectRatio} &middot; {resolution}
      </span>
    </div>
  )
}
