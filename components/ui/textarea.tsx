import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { X } from 'lucide-react'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, value, onChange, ...props }, ref) => {
    const handleClear = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      const nativeEvent = new Event('input', { bubbles: true })
      const textarea = e.currentTarget
        .closest('.relative')
        ?.querySelector('textarea')
      if (textarea) {
        Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value',
        )?.set?.call(textarea, '')
        textarea.dispatchEvent(nativeEvent)
      }
    }

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        {value && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
