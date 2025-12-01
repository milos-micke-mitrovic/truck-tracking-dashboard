import type { ElementType, ReactNode } from 'react'
import { cn } from '@/shared/utils'

type TextColor =
  | 'default'
  | 'muted'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'

const colorClasses: Record<TextColor, string> = {
  default: '',
  muted: 'text-muted-foreground',
  error: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
}

type TypographyProps = {
  children: ReactNode
  className?: string
  id?: string
  color?: TextColor
  uppercase?: boolean
  lowercase?: boolean
  capitalize?: boolean
  truncate?: boolean
  nowrap?: boolean
  italic?: boolean
}

function getTextClasses({
  color = 'default',
  uppercase,
  lowercase,
  capitalize,
  truncate,
  nowrap,
  italic,
}: Omit<TypographyProps, 'children' | 'className' | 'id'>) {
  return cn(
    colorClasses[color],
    uppercase && 'uppercase',
    lowercase && 'lowercase',
    capitalize && 'capitalize',
    truncate && 'truncate',
    nowrap && 'whitespace-nowrap',
    italic && 'italic'
  )
}

type HeadingProps = TypographyProps & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function H1({
  children,
  className,
  as: Tag = 'h1',
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn('text-h1', getTextClasses(props), className)}>
      {children}
    </Tag>
  )
}

export function H2({
  children,
  className,
  as: Tag = 'h2',
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn('text-h2', getTextClasses(props), className)}>
      {children}
    </Tag>
  )
}

export function H3({
  children,
  className,
  as: Tag = 'h3',
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn('text-h3', getTextClasses(props), className)}>
      {children}
    </Tag>
  )
}

export function H4({
  children,
  className,
  as: Tag = 'h4',
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn('text-h4', getTextClasses(props), className)}>
      {children}
    </Tag>
  )
}

type TextProps = TypographyProps & {
  as?: ElementType
}

export function Body({
  children,
  className,
  as: Tag = 'p',
  ...props
}: TextProps) {
  return (
    <Tag className={cn('text-body', getTextClasses(props), className)}>
      {children}
    </Tag>
  )
}

export function BodySmall({
  children,
  className,
  id,
  as: Tag = 'p',
  ...props
}: TextProps) {
  return (
    <Tag
      id={id}
      className={cn('text-body-sm', getTextClasses(props), className)}
    >
      {children}
    </Tag>
  )
}

export function Caption({
  children,
  className,
  as: Tag = 'span',
  color = 'muted',
  ...props
}: TextProps) {
  return (
    <Tag className={cn('text-xs', getTextClasses({ color, ...props }), className)}>
      {children}
    </Tag>
  )
}

export function Muted({
  children,
  className,
  id,
  as: Tag = 'p',
  ...props
}: TextProps) {
  return (
    <Tag
      id={id}
      className={cn('text-muted text-muted-foreground', getTextClasses(props), className)}
    >
      {children}
    </Tag>
  )
}

export function Label({
  children,
  className,
  as: Tag = 'span',
  ...props
}: TextProps) {
  return (
    <Tag className={cn('text-label', getTextClasses(props), className)}>
      {children}
    </Tag>
  )
}
