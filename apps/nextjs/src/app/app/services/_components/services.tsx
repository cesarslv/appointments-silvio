"use client";

import { useQueryState } from "nuqs";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { CreateCategoryButton } from "./create-category-button";
import { CreateServiceButton } from "./create-service-button";

export function Services() {
  const [services] = api.service.all.useSuspenseQuery();
  const [categories] = api.category.all.useSuspenseQuery();

  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "service",
  });

  const tabs = [
    {
      id: "service",
      title: "Serviços",
    },
    {
      id: "category",
      title: "Categorias",
    },
  ];

  const servicesEmpty = services.length < 1;
  const categoriesEmpty = categories.length < 1;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Serviços</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {tab !== "category" ? (
          <CreateServiceButton categories={categories} />
        ) : (
          <CreateCategoryButton />
        )}
      </header>

      <Tabs value={tab} onValueChange={setTab} className="w-full px-8">
        <TabsList className="h-auto rounded-none bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="service">
          <div className="mt-8 max-w-2xl">
            {services.map((service) => (
              <div key={service.id}>
                <h2>{service.name}</h2>
              </div>
            ))}

            {servicesEmpty ? "Nenhum serviço cadastrado" : null}
          </div>
        </TabsContent>

        <TabsContent value="category">
          <div className="mt-8 max-w-2xl">
            {categories.map((category) => (
              <div key={category.id}>
                <h2>{category.name}</h2>
              </div>
            ))}

            {categoriesEmpty ? "Nenhuma categoria cadastrada" : null}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
