import { authRouter } from "./router/auth";
import { storeRoute } from "./router/store";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  store: storeRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
