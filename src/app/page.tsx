import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Method from "@/components/Method";
import CtaBanner from "@/components/CtaBanner";
import Founder from "@/components/Founder";
import TechMarquee from "@/components/TechMarquee";
import Trust from "@/components/Trust";
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
      <Testimonials />
      <SectionDivider kanji="善" />
      <Method />
      <CtaBanner />
      <SectionDivider kanji="道" />
      <Founder />
      <TechMarquee />
      <Trust />
      <Contact />
      <Footer />
    </>
  );
}
