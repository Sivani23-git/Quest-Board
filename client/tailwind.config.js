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
        bg: {
          main: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          hover: '#F1F5F9',
          border: '#E2E8F0',
        },
        brand: {
          primary: '#3B82F6',
          hover: '#2563EB',
          accent: '#38BDF8',
          glow: 'rgba(59, 130, 246, 0.15)',
        },
        difficulty: {
          easy: '#10B981',
          medium: '#F59E0B',
          hard: '#F97316',
          epic: '#8B5CF6',
          legendary: '#EC4899',
        },
        rarity: {
          common: '#64748B',
          rare: '#3B82F6',
          epic: '#8B5CF6',
          legendary: '#F59E0B',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        rpg: {
          xp: '#F59E0B',
          coins: '#EAB308',
          streak: '#F97316',
          level: '#3B82F6',
          achievement: '#A855F7',
        },
        lang: {
          python: '#14B8A6',
          javascript: '#EAB308',
          java: '#F97316',
          cpp: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        pixel: ['"Pixelify Sans"', '"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}

