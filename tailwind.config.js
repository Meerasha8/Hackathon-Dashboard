/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        black: '#080A0F',
        'black-2': '#0D1117',
        'black-3': '#161B22',
        'black-4': '#1C2333',
        blue: {
          DEFAULT: '#1D6AEB',
          light: '#3B82F6',
          glow: '#60A5FA',
          dark: '#1249A8',
        },
        red: {
          DEFAULT: '#E5303A',
          light: '#F87171',
          dark: '#B91C1C',
        },
        white: '#F0F4FF',
        'white-dim': '#8B95A8',
        border: '#1E2A3A',
      },
      boxShadow: {
        'blue-glow': '0 0 20px rgba(29, 106, 235, 0.3)',
        'red-glow': '0 0 20px rgba(229, 48, 58, 0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(29,106,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(29,106,235,0.05) 1px, transparent 1px)",
        'hero-gradient': 'radial-gradient(ellipse at top left, rgba(29,106,235,0.15) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
