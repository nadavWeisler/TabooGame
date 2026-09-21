import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { assertNever } from '../game/helpers'

type ButtonVariant =
  | 'primary'
  | 'correct'
  | 'pass'
  | 'buzz'
  | 'ghost'
  | 'teamA'
  | 'teamB'
  | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

function variantClass(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return 'btn btn-primary'
    case 'correct':
      return 'btn btn-correct'
    case 'pass':
      return 'btn btn-pass'
    case 'buzz':
      return 'btn btn-buzz'
    case 'ghost':
      return 'btn btn-ghost'
    case 'teamA':
      return 'btn btn-team-a'
    case 'teamB':
      return 'btn btn-team-b'
    case 'danger':
      return 'btn btn-danger'
    default:
      return assertNever(variant)
  }
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${variantClass(variant)} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
