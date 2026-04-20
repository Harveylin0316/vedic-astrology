import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="text-7xl font-serif gradient-text mb-4">404</div>
      <h1 className="text-2xl font-serif mb-3">星辰迷失於宇宙之中</h1>
      <p className="text-slate-400 mb-8">
        你所尋找的路徑尚未在星圖上標記。
      </p>
      <Link to="/" className="btn-primary">
        <Home className="h-4 w-4" />
        返回主頁
      </Link>
    </div>
  )
}
