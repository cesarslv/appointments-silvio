import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@acme/db/client";

import { env } from "../env";

export const config = {
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  secret: env.AUTH_SECRET,
  plugins: [expo(), oAuthProxy()],
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session;
