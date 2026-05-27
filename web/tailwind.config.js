/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FBF8F4',
          card: '#FFFFFF',
          subtle: '#F3EDE3',
          dark: '#1F1B17',
        },
        ink: {
          DEFAULT: '#1F1B17',
          muted: '#6B6259',
          subtle: '#A39A8E',
          inverse: '#FBF8F4',
        },
        accent: {
          DEFAULT: '#E66F3A',
          dark: '#C45724',
          subtle: '#FFE6D5',
        },
        ok: '#3F8F5C',
        warn: '#C49A2C',
        danger: '#C4452C',
        border: {
          DEFAULT: '#E8DFD0',
          strong: '#D2C5B0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 27, 23, 0.04), 0 4px 12px rgba(31, 27, 23, 0.06)',
        card: '0 2px 8px rgba(31, 27, 23, 0.06), 0 12px 32px rgba(31, 27, 23, 0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
