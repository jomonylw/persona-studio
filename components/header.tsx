'use client'

import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ModeToggle } from '@/components/theme-toggle'
// import { HowToUseGuide } from '@/components/how-to-use-guide'
import { Button } from '@/components/ui/button'
import { Github, Upload, Download, RotateCcw } from 'lucide-react'
import { exportProject, importProject } from '@/lib/utils'
import { useRef, useState } from 'react'
import { IStudioProject } from '@/types'
import { useStudio } from './studio-context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
// import { GenerationSettingsDisplay } from './generation-settings-display'
import { SettingsButton } from './settings-button'
import { GenerationSettingsModal } from './generation-settings-modal'

interface HeaderProps {
  gatherProjectState: () => IStudioProject
  restoreProjectState: (newState: IStudioProject) => void
}

export function Header({
  gatherProjectState,
  restoreProjectState,
}: HeaderProps) {
  const t = useTranslations('Index')
  const tDialog = useTranslations('ResetDialog')
  const { resetProject } = useStudio()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleExport = async () => {
    const currentState = gatherProjectState()
    await exportProject(currentState)
  }

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        console.log('Starting project import...')
        const importedState = (await importProject(file)) as IStudioProject
        console.log('Project import successful, state:', importedState)
        restoreProjectState(importedState)
        console.log('restoreProjectState called.')
      } catch (error) {
        console.error('Failed to import project:', error)
        alert(
          `Error importing project: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ModeToggle />
        {/* <HowToUseGuide /> */}
        <Button
          variant="outline"
          size="icon"
          title={t('importProject')}
          onClick={handleImportClick}
        >
          <Download className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".zip"
          className="hidden"
        />
        <Button
          variant="outline"
          size="icon"
          title={t('exportProject')}
          onClick={handleExport}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
              title={t('resetProject')}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{tDialog('title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {tDialog('description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tDialog('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={resetProject}
                className="bg-destructive hover:bg-destructive/90"
              >
                {tDialog('confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <GenerationSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </header>
  )
}
