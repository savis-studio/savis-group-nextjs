import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { AuditLogs } from "./collections/AuditLogs";
import { Industries } from "./collections/Industries";
import { Media } from "./collections/Media";
import { Pillars } from "./collections/Pillars";
import { Users } from "./collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL ?? "file:./data/payload.db";
const isProd = process.env.NODE_ENV === "production";

if (isProd && !process.env.PAYLOAD_SECRET) throw new Error("PAYLOAD_SECRET is required in production.");

// Origins allowed to call the API with cookies. SERVER_URL is the public site URL;
// ALLOWED_ORIGINS adds more (comma-separated). Never use "*".
const serverURL = process.env.SERVER_URL ?? "http://localhost:3000";
const origins = [serverURL, ...(process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean)];

export default buildConfig({
  serverURL,
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  collections: [Users, Media, Pillars, Industries, AuditLogs],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  graphQL: { disable: true },
  csrf: origins,
  cors: origins,
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  // SQLite for local work; set DATABASE_URL=postgres://... in staging and production.
  db: /^postgres(ql)?:/.test(databaseUrl)
    ? postgresAdapter({ pool: { connectionString: databaseUrl }, migrationDir: path.resolve(dirname, "migrations") })
    : sqliteAdapter({ client: { url: databaseUrl } }),
  sharp,
});
