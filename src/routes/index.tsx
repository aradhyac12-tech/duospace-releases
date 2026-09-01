import { createFileRoute } from "@tanstack/react-router";
import MarketingHome from "@/marketing/pages/MarketingHome";
import { publishedReleaseQueryOptions } from "@/lib/release-queries";

const TITLE = "DuoSpace — A Private Space for Two";
const DESCRIPTION =
  "End-to-end encrypted chat, calls, a shared gallery, music, location and personalization — one private app built for exactly two people.";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedReleaseQueryOptions),

  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketingHome,
});
