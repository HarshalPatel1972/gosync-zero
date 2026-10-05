import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import DayInTheField from "@/components/story/DayInTheField";
import Switchboard from "@/components/fit/Switchboard";
import StackCompare from "@/components/compare/StackCompare";
import FeaturesGrid from "@/components/FeaturesGrid";
import CodeExample from "@/components/CodeExample";
import Blueprints from "@/components/Blueprints";
import Roadmap from "@/components/roadmap/Roadmap";
import Footer from "@/components/Footer";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <DayInTheField />
        <Switchboard />
        <StackCompare />
        <CodeExample />
        <FeaturesGrid />
        <Blueprints />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
