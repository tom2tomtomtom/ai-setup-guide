---
name: tailwind-design-system
description: Create design systems with Tailwind CSS including component patterns, theme configuration, and design tokens. Use when building a component library, establishing design tokens, or setting up responsive theme customization.
---

# Tailwind Design System

Comprehensive guide for building design systems with Tailwind CSS, covering component patterns, theme customization, design tokens, composition strategies, and production best practices.

## When to Use This Skill

Use when:
- Building a component library with Tailwind CSS
- Creating a design system for multiple projects
- Implementing consistent design tokens (colors, spacing, typography)
- Setting up theme configuration and customization
- Building reusable UI components
- Implementing responsive design patterns
- Optimizing Tailwind for production
- Migrating from CSS/Sass to Tailwind
- Establishing team design standards

## Design System Foundation

### Tailwind Configuration

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Semantic colors
        success: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#065f46',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#92400e',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#991b1b',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'display': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
        'hard': '0 10px 40px 0 rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
```

### Design Tokens

**Design tokens as TypeScript constants:**
```typescript
// lib/design-tokens.ts
export const colors = {
  brand: {
    primary: '#0ea5e9',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
} as const
```

## Component Patterns

### Button Component

**Full-featured button with variants:**
```typescript
// components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-white hover:bg-brand-600',
        destructive: 'bg-error text-white hover:bg-error-dark',
        outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-100',
        ghost: 'hover:bg-neutral-100',
        link: 'text-brand-500 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Usage:**
```typescript
<Button variant="default" size="md">Click me</Button>
<Button variant="destructive" loading>Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon">
  <IconTrash />
</Button>
```

### Input Component

```typescript
// components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:ring-error',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
```

**Usage:**
```typescript
<Input 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
/>

<Input 
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>
```

### Card Component

```typescript
// components/ui/Card.tsx
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-neutral-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-500', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Usage:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Create Account</CardTitle>
    <CardDescription>
      Enter your details to create a new account
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form>{/* form fields */}</form>
  </CardContent>
  <CardFooter>
    <Button>Create Account</Button>
  </CardFooter>
</Card>
```

### Badge Component

```typescript
// components/ui/Badge.tsx
import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-100 text-brand-700',
        success: 'bg-success-light text-success-dark',
        warning: 'bg-warning-light text-warning-dark',
        error: 'bg-error-light text-error-dark',
        outline: 'border border-neutral-300 text-neutral-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

**Usage:**
```typescript
<Badge variant="default">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
```

### Modal/Dialog Component

```typescript
// components/ui/Dialog.tsx
'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Dialog container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessDialog.Panel
              className={cn(
                'w-full rounded-lg bg-white p-6 shadow-xl',
                sizeClasses[size]
              )}
            >
              {children}
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <HeadlessDialog.Title className="text-lg font-semibold leading-6 text-neutral-900">
      {children}
    </HeadlessDialog.Title>
  )
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return (
    <HeadlessDialog.Description className="mt-2 text-sm text-neutral-500">
      {children}
    </HeadlessDialog.Description>
  )
}
```

**Usage:**
```typescript
'use client'

import { useState } from 'react'
import { Dialog, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open} onClose={() => setOpen(false)} size="md">
        <DialogTitle>Delete Account</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete your account? This action cannot be undone.
        </DialogDescription>
        
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </Dialog>
    </>
  )
}
```

## Utility Functions

### Class Name Merger (cn)

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage:**
```typescript
// Merges classes and handles conflicts
cn('px-4 py-2', 'px-6') // → 'py-2 px-6'

// Conditional classes
cn('base-class', isActive && 'active-class', {
  'selected': isSelected,
  'disabled': isDisabled
})
```

## Responsive Design Patterns

### Mobile-First Approach

```typescript
// Start with mobile, add breakpoints up
<div className="
  flex flex-col        // Mobile: stack vertically
  sm:flex-row          // Small screens: horizontal
  lg:gap-8             // Large screens: more spacing
">
  <div className="
    w-full             // Mobile: full width
    sm:w-1/2           // Small: half width
    lg:w-1/3           // Large: one third
  ">
    Content
  </div>
</div>
```

### Responsive Typography

```typescript
<h1 className="
  text-2xl           // Mobile: 24px
  sm:text-3xl        // Small: 30px
  lg:text-4xl        // Large: 36px
  xl:text-5xl        // XL: 48px
  font-bold
  leading-tight      // Tighter line height for headings
">
  Responsive Heading
</h1>

<p className="
  text-sm            // Mobile: 14px
  md:text-base       // Medium: 16px
  lg:text-lg         // Large: 18px
  leading-relaxed    // More breathing room
">
  Responsive paragraph text
</p>
```

### Container Patterns

```typescript
// Centered container with max width
<div className="
  container          // Max width with responsive padding
  mx-auto            // Center horizontally
  px-4               // Mobile padding
  sm:px-6            // Small: more padding
  lg:px-8            // Large: even more
">
  Content
</div>

// Full-bleed on mobile, contained on desktop
<div className="
  w-full
  lg:max-w-7xl
  lg:mx-auto
  lg:px-8
">
  Content
</div>
```

### Grid Layouts

```typescript
// Responsive grid
<div className="
  grid
  grid-cols-1        // Mobile: 1 column
  sm:grid-cols-2     // Small: 2 columns
  lg:grid-cols-3     // Large: 3 columns
  xl:grid-cols-4     // XL: 4 columns
  gap-4              // Gap between items
  sm:gap-6
  lg:gap-8
">
  {items.map(item => (
    <div key={item.id} className="...">
      {item.content}
    </div>
  ))}
</div>
```

## Advanced Patterns

### Class Variance Authority (CVA)

```typescript
// components/ui/Alert.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  // Base styles
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-neutral-50 text-neutral-900 border-neutral-200',
        success: 'bg-success-light text-success-dark border-success',
        warning: 'bg-warning-light text-warning-dark border-warning',
        error: 'bg-error-light text-error-dark border-error',
      },
      size: {
        sm: 'text-sm p-3',
        md: 'text-base p-4',
        lg: 'text-lg p-5',
      },
    },
    compoundVariants: [
      {
        variant: 'error',
        size: 'lg',
        class: 'font-semibold',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
}

export function Alert({ 
  className, 
  variant, 
  size, 
  icon,
  children,
  ...props 
}: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant, size }), className)}
      role="alert"
      {...props}
    >
      {icon && <div className="mr-3">{icon}</div>}
      <div className="flex-1">{children}</div>
    </div>
  )
}
```

### Custom Plugins

```typescript
// tailwind.config.ts
import plugin from 'tailwindcss/plugin'

const config: Config = {
  // ...
  plugins: [
    plugin(function({ addUtilities, addComponents, theme }) {
      // Add custom utilities
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
      })

      // Add custom components
      addComponents({
        '.btn': {
          padding: theme('spacing.2') + ' ' + theme('spacing.4'),
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.semibold'),
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.md'),
        },
      })
    }),
  ],
}
```

### Dark Mode

```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: 'class', // or 'media'
  // ...
}
```

**Component with dark mode:**
```typescript
<div className="
  bg-white dark:bg-neutral-900
  text-neutral-900 dark:text-white
  border border-neutral-200 dark:border-neutral-800
">
  Content that adapts to dark mode
</div>
```

**Toggle dark mode:**
```typescript
'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

### Animation Patterns

```typescript
// Fade in on scroll
<div className="
  opacity-0
  animate-fade-in
  [animation-delay:200ms]
">
  Content
</div>

// Hover animations
<button className="
  transition-all
  duration-200
  hover:scale-105
  hover:shadow-lg
  active:scale-95
">
  Hover me
</button>

// Loading spinner
<div className="
  h-8 w-8
  animate-spin
  rounded-full
  border-4
  border-neutral-200
  border-t-brand-500
" />

// Pulse effect
<div className="
  animate-pulse
  bg-neutral-200
  rounded
">
  Loading skeleton
</div>
```

## Layout Patterns

### Sidebar Layout

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="
        w-64
        bg-neutral-900
        text-white
        overflow-y-auto
        hidden
        lg:block
      ">
        <nav className="p-4">
          {/* Navigation items */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="
        flex-1
        overflow-y-auto
        bg-neutral-50
      ">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### Header with Navigation

```typescript
export function Header() {
  return (
    <header className="
      sticky top-0 z-50
      bg-white
      border-b border-neutral-200
      backdrop-blur-sm
      bg-white/90
    ">
      <div className="container mx-auto px-4">
        <div className="
          flex items-center justify-between
          h-16
        ">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold text-lg">
              Brand
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/features" className="
              text-neutral-600
              hover:text-neutral-900
              transition-colors
            ">
              Features
            </a>
            <a href="/pricing" className="...">
              Pricing
            </a>
            <Button>Get Started</Button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden">
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
```

### Centered Content Layout

```typescript
export function CenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      min-h-screen
      flex items-center justify-center
      bg-gradient-to-br from-brand-50 to-purple-50
      p-4
    ">
      <div className="
        w-full
        max-w-md
        space-y-6
      ">
        {children}
      </div>
    </div>
  )
}
```

## Form Patterns

### Form Layout

```typescript
export function SignupForm() {
  return (
    <form className="space-y-6">
      {/* Form header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Sign up to get started
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          required
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
        />
        
        <Input
          label="Password"
          type="password"
          required
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full">
        Sign Up
      </Button>

      {/* Alternative actions */}
      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <a href="/login" className="
          text-brand-500
          hover:text-brand-600
          font-medium
        ">
          Sign in
        </a>
      </p>
    </form>
  )
}
```

### Inline Validation

```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'

export function FormWithValidation() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (value: string) => {
    if (!value) {
      setError('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError('Invalid email address')
    } else {
      setError('')
    }
  }

  return (
    <Input
      label="Email"
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value)
        validateEmail(e.target.value)
      }}
      error={error}
    />
  )
}
```

## Typography System

### Text Styles

```typescript
// Headings
<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
  Display Heading
</h1>

<h2 className="text-3xl font-semibold">
  Section Heading
</h2>

<h3 className="text-xl font-medium">
  Subsection
</h3>

// Body text
<p className="text-base leading-relaxed text-neutral-700">
  Body text with comfortable line height
</p>

// Small text
<span className="text-sm text-neutral-500">
  Helper text or captions
</span>

// Label
<label className="text-sm font-medium text-neutral-900">
  Form Label
</label>
```

### Prose (Long-form Content)

```typescript
// Using @tailwindcss/typography
<article className="
  prose
  prose-neutral
  lg:prose-lg
  max-w-none
  prose-headings:font-semibold
  prose-a:text-brand-500
  prose-a:no-underline
  hover:prose-a:underline
">
  {/* Markdown content */}
  <h1>Article Title</h1>
  <p>Article content...</p>
</article>
```

## State Patterns

### Loading States

```typescript
// Skeleton loader
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-neutral-200 rounded w-3/4" />
  <div className="h-4 bg-neutral-200 rounded" />
  <div className="h-4 bg-neutral-200 rounded w-5/6" />
</div>

// Loading spinner
<div className="flex items-center justify-center p-8">
  <div className="
    h-12 w-12
    animate-spin
    rounded-full
    border-4
    border-neutral-200
    border-t-brand-500
  " />
</div>

// Button loading state
<Button disabled className="relative">
  <span className="opacity-0">Submit</span>
  <div className="
    absolute inset-0
    flex items-center justify-center
  ">
    <Spinner />
  </div>
</Button>
```

### Empty States

```typescript
function EmptyState() {
  return (
    <div className="
      flex flex-col items-center justify-center
      py-12 px-4
      text-center
    ">
      <div className="
        w-16 h-16
        mb-4
        rounded-full
        bg-neutral-100
        flex items-center justify-center
      ">
        <InboxIcon className="w-8 h-8 text-neutral-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        No messages yet
      </h3>
      
      <p className="text-neutral-600 mb-6 max-w-sm">
        When you receive messages, they'll appear here
      </p>
      
      <Button>Send your first message</Button>
    </div>
  )
}
```

### Error States

```typescript
function ErrorState({ 
  message,
  onRetry 
}: { 
  message: string
  onRetry: () => void 
}) {
  return (
    <div className="
      rounded-lg
      border border-error-light
      bg-error-light/50
      p-6
      text-center
    ">
      <div className="
        w-12 h-12
        mx-auto mb-4
        rounded-full
        bg-error-light
        flex items-center justify-center
      ">
        <AlertIcon className="w-6 h-6 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-error-dark mb-2">
        Something went wrong
      </h3>
      
      <p className="text-error-dark/80 mb-4">
        {message}
      </p>
      
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  )
}
```

## Performance Optimization

### Production Configuration

```typescript
// tailwind.config.ts
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Remove unused styles
  safelist: [
    // Only if you need dynamic classes
    'bg-red-500',
    'bg-green-500',
  ],
}
```

### Purge Unused Styles

```bash
# Build for production (automatic purging)
npm run build

# Verify bundle size
npm run analyze
```

### JIT (Just-In-Time) Mode

```typescript
// Enabled by default in Tailwind 3.x
// Generate classes on-demand
<div className="mt-[137px]">  {/* Arbitrary value */}
  Content
</div>

<div className="bg-[#1da1f2]">  {/* Arbitrary color */}
  Twitter blue
</div>
```

## Best Practices

### Do's ✅

- **Use design tokens** for consistency
- **Mobile-first** responsive design
- **Compose utilities** instead of custom CSS
- **Extract components** for reusable patterns
- **Use semantic color names** (success, error, warning)
- **Leverage Tailwind plugins** for forms, typography
- **Test responsive designs** at all breakpoints
- **Document component APIs** with TypeScript
- **Use CVA** for complex component variants
- **Optimize for production** (purge, minify)

### Don'ts ❌

- **Don't use inline styles** (defeats Tailwind's purpose)
- **Don't create custom CSS** when utilities exist
- **Don't use `@apply`** excessively (loses atomic benefits)
- **Don't forget accessibility** (focus states, ARIA)
- **Don't hardcode colors** (use theme values)
- **Don't skip responsive testing**
- **Don't over-abstract** too early
- **Don't use arbitrary values** unless necessary
- **Don't ignore dark mode** in modern apps
- **Don't forget to configure content paths**

## Common Patterns Reference

### Centering

```typescript
// Horizontal center
<div className="mx-auto">Content</div>

// Vertical center
<div className="flex items-center h-screen">Content</div>

// Both
<div className="flex items-center justify-center h-screen">
  Content
</div>

// Absolute center
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  Content
</div>
```

### Truncate Text

```typescript
// Single line
<p className="truncate">
  Very long text that will be cut off with ellipsis...
</p>

// Multiple lines
<p className="line-clamp-3">
  Text that will be limited to 3 lines with ellipsis...
</p>
```

### Aspect Ratios

```typescript
<div className="aspect-video">16:9 video</div>
<div className="aspect-square">1:1 square</div>
<div className="aspect-[4/3]">4:3 custom</div>
```

### Gradients

```typescript
<div className="bg-gradient-to-r from-blue-500 to-purple-500">
  Gradient background
</div>

<div className="bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50">
  Multi-stop gradient
</div>
```

### Hover Effects

```typescript
// Scale
<button className="transition hover:scale-105">Hover me</button>

// Shadow
<div className="transition hover:shadow-lg">Card</div>

// Opacity
<div className="hover:opacity-80">Image</div>

// Group hover
<div className="group">
  <img src="..." className="group-hover:scale-110 transition" />
  <p className="group-hover:text-brand-500">Caption</p>
</div>
```

## Tools & Resources

### Essential Packages

```bash
npm install tailwindcss postcss autoprefixer
npm install clsx tailwind-merge
npm install class-variance-authority
npm install @tailwindcss/forms
npm install @tailwindcss/typography
npm install @tailwindcss/aspect-ratio
```

### VS Code Extensions

- Tailwind CSS IntelliSense
- Headwind (class sorting)
- Prettier with Tailwind plugin

### Prettier Configuration

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["cn", "cva"]
}
```

### Testing

```typescript
// Test utility classes are applied
import { render } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

test('renders with correct variant', () => {
  const { container } = render(
    <Button variant="destructive">Delete</Button>
  )
  
  expect(container.firstChild).toHaveClass('bg-error')
})
```

## Quick Reference

### Spacing Scale
- `0` = 0px
- `px` = 1px
- `0.5` = 2px (0.125rem)
- `1` = 4px (0.25rem)
- `2` = 8px (0.5rem)
- `4` = 16px (1rem)
- `8` = 32px (2rem)
- `16` = 64px (4rem)

### Breakpoints
- `sm` = 640px
- `md` = 768px
- `lg` = 1024px
- `xl` = 1280px
- `2xl` = 1536px

### Common Patterns
```typescript
// Card
className="rounded-lg border bg-white p-6 shadow-sm"

// Button
className="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"

// Input
className="rounded-md border px-3 py-2 focus:ring-2 focus:ring-brand-500"

// Container
className="container mx-auto px-4"

// Grid
className="grid grid-cols-1 md:grid-cols-3 gap-4"
```

## Tailwind CSS v4

### Installation & Setup

**Vite Plugin (Recommended):**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

**PostCSS Plugin:**
```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

**CSS Entry Point:**
```css
/* app.css */
@import "tailwindcss";
```

**Upgrade from v3:**
```bash
npx @tailwindcss/upgrade
```

### CSS-First Configuration

**Theme Variables with @theme:**
```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-brand-50: #f0f9ff;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;

  /* Custom semantic colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-display: "Satoshi", sans-serif;
  --font-display--font-feature-settings: "cv02", "cv03";

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-128: 32rem;

  /* Breakpoints */
  --breakpoint-xs: 30rem;
  --breakpoint-3xl: 120rem;

  /* Container sizes */
  --container-8xl: 96rem;
}
```

### Custom Utilities with @utility

```css
/* Replaces @layer utilities and @layer components */
@utility tab-4 {
  tab-size: 4;
}

@utility btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ButtonFace;
}

/* Custom container (v4 removes center/padding config) */
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}

/* Scrollbar hide */
@utility scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Custom Variants with @custom-variant

```css
/* Dark mode with class toggle instead of media query */
@custom-variant dark (&:where(.dark, .dark *));

/* Custom theme variant */
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));

/* Override hover for touch devices (if needed) */
@custom-variant hover (&:hover);

/* Custom supports variant */
@custom-variant supports-grid {
  @supports (display: grid) {
    @slot;
  }
}
```

### @reference for Vue/Svelte Components

```vue
<template>
  <h1>Hello world!</h1>
</template>
<style>
  /* Import theme without duplicating CSS */
  @reference "../../app.css";

  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

**Or use CSS variables directly (better performance):**
```vue
<style scoped>
  h1 {
    color: var(--color-red-500);
    font-size: var(--text-2xl);
  }
</style>
```

### v4 Breaking Changes

**Ring Width (3px → 1px):**
```html
<!-- v3 -->
<button class="focus:ring">...</button>
<!-- v4 - explicitly use ring-3 -->
<button class="focus:ring-3 focus:ring-blue-500">...</button>
```

**Border Color (gray-200 → currentColor):**
```html
<!-- v4 - specify color explicitly -->
<div class="border border-gray-200">...</div>
```

**Important Modifier (moves to end):**
```html
<!-- v3 -->
<div class="!flex !bg-red-500">...</div>
<!-- v4 -->
<div class="flex! bg-red-500!">...</div>
```

**Outline (renamed):**
```html
<!-- v3 -->
<input class="focus:outline-none" />
<!-- v4 -->
<input class="focus:outline-hidden" />
```

**Shadow Scale Renamed:**
```html
<!-- v3: shadow-sm → v4: shadow-xs -->
<div class="shadow-xs">...</div>
<!-- v3: shadow → v4: shadow-sm -->
<div class="shadow-sm">...</div>
```

**CSS Variables Syntax:**
```html
<!-- v3 -->
<div class="bg-[--brand-color]">...</div>
<!-- v4 -->
<div class="bg-(--brand-color)">...</div>
```

### v4 New Features

**Gradient Preservation with Variants:**
```html
<!-- Dark variant preserves other gradient values -->
<div class="bg-gradient-to-r from-red-500 to-yellow-400 dark:from-blue-500">
  <!-- In v4: dark mode keeps to-yellow-400 -->
</div>

<!-- Explicitly unset with via-none -->
<div class="from-red-500 via-orange-400 to-yellow-400 dark:via-none dark:from-blue-500">
  ...
</div>
```

**Smarter Hover for Touch:**
```css
/* v4 hover only applies when device supports hover */
@media (hover: hover) {
  .hover\:underline:hover {
    text-decoration: underline;
  }
}
```

**Access Theme Values in JavaScript:**
```javascript
// Get computed theme variable
const styles = getComputedStyle(document.documentElement)
const shadow = styles.getPropertyValue('--shadow-xl')

// Use in animations (e.g., with Motion)
<motion.div animate={{ backgroundColor: "var(--color-blue-500)" }} />
```

**Load Legacy Config:**
```css
/* Incrementally migrate from JS config */
@config "../../tailwind.config.js";
```

### v4 Prefixes

```css
/* Configure prefix */
@import "tailwindcss" prefix(tw);

@theme {
  --font-display: "Satoshi", sans-serif;
  /* Generated as --tw-font-display */
}
```

```html
<!-- Prefix appears at start like a variant -->
<div class="tw:flex tw:bg-red-500 tw:hover:bg-red-600">...</div>
```