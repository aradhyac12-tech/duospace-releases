import { queryOptions } from "@tanstack/react-query";

import { getPublishedRelease } from "@/lib/releases.functions";

export const publishedReleaseQueryOptions = queryOptions({
  queryKey: ["published-release"],
  queryFn: () => getPublishedRelease(),
  staleTime: 5 * 60 * 1000,
});
