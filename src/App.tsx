import { ConvexProvider } from "convex/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { convex } from "./lib/convex";
import AdminView from "./views/AdminView";
import CardView from "./views/CardView";
import Contact from "./views/Contact";
import Home from "./views/Home";
import Impressum from "./views/Impressum";
import Support from "./views/Support";
import Unsubscribe from "./views/Unsubscribe";

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
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ConvexProvider>
  );
}

export default App;
