import { ConvexProvider } from "convex/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat } from "./components/Chat";
import { Footer } from "./components/Footer";
import { convex } from "./lib/convex";
import AdminView from "./views/AdminView";
import CardView from "./views/CardView";
import Contact from "./views/Contact";
import Home from "./views/Home";
import Support from "./views/Support";

export function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/card/:id" element={<CardView />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <Chat />
      </BrowserRouter>
    </ConvexProvider>
  );
}

export default App;
