import { Footer, Navbar } from "@/blocks";
import { SITE_NAME } from "@/constants";
import About from "@/pages/About";
import Home from "@/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Navbar
        brand={SITE_NAME}
        links={[
          { to: "/", label: "Home" },
          { to: "/about", label: "About" },
        ]}
      />

      <main className="flex-1 container mx-auto p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer
        brand={SITE_NAME}
        links={[
          { to: "/", label: "Home" },
          { to: "/about", label: "About" },
        ]}
      />
    </BrowserRouter>
  );
}

export default App;
