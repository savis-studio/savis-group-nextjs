import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_hubspot" AS ENUM('sent', 'failed');
  ALTER TABLE "inquiries" ADD COLUMN "hubspot" "enum_inquiries_hubspot";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiries" DROP COLUMN "hubspot";
  DROP TYPE "public"."enum_inquiries_hubspot";`)
}
