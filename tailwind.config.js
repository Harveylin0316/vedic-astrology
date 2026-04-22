/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // 標題：EB Garamond（古典書卷） + 繁中思源宋體
        serif: ['"EB Garamond"', '"Cormorant Garamond"', '"Noto Serif TC"', 'Georgia', 'serif'],
        // 內文：以繁中思源宋體為主
        body: ['"Noto Serif TC"', '"EB Garamond"', 'Georgia', 'serif'],
        // 小標／版權／標籤：Cinzel（古羅馬大寫），tracking 放大很優雅
        display: ['"Cinzel"', '"EB Garamond"', 'serif'],
        // 保留 sans 給表單輸入等工具 UI
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        // ─── 新色系：Mughal Court × 古董命書 ───
        // 墨色背景（近黑，告別紫色漸變）
        ink: {
          950: '#0a0806',  // 最深，主背景
          900: '#141210',  // 次深，卡片
          800: '#1f1a14',  // 提亮，懸浮
          700: '#2b241a',  // 邊框
          600: '#3a3022'   // 分隔
        },
        // 金箔 — 取代原 saffron 的明亮橘
        gold: {
          50: '#f5ecd9',   // 羊皮紙
          100: '#e8d9b0',  // 米金
          200: '#d9bf85',  // 淺金
          300: '#c9a961',  // 標準金箔
          400: '#b48e45',  // 沉金
          500: '#a8824a',  // 暗金
          600: '#8b6a35',  // 舊金
          700: '#6b5128'   // 極深舊金
        },
        // Sindoor 硃砂紅 — 印度宗教紅，取代舊 vermilion 的亮橘紅
        sindoor: {
          400: '#d85540',
          500: '#b12d20',
          600: '#8f2419',
          700: '#6b1a12'
        },
        // 羊皮紙：偶爾翻白章節使用
        parchment: {
          50: '#faf4e6',
          100: '#f5ecd9',
          200: '#e8dcbf',
          300: '#d9c9a0'
        },

        // ─── 保留舊命名（backward compat — 漸進替換，不一次全改）───
        cosmic: {
          950: '#0a0806',
          900: '#141210',
          800: '#1f1a14',
          700: '#2b241a',
          600: '#3a3022'
        },
        saffron: {
          300: '#d9bf85',
          400: '#c9a961',
          500: '#b48e45',
          600: '#8b6a35'
        },
        vermilion: {
          300: '#d85540',
          400: '#d85540',
          500: '#b12d20',
          600: '#8f2419'
        },
        rose: {
          400: '#d85540',
          500: '#b12d20'
        }
      },
      backgroundImage: {
        // 紙質感 radial — 取代原紫色漸變
        'starfield':
          'radial-gradient(circle at 22% 28%, rgba(201,169,97,0.06) 0%, transparent 45%), radial-gradient(circle at 78% 72%, rgba(177,45,32,0.05) 0%, transparent 45%), linear-gradient(#0a0806, #0a0806)',
        // 金箔紙質 noise
        'parchment-noise':
          'radial-gradient(ellipse at center, rgba(201,169,97,0.04) 0%, transparent 70%), linear-gradient(#0a0806, #0a0806)'
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1.4s ease-out both',
        'seal-in': 'sealIn 0.8s ease-out both'
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.9' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        sealIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) rotate(-4deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' }
        }
      },
      letterSpacing: {
        'widest-2': '0.35em',
        'ornament': '0.5em'
      }
    }
  },
  plugins: []
}
