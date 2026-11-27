import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "insights" ALTER COLUMN "type" DROP DEFAULT;
  ALTER TABLE "_insights_v" ALTER COLUMN "version_type" DROP DEFAULT;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "insights" ALTER COLUMN "type" SET DEFAULT 'insight';
  ALTER TABLE "_insights_v" ALTER COLUMN "version_type" SET DEFAULT 'insight';`)
}
