import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, User, Bot, Loader2, Calendar, Clock, MapPin } from 'lucide-react'
import { computeVedicChart, formatDegrees } from '../utils/vedicCalc.js'

const systemPrompt = `你是一位專精吠陀占星 (Jyotish Shastra) 的顧問。以溫暖、智慧、文化尊重的語氣回覆。
請使用 sidereal 恆星黃道、Lahiri ayanamsha、27 Nakshatra、九大 Graha 的術語。
若使用者已提供命盤資料（太陽、月亮、Lagna、Nakshatra），請據此給予個人化解讀。
避免給予醫療、法律、財務等具體建議，並在適當處提醒占星為自我探索工具，非科學診斷。
回覆請使用繁體中文，保留 Sanskrit 術語（如 Rashi、Nakshatra、Graha）。`

const suggestions = [
  '請根據我的命盤說明本週的運勢能量',
  '我的月亮 Nakshatra 代表什麼意義？',
  '如何透過冥想平衡我的 Graha 能量？',
  'Dasha 行運週期是什麼？如何影響人生階段？'
]

export default function AIReading() {
  const [birth, setBirth] = useState({
    date: '',
    time: '',
    city: '',
    lat: '',
    lon: '',
    tz: '8'
  })
  const [chart, setChart] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const computeIfPossible = () => {
    if (!birth.date || !birth.time || !birth.lat || !birth.lon) return null
    try {
      const [year, month, day] = birth.date.split('-').map(Number)
      const [hour, minute] = birth.time.split(':').map(Number)
      return computeVedicChart({
        year,
        month,
        day,
        hour,
        minute,
        tzOffset: parseFloat(birth.tz),
        lat: parseFloat(birth.lat),
        lon: parseFloat(birth.lon)
      })
    } catch {
      return null
    }
  }

  const handleSend = async (customInput) => {
    const text = (customInput ?? input).trim()
    if (!text || loading) return

    let activeChart = chart
    if (!activeChart) {
      activeChart = computeIfPossible()
      if (activeChart) setChart(activeChart)
    }

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const contextNote = activeChart
        ? `\n\n[使用者命盤資料]\n出生: ${birth.date} ${birth.time} (UTC${
            parseFloat(birth.tz) >= 0 ? '+' : ''
          }${birth.tz})\n地點: ${birth.city || `${birth.lat}, ${birth.lon}`}\n` +
          `Lagna 上升: ${activeChart.ascendant.rashi.name} (${activeChart.ascendant.rashi.chinese}) ${formatDegrees(
            activeChart.ascendant.degreeInSign
          )}\n` +
          `Sun 太陽: ${activeChart.sun.rashi.name} ${formatDegrees(activeChart.sun.degreeInSign)} · Nakshatra: ${activeChart.sun.nakshatra.name} Pada ${activeChart.sun.nakshatra.pada}\n` +
          `Moon 月亮: ${activeChart.moon.rashi.name} ${formatDegrees(activeChart.moon.degreeInSign)} · Nakshatra: ${activeChart.moon.nakshatra.name} Pada ${activeChart.moon.nakshatra.pada}`
        : ''

      const payloadMessages = newMessages.map((m) => ({ role: m.role, content: m.content }))
      if (contextNote) {
        payloadMessages[payloadMessages.length - 1] = {
          role: 'user',
          content: text + contextNote
        }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: systemPrompt,
          messages: payloadMessages
        })
      })

      if (!res.ok) {
        const body = await res.text()
        throw new Error(`服務回應 ${res.status}：${body.slice(0, 200)}`)
      }

      const data = await res.json()
      const reply = data.content || data.reply || data.text
      if (!reply) throw new Error('伺服器回傳為空')

      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error(err)
      setError(err.message || '發生錯誤')
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: '（星辰暫時無法傳達訊息，請稍後再試；或確認伺服器 API key 設定）'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="section-title">AI 占星解讀</h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">
          由 Claude 驅動的吠陀占星顧問。提供你的出生資料後，便能獲得個人化分析。
        </p>
      </div>

      {/* Birth info (optional, for personalization) */}
      <details className="glass-panel p-5 mb-6" open={!chart}>
        <summary className="cursor-pointer font-medium text-slate-200 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-saffron-400" />
          出生資料（選填，提供可獲得個人化解讀）
        </summary>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <Field icon={Calendar} label="日期">
            <input
              type="date"
              className="input-field"
              value={birth.date}
              onChange={(e) => setBirth((b) => ({ ...b, date: e.target.value }))}
            />
          </Field>
          <Field icon={Clock} label="時間">
            <input
              type="time"
              className="input-field"
              value={birth.time}
              onChange={(e) => setBirth((b) => ({ ...b, time: e.target.value }))}
            />
          </Field>
          <Field icon={MapPin} label="城市">
            <input
              type="text"
              placeholder="台北"
              className="input-field"
              value={birth.city}
              onChange={(e) => setBirth((b) => ({ ...b, city: e.target.value }))}
            />
          </Field>
          <Field label="時區 (UTC±)">
            <input
              type="number"
              step="0.5"
              className="input-field"
              value={birth.tz}
              onChange={(e) => setBirth((b) => ({ ...b, tz: e.target.value }))}
            />
          </Field>
          <Field label="緯度 °N">
            <input
              type="number"
              step="0.01"
              placeholder="25.04"
              className="input-field"
              value={birth.lat}
              onChange={(e) => setBirth((b) => ({ ...b, lat: e.target.value }))}
            />
          </Field>
          <Field label="經度 °E">
            <input
              type="number"
              step="0.01"
              placeholder="121.56"
              className="input-field"
              value={birth.lon}
              onChange={(e) => setBirth((b) => ({ ...b, lon: e.target.value }))}
            />
          </Field>
        </div>
        {chart && (
          <div className="mt-4 text-xs text-saffron-400/80 flex flex-wrap gap-2">
            <Tag>Lagna {chart.ascendant.rashi.name}</Tag>
            <Tag>Sun {chart.sun.rashi.name}</Tag>
            <Tag>Moon {chart.moon.rashi.name}</Tag>
            <Tag>月宿 {chart.moon.nakshatra.name}</Tag>
          </div>
        )}
      </details>

      {/* Chat */}
      <div className="glass-panel p-4 md:p-6">
        <div className="min-h-[300px] max-h-[50vh] overflow-y-auto space-y-4 mb-4 px-1">
          {messages.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              <Sparkles className="h-8 w-8 mx-auto text-saffron-400/40 mb-3" />
              <div>開始對話，或試試下方建議問題</div>
            </div>
          ) : (
            messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))
          )}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-saffron-400" />
              星辰正在沈思...
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                disabled={loading}
                className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10 transition text-slate-300"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="向占星顧問提問..."
            disabled={loading}
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-4" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </button>
        </form>

        {error && (
          <div className="mt-3 text-xs text-vermilion-500">{error}</div>
        )}
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-saffron-400" />}
        {label}
      </div>
      {children}
    </label>
  )
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-saffron-500/30 bg-saffron-500/10 px-2.5 py-0.5 text-xs">
      {children}
    </span>
  )
}

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center ${
          isUser ? 'bg-saffron-500/20 text-saffron-400' : 'bg-vermilion-500/20 text-vermilion-500'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`rounded-2xl px-4 py-3 text-sm max-w-[80%] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-saffron-500/10 border border-saffron-500/20'
            : 'bg-white/5 border border-white/10'
        }`}
      >
        {content}
      </div>
    </div>
  )
}
