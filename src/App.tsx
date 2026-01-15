import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConvexProvider } from 'convex/react'
import { convex } from './lib/convex'
import Home from './views/Home'
import Card from './views/Card'
import Admin from './views/Admin'

export function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/card/:id" element={<Card />} />
        </Routes>
      </BrowserRouter>
    </ConvexProvider>
  )
}

export default App;