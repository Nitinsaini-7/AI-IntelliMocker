import { config } from "dotenv";

config({ path: ".env.local" });

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
  },
};