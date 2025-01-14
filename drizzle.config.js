/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
    url: 'postgresql://AI-IntelliMocker-DB_owner:qk2DmTdY5Fpo@ep-round-band-a5mb8t50.us-east-2.aws.neon.tech/AI-IntelliMocker-DB?sslmode=require'
    }
  };
  