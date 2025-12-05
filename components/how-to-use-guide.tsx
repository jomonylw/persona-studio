// file: app/components/how-to-use-guide.tsx

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function HowToUseGuide() {
  const t = useTranslations('HowToUseGuide')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step1Title')}</h3>
              <p>{t('step1Intro')}</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  {t.rich('step1Option1', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich('step1Option2', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
                <li>
                  {t.rich('step1Option3', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
              </ul>
              <p>
                {t.rich('step1Outro', {
                  strong: (chunks) => (
                    <strong className="text-primary">{chunks}</strong>
                  ),
                })}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step2Title')}</h3>
              <p>{t('step2Intro')}</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  {t.rich('step2Option1', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
                <li>
                  {t.rich('step2Option2', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step3Title')}</h3>
              <p>{t('step3Intro')}</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  {t.rich('step3Option1', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
                <li>
                  {t.rich('step3Option2', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
                <li>{t('step3Option3')}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step4Title')}</h3>
              <p>{t('step4Intro')}</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  {t.rich('step4Option1', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich('step4Option2', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
                <li>
                  {t.rich('step4Option3', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                  })}
                </li>
                <li>
                  {t.rich('step4Option4', {
                    strong: (chunks) => (
                      <strong className="text-primary">{chunks}</strong>
                    ),
                    destructive: (chunks) => (
                      <strong className="text-destructive">{chunks}</strong>
                    ),
                  })}
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
