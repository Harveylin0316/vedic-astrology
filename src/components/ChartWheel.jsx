// North Indian style Vedic chart diamond
export default function ChartWheel({ chart }) {
  const ascIdx = chart.houses[0].rashi.id - 1

  // Mark planetary placements by house
  const placements = Array(12).fill(null).map(() => [])
  const ascHouse = 0
  const sunHouse = (Math.floor(chart.sun.sidereal / 30) - ascIdx + 12) % 12
  const moonHouse = (Math.floor(chart.moon.sidereal / 30) - ascIdx + 12) % 12
  placements[ascHouse].push({ label: 'As', color: '#ffc266' })
  placements[sunHouse].push({ label: 'Su', color: '#ffa733' })
  placements[moonHouse].push({ label: 'Mo', color: '#c8d6ff' })

  // 12 house positions (North Indian diamond)
  // House 1 at top-center, clockwise 1→2→3... no, Vedic goes anti-clockwise
  const boxes = [
    { x: 200, y: 100 },   // 1
    { x: 100, y: 50 },    // 2
    { x: 50, y: 100 },    // 3
    { x: 100, y: 200 },   // 4
    { x: 50, y: 300 },    // 5
    { x: 100, y: 350 },   // 6
    { x: 200, y: 300 },   // 7
    { x: 300, y: 350 },   // 8
    { x: 350, y: 300 },   // 9
    { x: 300, y: 200 },   // 10
    { x: 350, y: 100 },   // 11
    { x: 300, y: 50 }     // 12
  ]

  return (
    <div>
      <h3 className="font-serif text-xl mb-4">星盤 · Rashi Chart</h3>
      <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
        {/* Outer square */}
        <rect x="20" y="20" width="360" height="360" fill="none" stroke="rgba(255,194,102,0.6)" strokeWidth="1.5" />
        {/* Diagonals */}
        <line x1="20" y1="20" x2="380" y2="380" stroke="rgba(255,194,102,0.6)" strokeWidth="1.5" />
        <line x1="380" y1="20" x2="20" y2="380" stroke="rgba(255,194,102,0.6)" strokeWidth="1.5" />
        {/* Inner diamond */}
        <polygon
          points="200,20 380,200 200,380 20,200"
          fill="none"
          stroke="rgba(255,194,102,0.6)"
          strokeWidth="1.5"
        />

        {/* House numbers + rashi symbols */}
        {chart.houses.map((h, i) => {
          const pos = boxes[i]
          return (
            <g key={i}>
              <text
                x={pos.x}
                y={pos.y - 8}
                textAnchor="middle"
                fill="rgba(255,194,102,0.5)"
                fontSize="10"
              >
                {h.house}
              </text>
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor="middle"
                fill="#ffc266"
                fontSize="18"
                fontFamily="serif"
              >
                {h.rashi.symbol}
              </text>
              {placements[i].map((p, pi) => (
                <text
                  key={pi}
                  x={pos.x + (pi - (placements[i].length - 1) / 2) * 22}
                  y={pos.y + 28}
                  textAnchor="middle"
                  fill={p.color}
                  fontSize="12"
                  fontWeight="600"
                >
                  {p.label}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-saffron-400" /> As 上升
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-saffron-500" /> Su 太陽
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: '#c8d6ff' }} /> Mo 月亮
        </span>
      </div>
    </div>
  )
}
