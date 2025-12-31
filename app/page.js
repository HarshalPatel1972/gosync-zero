import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import InteractiveDemo from "@/components/InteractiveDemo";
import FeaturesGrid from "@/components/FeaturesGrid";
import CodeExample from "@/components/CodeExample";
import Blueprints from "@/components/Blueprints";
import RoadmapEvolution from "@/components/RoadmapEvolution";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <InteractiveDemo />
        <FeaturesGrid />
        <CodeExample />
        <Blueprints />
        <RoadmapEvolution />
      </main>
      <Footer />
    </>
  );
}
