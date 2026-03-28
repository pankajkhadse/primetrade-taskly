/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg:       '#0e0f11',
        surface:  '#16181c',
        surface2: '#1e2026',
        border1:  '#2a2d35',
        border2:  '#353840',
        accent:   '#6ee7b7',
        accent2:  '#34d399',
        danger:   '#f87171',
        muted:    '#8b92a5',
        muted2:   '#64748b',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease both',
        fadeIn: 'fadeIn 0.2s ease',
        spin:   'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}
