import { ConvexProvider } from "convex/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { convex } from "./lib/convex";
import AdminView from "./views/AdminView";
import CardView from "./views/CardView";
import Home from "./views/Home";

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
  );
}

export default App;
