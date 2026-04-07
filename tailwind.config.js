/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0F0A1E',
          card: '#1A1035',
          purple: '#6C3CE1',
          violet: '#9B59F5',
          cyan: '#00E5FF',
          gold: '#FFD700',
          green: '#00E676',
          red: '#FF5252',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pop': 'pop 0.15s ease-out',
        'shake': 'shake 0.3s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(0.9)' }, '50%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '75%': { transform: 'translateX(6px)' } },
        glow: { '0%,100%': { boxShadow: '0 0 10px #6C3CE1' }, '50%': { boxShadow: '0 0 30px #9B59F5, 0 0 60px #6C3CE1' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'pulse-ring': { '0%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
      }
    }
  },
  plugins: []
}
