import { createFileRoute } from "@tanstack/react-router";
import MarketingHome from "@/marketing/pages/MarketingHome";
import { publishedReleaseQueryOptions } from "@/lib/release-queries";

const TITLE = "DuoSpace — Your Private World for Two";
const DESCRIPTION =
  "A private space for two. Chat, calls, memories, music, location and personalization — together, without an audience.";

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
    links: [{ rel: "canonical", href: "https://duo-release-hub.lovable.app/" }],
  }),
  component: MarketingHome,
});
