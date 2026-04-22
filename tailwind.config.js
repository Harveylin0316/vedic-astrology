/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        cosmic: {
          950: '#0a0618',
          900: '#140b2e',
          800: '#1f1240',
          700: '#2b1a55',
          600: '#3d2673'
        },
        saffron: {
          400: '#ffc266',
          500: '#ffa733',
          600: '#e68a00'
        },
        vermilion: {
          300: '#ff9182',
          400: '#f56658',
          500: '#e34234',
          600: '#c12f22'
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e'
        }
      },
      backgroundImage: {
        'starfield':
          'radial-gradient(circle at 20% 30%, rgba(255,194,102,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(227,66,52,0.08) 0%, transparent 40%), radial-gradient(ellipse at center, #140b2e 0%, #0a0618 100%)'
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}
