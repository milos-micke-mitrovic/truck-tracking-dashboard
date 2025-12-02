import { H4 } from '@/shared/ui/typography'
import { cn } from '@/shared/utils'

type FormSectionProps = {
  title: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-3 p-3 border rounded-lg', className)}>
      <H4 className="text-primary">{title}</H4>
      {children}
    </div>
  )
}
