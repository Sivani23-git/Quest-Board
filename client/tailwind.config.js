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
          main: '#0A0F1E',
          surface: '#111827',
          card: '#1A2236',
          hover: '#222E48',
          border: '#1E2D45',
        },
        brand: {
          primary: '#6C63FF',
          hover: '#5B52E0',
          accent: '#00D4FF',
          glow: 'rgba(108, 99, 255, 0.35)',
        },
        difficulty: {
          easy: '#22D3A0',
          medium: '#F59E0B',
          hard: '#F97316',
          epic: '#8B5CF6',
          legendary: '#EF4444',
        },
        rarity: {
          common: '#94A3B8',
          rare: '#60A5FA',
          epic: '#A78BFA',
          legendary: '#F59E0B',
        },
        status: {
          success: '#22D3A0',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#00D4FF',
        },
        text: {
          primary: '#E8ECF4',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(108, 99, 255, 0.2), 0 0 10px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.6), 0 0 30px rgba(0, 212, 255, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
