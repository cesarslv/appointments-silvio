import { api, HydrateClient } from "@/trpc/server";
import { StorePage } from "./_components/store-page";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  void api.store.getBySlug.prefetch({
    slug,
  });

  return (
    <HydrateClient>
      <StorePage />
    </HydrateClient>
  );
}
