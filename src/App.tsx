import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConvexProvider } from 'convex/react'
import { convex } from './lib/convex'
import Home from './views/Home'
import CardView from './views/CardView'
import AdminView from './views/AdminView'

export function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/card/:id" element={<CardView />} />
        </Routes>
      </BrowserRouter>
    </ConvexProvider>
  )
}

export default App;