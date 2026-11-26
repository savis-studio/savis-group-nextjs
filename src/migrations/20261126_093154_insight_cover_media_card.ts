import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "insights" ADD COLUMN "cover_id" integer;
  ALTER TABLE "_insights_v" ADD COLUMN "version_cover_id" integer;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "insights_cover_idx" ON "insights" USING btree ("cover_id");
  CREATE INDEX "_insights_v_version_version_cover_idx" ON "_insights_v" USING btree ("version_cover_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "insights" DROP CONSTRAINT "insights_cover_id_media_id_fk";
  
  ALTER TABLE "_insights_v" DROP CONSTRAINT "_insights_v_version_cover_id_media_id_fk";
  
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "insights_cover_idx";
  DROP INDEX "_insights_v_version_version_cover_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "insights" DROP COLUMN "cover_id";
  ALTER TABLE "_insights_v" DROP COLUMN "version_cover_id";`)
}
