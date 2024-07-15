/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
    url: "postgresql://AIMockInterviewerDB_owner:azkjxcTv74ps@ep-muddy-thunder-a6hn0j5l.us-west-2.aws.neon.tech/AIMockInterviewerDB?sslmode=require"
    }
  };
  