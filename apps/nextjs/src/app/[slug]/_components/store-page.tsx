"use client";

import { notFound, useParams } from "next/navigation";

import { api } from "@/trpc/react";

export function StorePage() {
  const { slug } = useParams();
  const [data] = api.store.getBySlug.useSuspenseQuery({
    slug: slug as string,
  });

  if (!data) {
    return notFound();
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <div>
        {data.services.map((service) => (
          <div key={service.id} className="flex flex-col">
            {service.name}
          </div>
        ))}
      </div>
    </div>
  );
}
