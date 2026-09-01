/**
 * Feature copy for the marketing site. Every entry maps to a real,
 * shipped DuoSpace surface (see .ai/PROJECT_CONTEXT.md, docs/prd.md) —
 * nothing here is invented, and nothing implies relationship-inference
 * AI, which is an explicit non-goal of the product.
 */

export interface MarketingFeature {
  id: "chat" | "calls" | "gallery" | "groic" | "map" | "personalization";
  label: string;
  headline: string;
  copy: string;
  route: string;
}

export const marketingFeatures: MarketingFeature[] = [
  {
    id: "chat",
    label: "Chat",
    headline: "Talk without leaving your space.",
    copy: "End-to-end encrypted messaging with voice notes, reactions, and love letters — built for two, not a group thread.",
    route: "/chat",
  },
  {
    id: "calls",
    label: "Calls",
    headline: "Be in the room, wherever you are.",
    copy: "Voice and video calling with a live network-quality indicator, so you always know how the connection is holding up.",
    route: "/calls",
  },
  {
    id: "gallery",
    label: "Gallery",
    headline: "Every photo, kept just between you.",
    copy: "A private shared gallery with a per-photo Private/Shared toggle — your memories, kept exactly as open as you want them.",
    route: "/gallery",
  },
  {
    id: "groic",
    label: "Groic",
    headline: "Listen together, from anywhere.",
    copy: "A shared music hub — search, queue, and blend listening sessions into one soundtrack for two.",
    route: "/groic",
  },
  {
    id: "map",
    label: "Map",
    headline: "Know where your space is.",
    copy: "Live, private location sharing between partners — no broadcasting, no audience.",
    route: "/map",
  },
  {
    id: "personalization",
    label: "Personalization",
    headline: "Make it unmistakably yours.",
    copy: "Themes, wallpapers, and a full icon studio — DuoSpace reshapes itself around the two of you.",
    route: "/settings/appearance",
  },
];
