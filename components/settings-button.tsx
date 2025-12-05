'use client'

import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface SettingsButtonProps {
  onClick: () => void
}

export const SettingsButton = ({ onClick }: SettingsButtonProps) => {
  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      <Settings className="h-4 w-4" />
    </Button>
  )
}
