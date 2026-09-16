import Hero from "../components/Hero";
import QuickFacts from "../components/QuickFacts";
import Programs from "../components/Programs";
import WhyUs from "../components/WhyUs";
import Placements from "../components/Placements";
import Testimonials from "../components/Testimonials";
import AdmissionCTA from "../components/AdmissionCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickFacts />
      <Programs />
      <WhyUs />
      <Placements />
      <Testimonials />
      <AdmissionCTA />
    </>
  );
}
