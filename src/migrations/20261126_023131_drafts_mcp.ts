import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload_mcp_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"insights_find" boolean DEFAULT false,
  	"insights_create" boolean DEFAULT false,
  	"insights_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  ALTER TABLE "insights_tags" ALTER COLUMN "tag" DROP NOT NULL;
  ALTER TABLE "insights_sources" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "insights_sources" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "cat" DROP NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "summary" DROP NOT NULL;
  ALTER TABLE "_insights_v_version_tags" ALTER COLUMN "tag" DROP NOT NULL;
  ALTER TABLE "_insights_v_version_sources" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "_insights_v_version_sources" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_title" DROP NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_slug" DROP NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_type" DROP NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_cat" DROP NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_summary" DROP NOT NULL;
  ALTER TABLE "insights" ADD COLUMN "_status" "enum_insights_status" DEFAULT 'draft';
  ALTER TABLE "_insights_v" ADD COLUMN "version__status" "enum__insights_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_insights_v" ADD COLUMN "latest" boolean;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
  CREATE INDEX "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
  CREATE INDEX "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
  CREATE INDEX "_insights_v_version_version__status_idx" ON "_insights_v" USING btree ("version__status");
  CREATE INDEX "_insights_v_latest_idx" ON "_insights_v" USING btree ("latest");
  CREATE INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");`)

  // Written by hand. Everything stored before drafts existed is on the website, so it stays published.
  // The newest version of each article is marked latest: the admin list reads drafts through that flag.
  await db.execute(sql`
   DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM "insights" i WHERE NOT EXISTS (SELECT 1 FROM "_insights_v" v WHERE v."parent_id" = i."id")) THEN
     RAISE EXCEPTION 'Some articles have no saved version; they would be missing from the admin list.';
    END IF;
   END $$;
  UPDATE "insights" SET "_status" = 'published';
  UPDATE "_insights_v" SET "version__status" = 'published', "latest" = false;
  UPDATE "_insights_v" SET "latest" = true WHERE "id" IN (
   SELECT DISTINCT ON ("parent_id") "id" FROM "_insights_v" WHERE "parent_id" IS NOT NULL
   ORDER BY "parent_id", "updated_at" DESC, "id" DESC);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_mcp_api_keys" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_mcp_api_keys" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk";
  
  DROP INDEX "insights__status_idx";
  DROP INDEX "_insights_v_version_version__status_idx";
  DROP INDEX "_insights_v_latest_idx";
  DROP INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx";
  DROP INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx";
  ALTER TABLE "insights_tags" ALTER COLUMN "tag" SET NOT NULL;
  ALTER TABLE "insights_sources" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "insights_sources" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "cat" SET NOT NULL;
  ALTER TABLE "insights" ALTER COLUMN "summary" SET NOT NULL;
  ALTER TABLE "_insights_v_version_tags" ALTER COLUMN "tag" SET NOT NULL;
  ALTER TABLE "_insights_v_version_sources" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "_insights_v_version_sources" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_title" SET NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_slug" SET NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_type" SET NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_cat" SET NOT NULL;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_summary" SET NOT NULL;
  ALTER TABLE "insights" DROP COLUMN "_status";
  ALTER TABLE "_insights_v" DROP COLUMN "version__status";
  ALTER TABLE "_insights_v" DROP COLUMN "latest";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_mcp_api_keys_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "payload_mcp_api_keys_id";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_status";`)
}
