import { MarketingNav } from "../components/MarketingNav";
import { ScrollProgress } from "../components/ScrollProgress";
import { SmoothScroll } from "../components/SmoothScroll";
import { MarqueeStrip } from "../components/MarqueeStrip";
import { MarketingFooter } from "../components/MarketingFooter";
import { Hero } from "../sections/Hero";
import { BrandStory } from "../sections/BrandStory";
import { DuoSpaceOS } from "../sections/DuoSpaceOS";
import { Privacy } from "../sections/Privacy";
import { DownloadCTA } from "../sections/DownloadCTA";
import { GuidedDemo, ProductExperience } from "../components/ProductExperience";

const MARQUEE = ["Two people", "One private world", "No audience", "DuoSpace"];


// Title/description/social tags are declared by the route's head() in
// src/routes/index.tsx so SSR serves them in the initial HTML.
export default function MarketingHome() {


  return (
    <div className="cinematic-site relative min-h-screen bg-background text-foreground overflow-x-clip">
      <SmoothScroll />
      <ScrollProgress />
      <MarketingNav />
      <main>
        <Hero />
        <MarqueeStrip items={MARQUEE} />
        <BrandStory />
        <ProductExperience />
        <DuoSpaceOS />
        <Privacy />
        <GuidedDemo />
        <DownloadCTA />
      </main>

      <MarketingFooter />
    </div>
  );
}

