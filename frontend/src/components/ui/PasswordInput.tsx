'use client'

import { useState, useCallback } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PasswordRule {
  label: string
  test: (p: string) => boolean
}

const passwordRules: PasswordRule[] = [
  { label: 'Al menos 8 caracteres', test: (p) => p.length >= 8 },
  { label: 'Una letra mayúscula', test: (p) => /[A-Z]/.test(p) },
  { label: 'Una letra minúscula', test: (p) => /[a-z]/.test(p) },
  { label: 'Un número', test: (p) => /\d/.test(p) },
  { label: 'Sin espacios', test: (p) => !/\s/.test(p) },
]

function getStrength(p: string): number {
  return passwordRules.filter((r) => r.test(p)).length
}

function getStrengthColor(count: number): string {
  if (count <= 1) return 'bg-red-500'
  if (count <= 3) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getStrengthLabel(count: number): string {
  if (count <= 1) return 'Débil'
  if (count <= 3) return 'Media'
  return 'Fuerte'
}

interface PasswordInputProps
  extends Omit<React.ComponentProps<'input'>, 'type'> {
  showStrength?: boolean
  onValidityChange?: (valid: boolean) => void
}

export function PasswordInput({
  className,
  showStrength = false,
  onValidityChange,
  value = '',
  onChange,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const password = typeof value === 'string' ? value : ''
  const strength = getStrength(password)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      const newVal = e.target.value
      const valid = newVal.length >= 8 && getStrength(newVal) === 5
      onValidityChange?.(valid)
    },
    [onChange, onValidityChange]
  )

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={visible ? 'text' : 'password'}
          className={cn('pe-9', className)}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          className="absolute inset-y-0 end-0 flex items-center pr-2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      {showStrength && (
        <>
          <div className="flex gap-1 h-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 rounded-full transition-colors duration-300',
                  i < strength ? getStrengthColor(strength) : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className="text-xs !mt-1 font-medium text-muted-foreground">
            Fortaleza: <span className="font-semibold">{getStrengthLabel(strength)}</span>
          </p>

          {password.length > 0 && (
            <div className="!mt-1.5">
              <p className="text-xs text-muted-foreground mb-1.5">
                La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número. Sin espacios.
              </p>
              <ul className="space-y-0.5">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password)
                  return (
                    <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                      <span className={passed ? 'text-green-500' : 'text-muted-foreground'}>
                        {passed ? '✓' : '◌'}
                      </span>
                      <span className={passed ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                        {rule.label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function isPasswordStrong(password: string): boolean {
  return password.length >= 8 && passwordRules.every((r) => r.test(password))
}
