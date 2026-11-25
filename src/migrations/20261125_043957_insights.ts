import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_insights_type" AS ENUM('insight', 'news', 'press');
  CREATE TYPE "public"."enum__insights_v_version_type" AS ENUM('insight', 'news', 'press');
  CREATE TABLE "insights_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "insights_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_insights_type" DEFAULT 'insight' NOT NULL,
  	"cat" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"date_label" varchar,
  	"summary" varchar NOT NULL,
  	"order" numeric,
  	"scene" varchar,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_insights_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_insights_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_insights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_type" "enum__insights_v_version_type" DEFAULT 'insight' NOT NULL,
  	"version_cat" varchar NOT NULL,
  	"version_published_at" timestamp(3) with time zone,
  	"version_date_label" varchar,
  	"version_summary" varchar NOT NULL,
  	"version_order" numeric,
  	"version_scene" varchar,
  	"version_body" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "insights_id" integer;
  ALTER TABLE "insights_tags" ADD CONSTRAINT "insights_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_sources" ADD CONSTRAINT "insights_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_version_tags" ADD CONSTRAINT "_insights_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_version_sources" ADD CONSTRAINT "_insights_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "insights_tags_order_idx" ON "insights_tags" USING btree ("_order");
  CREATE INDEX "insights_tags_parent_id_idx" ON "insights_tags" USING btree ("_parent_id");
  CREATE INDEX "insights_sources_order_idx" ON "insights_sources" USING btree ("_order");
  CREATE INDEX "insights_sources_parent_id_idx" ON "insights_sources" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "insights_slug_idx" ON "insights" USING btree ("slug");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "_insights_v_version_tags_order_idx" ON "_insights_v_version_tags" USING btree ("_order");
  CREATE INDEX "_insights_v_version_tags_parent_id_idx" ON "_insights_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_insights_v_version_sources_order_idx" ON "_insights_v_version_sources" USING btree ("_order");
  CREATE INDEX "_insights_v_version_sources_parent_id_idx" ON "_insights_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_version_slug_idx" ON "_insights_v" USING btree ("version_slug");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "insights_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "insights_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "insights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v_version_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "insights_tags" CASCADE;
  DROP TABLE "insights_sources" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "_insights_v_version_tags" CASCADE;
  DROP TABLE "_insights_v_version_sources" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_insights_fk";
  
  DROP INDEX "payload_locked_documents_rels_insights_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "insights_id";
  DROP TYPE "public"."enum_insights_type";
  DROP TYPE "public"."enum__insights_v_version_type";`)
}
