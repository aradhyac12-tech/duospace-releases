import { MarketingNav } from "../components/MarketingNav";
import { ScrollProgress } from "../components/ScrollProgress";
import { MarketingFooter } from "../components/MarketingFooter";
import { Hero } from "../sections/Hero";
import { Ecosystem } from "../sections/Ecosystem";
import { FeatureShowcase } from "../sections/FeatureShowcase";
import { BuiltForTwo } from "../sections/BuiltForTwo";
import { Privacy } from "../sections/Privacy";
import { DownloadCTA } from "../sections/DownloadCTA";

// Title/description/social tags are declared by the route's head() in
// src/routes/index.tsx so SSR serves them in the initial HTML.
export default function MarketingHome() {


  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <MarketingNav />
      <main>
        <Hero />
        <Ecosystem />
        <FeatureShowcase />
        <BuiltForTwo />
        <Privacy />
        <DownloadCTA />
      </main>
      <MarketingFooter />
    </div>
  );
}

