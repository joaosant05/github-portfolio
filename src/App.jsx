import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Portfolio from "./components/Portfolio/Portfolio";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

const About = lazy(() => import("./components/About/About"));

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<section id="about" className="c-space" aria-hidden="true" />}>
          <About />
        </Suspense>
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
