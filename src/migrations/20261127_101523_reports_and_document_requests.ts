import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reports_kind" AS ENUM('report', 'whitepaper');
  CREATE TYPE "public"."enum_reports_palette" AS ENUM('identity', 'cyber', 'ai', 'wallet', 'mea', 'bank', 'corp', 'app', 'pwl', 'tp', 'qt', 'ng', 'fr', 'sg', 'zt', 'dt', 'pk', 'ip', 'mp', 'ta', 'hs', 'nd', 'pp', 'eu', 'gg');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_kind" AS ENUM('report', 'whitepaper');
  CREATE TYPE "public"."enum__reports_v_version_palette" AS ENUM('identity', 'cyber', 'ai', 'wallet', 'mea', 'bank', 'corp', 'app', 'pwl', 'tp', 'qt', 'ng', 'fr', 'sg', 'zt', 'dt', 'pk', 'ip', 'mp', 'ta', 'hs', 'nd', 'pp', 'eu', 'gg');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_document_requests_hubspot" AS ENUM('sent', 'failed');
  CREATE TYPE "public"."enum_document_requests_status" AS ENUM('new', 'sent', 'spam');
  CREATE TABLE "reports_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "reports_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "reports_editions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"audience" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "reports_learn" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "reports_previews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"diagram" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "reports_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "reports_questions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "reports_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"kind" "enum_reports_kind",
  	"topic" varchar,
  	"palette" "enum_reports_palette",
  	"published_at" timestamp(3) with time zone,
  	"order" numeric,
  	"featured" boolean DEFAULT false,
  	"subtitle" varchar,
  	"hook" varchar,
  	"lead" varchar,
  	"series_name" varchar,
  	"series_part" numeric,
  	"series_parts" numeric,
  	"series_summary" varchar,
  	"credit" varchar,
  	"questions_heading" varchar,
  	"questions_intro" varchar,
  	"path_title" varchar,
  	"path_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reports_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "reports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_reports_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_editions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"audience" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_learn" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_previews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"diagram" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_questions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v_version_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_kind" "enum__reports_v_version_kind",
  	"version_topic" varchar,
  	"version_palette" "enum__reports_v_version_palette",
  	"version_published_at" timestamp(3) with time zone,
  	"version_order" numeric,
  	"version_featured" boolean DEFAULT false,
  	"version_subtitle" varchar,
  	"version_hook" varchar,
  	"version_lead" varchar,
  	"version_series_name" varchar,
  	"version_series_part" numeric,
  	"version_series_parts" numeric,
  	"version_series_summary" varchar,
  	"version_credit" varchar,
  	"version_questions_heading" varchar,
  	"version_questions_intro" varchar,
  	"version_path_title" varchar,
  	"version_path_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reports_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_reports_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "document_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"document_title" varchar NOT NULL,
  	"document_id" integer,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"job_title" varchar,
  	"phone" varchar,
  	"consent_text" varchar NOT NULL,
  	"marketing_opt_in" boolean DEFAULT false,
  	"source_path" varchar,
  	"hubspot" "enum_document_requests_hubspot",
  	"status" "enum_document_requests_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "document_requests_id" integer;
  ALTER TABLE "reports_stats" ADD CONSTRAINT "reports_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_why" ADD CONSTRAINT "reports_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_editions" ADD CONSTRAINT "reports_editions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_learn" ADD CONSTRAINT "reports_learn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_previews" ADD CONSTRAINT "reports_previews_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_previews" ADD CONSTRAINT "reports_previews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_chapters" ADD CONSTRAINT "reports_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_questions_items" ADD CONSTRAINT "reports_questions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_board" ADD CONSTRAINT "reports_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_texts" ADD CONSTRAINT "reports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_stats" ADD CONSTRAINT "_reports_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_why" ADD CONSTRAINT "_reports_v_version_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_editions" ADD CONSTRAINT "_reports_v_version_editions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_learn" ADD CONSTRAINT "_reports_v_version_learn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_previews" ADD CONSTRAINT "_reports_v_version_previews_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_version_previews" ADD CONSTRAINT "_reports_v_version_previews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_chapters" ADD CONSTRAINT "_reports_v_version_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_questions_items" ADD CONSTRAINT "_reports_v_version_questions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_board" ADD CONSTRAINT "_reports_v_version_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_texts" ADD CONSTRAINT "_reports_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_document_id_reports_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "reports_stats_order_idx" ON "reports_stats" USING btree ("_order");
  CREATE INDEX "reports_stats_parent_id_idx" ON "reports_stats" USING btree ("_parent_id");
  CREATE INDEX "reports_why_order_idx" ON "reports_why" USING btree ("_order");
  CREATE INDEX "reports_why_parent_id_idx" ON "reports_why" USING btree ("_parent_id");
  CREATE INDEX "reports_editions_order_idx" ON "reports_editions" USING btree ("_order");
  CREATE INDEX "reports_editions_parent_id_idx" ON "reports_editions" USING btree ("_parent_id");
  CREATE INDEX "reports_learn_order_idx" ON "reports_learn" USING btree ("_order");
  CREATE INDEX "reports_learn_parent_id_idx" ON "reports_learn" USING btree ("_parent_id");
  CREATE INDEX "reports_previews_order_idx" ON "reports_previews" USING btree ("_order");
  CREATE INDEX "reports_previews_parent_id_idx" ON "reports_previews" USING btree ("_parent_id");
  CREATE INDEX "reports_previews_image_idx" ON "reports_previews" USING btree ("image_id");
  CREATE INDEX "reports_chapters_order_idx" ON "reports_chapters" USING btree ("_order");
  CREATE INDEX "reports_chapters_parent_id_idx" ON "reports_chapters" USING btree ("_parent_id");
  CREATE INDEX "reports_questions_items_order_idx" ON "reports_questions_items" USING btree ("_order");
  CREATE INDEX "reports_questions_items_parent_id_idx" ON "reports_questions_items" USING btree ("_parent_id");
  CREATE INDEX "reports_board_order_idx" ON "reports_board" USING btree ("_order");
  CREATE INDEX "reports_board_parent_id_idx" ON "reports_board" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX "reports__status_idx" ON "reports" USING btree ("_status");
  CREATE INDEX "reports_texts_order_parent" ON "reports_texts" USING btree ("order","parent_id");
  CREATE INDEX "_reports_v_version_stats_order_idx" ON "_reports_v_version_stats" USING btree ("_order");
  CREATE INDEX "_reports_v_version_stats_parent_id_idx" ON "_reports_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_why_order_idx" ON "_reports_v_version_why" USING btree ("_order");
  CREATE INDEX "_reports_v_version_why_parent_id_idx" ON "_reports_v_version_why" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_editions_order_idx" ON "_reports_v_version_editions" USING btree ("_order");
  CREATE INDEX "_reports_v_version_editions_parent_id_idx" ON "_reports_v_version_editions" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_learn_order_idx" ON "_reports_v_version_learn" USING btree ("_order");
  CREATE INDEX "_reports_v_version_learn_parent_id_idx" ON "_reports_v_version_learn" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_previews_order_idx" ON "_reports_v_version_previews" USING btree ("_order");
  CREATE INDEX "_reports_v_version_previews_parent_id_idx" ON "_reports_v_version_previews" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_previews_image_idx" ON "_reports_v_version_previews" USING btree ("image_id");
  CREATE INDEX "_reports_v_version_chapters_order_idx" ON "_reports_v_version_chapters" USING btree ("_order");
  CREATE INDEX "_reports_v_version_chapters_parent_id_idx" ON "_reports_v_version_chapters" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_questions_items_order_idx" ON "_reports_v_version_questions_items" USING btree ("_order");
  CREATE INDEX "_reports_v_version_questions_items_parent_id_idx" ON "_reports_v_version_questions_items" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_board_order_idx" ON "_reports_v_version_board" USING btree ("_order");
  CREATE INDEX "_reports_v_version_board_parent_id_idx" ON "_reports_v_version_board" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_parent_idx" ON "_reports_v" USING btree ("parent_id");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v" USING btree ("version_slug");
  CREATE INDEX "_reports_v_version_version_updated_at_idx" ON "_reports_v" USING btree ("version_updated_at");
  CREATE INDEX "_reports_v_version_version_created_at_idx" ON "_reports_v" USING btree ("version_created_at");
  CREATE INDEX "_reports_v_version_version__status_idx" ON "_reports_v" USING btree ("version__status");
  CREATE INDEX "_reports_v_created_at_idx" ON "_reports_v" USING btree ("created_at");
  CREATE INDEX "_reports_v_updated_at_idx" ON "_reports_v" USING btree ("updated_at");
  CREATE INDEX "_reports_v_latest_idx" ON "_reports_v" USING btree ("latest");
  CREATE INDEX "_reports_v_texts_order_parent" ON "_reports_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "document_requests_document_idx" ON "document_requests" USING btree ("document_id");
  CREATE INDEX "document_requests_email_idx" ON "document_requests" USING btree ("email");
  CREATE INDEX "document_requests_updated_at_idx" ON "document_requests" USING btree ("updated_at");
  CREATE INDEX "document_requests_created_at_idx" ON "document_requests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_document_requests_fk" FOREIGN KEY ("document_requests_id") REFERENCES "public"."document_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_document_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("document_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_why" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_editions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_learn" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_previews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_chapters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_questions_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_board" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_why" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_editions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_learn" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_previews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_chapters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_questions_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_board" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "document_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports_stats" CASCADE;
  DROP TABLE "reports_why" CASCADE;
  DROP TABLE "reports_editions" CASCADE;
  DROP TABLE "reports_learn" CASCADE;
  DROP TABLE "reports_previews" CASCADE;
  DROP TABLE "reports_chapters" CASCADE;
  DROP TABLE "reports_questions_items" CASCADE;
  DROP TABLE "reports_board" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_texts" CASCADE;
  DROP TABLE "_reports_v_version_stats" CASCADE;
  DROP TABLE "_reports_v_version_why" CASCADE;
  DROP TABLE "_reports_v_version_editions" CASCADE;
  DROP TABLE "_reports_v_version_learn" CASCADE;
  DROP TABLE "_reports_v_version_previews" CASCADE;
  DROP TABLE "_reports_v_version_chapters" CASCADE;
  DROP TABLE "_reports_v_version_questions_items" CASCADE;
  DROP TABLE "_reports_v_version_board" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "_reports_v_texts" CASCADE;
  DROP TABLE "document_requests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reports_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_document_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_reports_id_idx";
  DROP INDEX "payload_locked_documents_rels_document_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reports_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "document_requests_id";
  DROP TYPE "public"."enum_reports_kind";
  DROP TYPE "public"."enum_reports_palette";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_kind";
  DROP TYPE "public"."enum__reports_v_version_palette";
  DROP TYPE "public"."enum__reports_v_version_status";
  DROP TYPE "public"."enum_document_requests_hubspot";
  DROP TYPE "public"."enum_document_requests_status";`)
}
