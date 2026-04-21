import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { composeDeepReading } from '../utils/deepReadingComposer.js'
import MysticalTransition from './MysticalTransition.jsx'

// 簡易 Markdown 渲染器 — 支援 # ## ### **bold** > quote | table | `code` | ---
function renderMarkdown(md) {
  const lines = md.split('\n')
  const elements = []
  let inTable = false
  let tableRows = []
  let key = 0

  const flushTable = () => {
    if (!inTable || tableRows.length === 0) return
    const [header, separator, ...rows] = tableRows
    const headers = header.split('|').map((s) => s.trim()).filter(Boolean)
    const data = rows.map((r) => r.split('|').map((s) => s.trim()).filter(Boolean))
    elements.push(
      <div key={`table-${key++}`} className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/20 bg-white/5">
              {headers.map((h, i) => (
                <th key={i} className="text-left py-2 px-3 text-saffron-400 font-medium">
                  {renderInline(h, key++)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className="border-b border-white/5">
                {row.map((cell, ci) => (
                  <td key={ci} className="py-2 px-3 text-slate-200">{renderInline(cell, key++)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    inTable = false
    tableRows = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('|')) {
      inTable = true
      tableRows.push(line.replace(/^\||\|$/g, ''))
      continue
    } else if (inTable) {
      flushTable()
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-3xl font-serif gradient-text mt-6 mb-4">{renderInline(line.slice(2), key++)}</h1>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-2xl font-serif text-saffron-400 mt-8 mb-3 border-b border-saffron-500/20 pb-2">{renderInline(line.slice(3), key++)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-xl font-serif text-slate-100 mt-5 mb-2">{renderInline(line.slice(4), key++)}</h3>)
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={key++} className="border-l-4 border-saffron-500/50 bg-saffron-500/5 pl-4 py-2 my-3 text-slate-200 italic">{renderInline(line.slice(2), key++)}</blockquote>)
    } else if (line === '---') {
      elements.push(<hr key={key++} className="my-6 border-white/10" />)
    } else if (line.trim() === '') {
      // skip empty lines (paragraph breaks handled by mb)
    } else {
      elements.push(<p key={key++} className="text-slate-200 leading-relaxed my-2">{renderInline(line, key++)}</p>)
    }
  }
  flushTable()
  return elements
}

// 簡易 inline renderer — 支援 **bold**, *italic*, `code`
function renderInline(text, baseKey) {
  const parts = []
  let idx = 0
  let k = 0
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > idx) parts.push(<span key={`${baseKey}-${k++}`}>{text.slice(idx, m.index)}</span>)
    const matched = m[0]
    if (matched.startsWith('**')) {
      parts.push(<strong key={`${baseKey}-${k++}`} className="text-saffron-400 font-semibold">{matched.slice(2, -2)}</strong>)
    } else if (matched.startsWith('*')) {
      parts.push(<em key={`${baseKey}-${k++}`} className="text-slate-300">{matched.slice(1, -1)}</em>)
    } else if (matched.startsWith('`')) {
      parts.push(<code key={`${baseKey}-${k++}`} className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-saffron-300">{matched.slice(1, -1)}</code>)
    }
    idx = m.index + matched.length
  }
  if (idx < text.length) parts.push(<span key={`${baseKey}-${k++}`}>{text.slice(idx)}</span>)
  return parts
}

export default function DeepReading({ chart, birthAge, gender }) {
  const [expanded, setExpanded] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [pendingReading, setPendingReading] = useState('')
  const [reading, setReading] = useState('')
  const [ageInput, setAgeInput] = useState(birthAge?.toFixed(0) || '')
  const [situation, setSituation] = useState('')
  const [question, setQuestion] = useState('')

  const handleGenerate = () => {
    // 立即計算（幾乎即時），但先不顯示
    try {
      const md = composeDeepReading(chart, {
        age: parseInt(ageInput, 10) || birthAge,
        gender,
        situation,
        question
      })
      setPendingReading(md)
      setShowTransition(true) // 啟動神祕過場
    } catch (err) {
      console.error('Deep reading error:', err)
      setReading('生成失敗，請回報錯誤。')
    }
  }

  const handleTransitionComplete = () => {
    setReading(pendingReading)
    setExpanded(true)
    setShowTransition(false)
    // 解讀呈現後，滑動到解讀區塊（稍微下一點才看得到內容）
    setTimeout(() => {
      const el = document.getElementById('deep-reading')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <>
      {showTransition && (
        <MysticalTransition onComplete={handleTransitionComplete} duration={1500} />
      )}
    <div id="deep-reading" className="glass-panel p-6 border-saffron-500/40 bg-gradient-to-br from-saffron-500/5 to-vermilion-500/5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-saffron-400 mb-2">
        <Sparkles className="h-4 w-4" />
        深度解讀 · Raman 框架 · Signal &gt; Coverage
      </div>
      <h3 className="font-serif text-2xl gradient-text mb-3">
        {reading ? '你的命盤深度解讀' : '生成只屬於你的深度解讀'}
      </h3>

      {!reading && (
        <>
          <p className="text-sm text-slate-300 mb-5 leading-relaxed">
            這會結合你的 Nakshatra Pada、Yoga、稀有配置、當前大運，生成一份 Signal &gt; Coverage 的個人化解讀。
            填下面三個欄位讓解讀更貼近你的現況 — 全部可選填。
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">你現在幾歲？</label>
              <input
                type="number"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                placeholder="例如 35"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">你現在的人生狀態（1-2 句）</label>
              <input
                type="text"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="例如：科技業 PM、未婚、正考慮創業"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">你最想知道的問題</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例如：我現在該創業嗎？"
                className="input-field"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={showTransition}
            className="btn-primary w-full mt-5"
          >
            <Sparkles className="h-4 w-4" />
            生成我的深度解讀
          </button>
        </>
      )}

      {reading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-saffron-400 transition"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {expanded ? '收合' : '展開'}解讀內容
            </button>
            <button
              onClick={() => { setReading(''); setExpanded(false) }}
              className="text-xs text-slate-400 hover:text-saffron-400"
            >
              重新生成
            </button>
          </div>
          {expanded && (
            <div className="rounded-xl bg-cosmic-950/40 border border-white/10 p-6 prose-reading">
              {renderMarkdown(reading)}
            </div>
          )}
        </>
      )}
    </div>
    </>
  )
}
