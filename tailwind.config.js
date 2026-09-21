/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090C12',
        surface: {
          DEFAULT: '#0F1522',
          50: '#182030',
          100: '#131A29',
          200: '#1E293B',
          300: '#334155',
        },
        // Core specified palette: Red, Blue, Green, Black, Gray
        brand: {
          red: '#EF4444',
          'red-hover': '#DC2626',
          'red-glow': 'rgba(239, 68, 68, 0.4)',
          blue: '#2563EB',
          'blue-light': '#3B82F6',
          'blue-glow': 'rgba(37, 99, 235, 0.4)',
          green: '#10B981',
          'green-light': '#34D399',
          'green-glow': 'rgba(16, 185, 129, 0.4)',
          black: '#090C12',
          'black-pure': '#05070A',
          gray: '#64748B',
          'gray-dark': '#1E293B',
          'gray-light': '#94A3B8',
          'gray-border': 'rgba(255, 255, 255, 0.08)',
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
        pixel: ['"Pixelify Sans"', '"Silkscreen"', 'monospace'],
        silkscreen: ['"Silkscreen"', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(37, 99, 235, 0.45)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.45)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
