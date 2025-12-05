'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { defaultLocale, locales } from '../i18n'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()

  const handleChange = (newLocale: string) => {
    let newPath = pathname

    if (newPath.startsWith(`/${locale}`)) {
      newPath = newPath.substring(locale.length + 1)
      if (newPath === '') {
        newPath = '/'
      }
    }

    if (newLocale !== defaultLocale) {
      if (newPath === '/') {
        newPath = `/${newLocale}`
      } else {
        newPath = `/${newLocale}${newPath}`
      }
    }

    router.replace(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem key={loc} onClick={() => handleChange(loc)}>
            {loc === 'en' ? 'English' : '中文'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
