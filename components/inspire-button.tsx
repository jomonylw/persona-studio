'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Wand2 } from 'lucide-react'

interface InspireButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled?: boolean
}

export function InspireButton({
  onClick,
  isLoading,
  disabled,
}: InspireButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={isLoading || disabled}
      title="Inspire Me"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="h-4 w-4" />
      )}
      <span className="sr-only">Inspire Me</span>
    </Button>
  )
}
