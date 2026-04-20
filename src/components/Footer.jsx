import { Sparkles, Github, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-cosmic-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 gradient-text font-serif text-xl">
            <Sparkles className="h-5 w-5 text-saffron-400" />
            吠陀占星
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-sm">
            源自印度數千年智慧的天文占星系統。以 sidereal zodiac、27 Nakshatra、九大行星 Graha
            揭示靈魂的旅程。
          </p>
        </div>
        <div className="text-sm text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 mb-2">重要觀念</div>
          <div>Rashi · 12 星座</div>
          <div>Nakshatra · 27 月宿</div>
          <div>Graha · 九大行星</div>
          <div>Dasha · 行運週期</div>
        </div>
        <div className="text-sm text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 mb-2">免責聲明</div>
          <p className="leading-relaxed">
            本站內容僅供文化學習與自我探索之用。占星分析非科學診斷，不可作為醫療、法律或財務決策依據。
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          Built with <Heart className="h-3 w-3 text-vermilion-500" /> · Jyotish Shastra · 2026
        </span>
      </div>
    </footer>
  )
}
