import GeoCanvas from "@/components/isti/GeoCanvas";
import Cursor from "@/components/isti/Cursor";
import Navbar from "@/components/isti/Navbar";
import Hero from "@/components/isti/Hero";
import About from "@/components/isti/About";
import Experience from "@/components/isti/Experience";
import Skills from "@/components/isti/Skills";
import Projects from "@/components/isti/Projects";
import Organizations from "@/components/isti/Organizations";
import Achievements from "@/components/isti/Achievements";
import Contact from "@/components/isti/Contact";
import Footer from "@/components/isti/Footer";
import Divider from "@/components/isti/Divider";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-cream">
      {/* Background + cursor (client components/isti) */}
      <GeoCanvas />
      <Cursor />

      {/* Nav */}
      <Navbar />

      {/* Sections */}
      <Hero />
      <Divider />
      <About />
      <Divider />
      <Experience />
      <Divider />
      <Skills />
      <Divider />
      <Projects />
      <Divider />
      <Organizations />
      <Divider />
      <Achievements />
      <Divider />
      <Contact />

      <Footer />
    </main>
  );
}
