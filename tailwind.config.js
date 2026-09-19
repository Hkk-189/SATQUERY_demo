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
        sat: {
          950: '#06090d',
          900: '#090d13',
          850: '#0e141d',
          800: '#141d29',
          750: '#192534',
          700: '#203043',
          600: '#2c4159',
          500: '#3d5978',
          400: '#6281a4',
          300: '#94a9c3',
          200: '#cbd6e2',
          100: '#e5ecf3',
        },
        sar: {
          gold: '#eab308',
          amber: '#f59e0b',
          dim: '#854d0e',
        },
        optical: {
          cyan: '#38bdf8',
          blue: '#0284c7',
        },
        mask: {
          water: '#06b6d4',
          flood: '#10b981',
          danger: '#f43f5e',
          hazard: '#f97316',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      boxShadow: {
        'telemetry': '0 0 0 1px rgba(56, 189, 248, 0.2), 0 2px 4px rgba(0, 0, 0, 0.4)',
        'sar-glow': '0 0 12px rgba(234, 179, 8, 0.25)',
        'cyan-glow': '0 0 12px rgba(56, 189, 248, 0.25)',
        'hazard-glow': '0 0 12px rgba(244, 63, 94, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
