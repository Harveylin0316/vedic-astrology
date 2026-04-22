import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Starfield from './components/Starfield.jsx'
import Analytics from './components/Analytics.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import GrandIntro from './components/GrandIntro.jsx'

// 主要路徑 eager 保留（Home / BirthChart / Compatibility 最常用）
import Home from './pages/Home.jsx'
import BirthChart from './pages/BirthChart.jsx'
import Compatibility from './pages/Compatibility.jsx'

// 次要路徑 lazy — 80% 流量只走主要三條路徑，這些按需載入
const Nakshatras = lazy(() => import('./pages/Nakshatras.jsx'))
const Planets = lazy(() => import('./pages/Planets.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function FallbackLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-slate-500 text-sm">載入中…</div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GrandIntro />
      <CustomCursor />
      <Analytics />
      <Starfield />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/birth-chart" element={<BirthChart />} />
          <Route path="/compatibility" element={<Compatibility />} />
          <Route
            path="/nakshatras"
            element={
              <Suspense fallback={<FallbackLoader />}>
                <Nakshatras />
              </Suspense>
            }
          />
          <Route
            path="/planets"
            element={
              <Suspense fallback={<FallbackLoader />}>
                <Planets />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<FallbackLoader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
