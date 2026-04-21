import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Starfield from './components/Starfield.jsx'
import Home from './pages/Home.jsx'
import BirthChart from './pages/BirthChart.jsx'
import Compatibility from './pages/Compatibility.jsx'
import Nakshatras from './pages/Nakshatras.jsx'
import Planets from './pages/Planets.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/birth-chart" element={<BirthChart />} />
          <Route path="/compatibility" element={<Compatibility />} />
          <Route path="/nakshatras" element={<Nakshatras />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
