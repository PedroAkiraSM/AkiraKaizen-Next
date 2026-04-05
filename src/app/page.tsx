import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Method from "@/components/Method";
import Founder from "@/components/Founder";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SectionDivider kanji="改" />
      <Projects />
      <SectionDivider kanji="善" />
      <Method />
      <SectionDivider kanji="道" />
      <Founder />
      <Contact />
      <Footer />
    </>
  );
}
