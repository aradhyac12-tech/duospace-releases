import { MessageCircle, Phone, Images, Music2, MapPin, Palette } from "lucide-react";
import { FeatureScene } from "../components/FeatureScene";
import { SceneBridge } from "../components/SceneBridge";
import { ChatPreview } from "../components/ChatPreview";
import { CallsPreview } from "../components/CallsPreview";
import { GalleryPreview } from "../components/GalleryPreview";
import { GroicPreview } from "../components/GroicPreview";
import { MapPreview } from "../components/MapPreview";
import { PersonalizationPreview } from "../components/PersonalizationPreview";
import { marketingFeatures, type MarketingFeature } from "../data/features";

const byId = Object.fromEntries(marketingFeatures.map((f) => [f.id, f])) as Record<
  MarketingFeature["id"],
  MarketingFeature
>;

/**
 * The deep-dive continuation of the Ecosystem overview grid: each real
 * DuoSpace surface gets its own cinematic beat, alternating device side
 * left/right so the page keeps moving rather than reading as six
 * identical repeats. A `SceneBridge` between each pair gives every
 * transition (Chat→Calls, Calls→Gallery, etc.) a concrete, honest
 * element-level hand-off instead of a hard cut — see FeatureScene's and
 * SceneBridge's own doc comments for why this stops short of a literal
 * full-device morph.
 */
export function FeatureShowcase() {
  return (
    <div className="relative">
      <FeatureScene id="chat" eyebrow={byId.chat.label} headline={byId.chat.headline} copy={byId.chat.copy} connected>
        <ChatPreview />
      </FeatureScene>

      <SceneBridge fromIcon={MessageCircle} toIcon={Phone} label="Chat leads into Calls" />

      <FeatureScene
        id="calls"
        eyebrow={byId.calls.label}
        headline={byId.calls.headline}
        copy={byId.calls.copy}
        reverse
        connected
      >
        <CallsPreview />
      </FeatureScene>

      <SceneBridge fromIcon={Phone} toIcon={Images} label="Calls leads into Gallery" />

      <FeatureScene id="gallery" eyebrow={byId.gallery.label} headline={byId.gallery.headline} copy={byId.gallery.copy} connected>
        <GalleryPreview />
      </FeatureScene>

      <SceneBridge fromIcon={Images} toIcon={Music2} label="Gallery leads into Groic" />

      <FeatureScene id="groic" eyebrow={byId.groic.label} headline={byId.groic.headline} copy={byId.groic.copy} reverse connected>
        <GroicPreview />
      </FeatureScene>

      <SceneBridge fromIcon={Music2} toIcon={MapPin} label="Groic leads into Map" />

      <FeatureScene id="map" eyebrow={byId.map.label} headline={byId.map.headline} copy={byId.map.copy} connected>
        <MapPreview />
      </FeatureScene>

      <SceneBridge fromIcon={MapPin} toIcon={Palette} label="Map leads into Personalization" />

      <FeatureScene
        id="personalization"
        eyebrow={byId.personalization.label}
        headline={byId.personalization.headline}
        copy={byId.personalization.copy}
        reverse
        connected
      >
        <PersonalizationPreview />
      </FeatureScene>
    </div>
  );
}
