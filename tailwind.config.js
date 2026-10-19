/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#ffd6e0',
          rose: '#ffacc2',
          blush: '#fff0f3',
          cream: '#fffdfa',
          lavender: '#e8ddf5',
          gold: '#f9e79f',
          sky: '#e0f2fe',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cursive: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        sans: ['"Montserrat"', '"Be Vietnam Pro"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(255, 182, 193, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(255, 182, 193, 0.9))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
      }
    },
  },
  plugins: [],
}
