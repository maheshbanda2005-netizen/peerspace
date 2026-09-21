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
        // High-contrast pure black and white theme
        background: '#050505',
        surface: {
          DEFAULT: '#0D0D0D',
          50: '#141414',
          100: '#1A1A1A',
          200: '#262626',
          300: '#404040',
        },
        // Secondary accent colors: Red, Orange, Green
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          DEFAULT: '#EF4444',
        },
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          DEFAULT: '#F97316',
        },
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          DEFAULT: '#22C55E',
        },
        // Harmonize legacy Tailwind color classes to the strict Black/White + Red/Orange/Green system
        emerald: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        amber: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        rose: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
        cyan: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        blue: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        violet: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        indigo: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
      },
      // Strictly 3 fonts: Geist, Geist Mono, and Geist Pixel
      fontFamily: {
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
        pixel: ['"Pixelify Sans"', '"Silkscreen"', 'monospace'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.45)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.45)',
        'glow-green': '0 0 25px -5px rgba(34, 197, 94, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
        'pixel': '0 0 0 1px rgba(255, 255, 255, 0.15)',
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
