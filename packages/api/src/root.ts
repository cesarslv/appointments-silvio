import { authRouter } from "./router/auth";
import { categoryRoute } from "./router/category";
import { serviceRoute } from "./router/service";
import { storeRoute } from "./router/store";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  store: storeRoute,
  service: serviceRoute,
  category: categoryRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
