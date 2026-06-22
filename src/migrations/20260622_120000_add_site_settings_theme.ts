import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the "Izgled sajta" theme fields to site_settings (font pairing + 5 brand colors).
 *
 * Production never runs Payload's dev `push` (the standalone runner has no drizzle-kit and
 * NODE_ENV=production), so schema changes reach prod through `prodMigrations` instead — this
 * file runs on boot. Written to mirror exactly what `push` produced in dev and to be
 * idempotent (guarded CREATE TYPE + ADD COLUMN IF NOT EXISTS) so it's safe on a DB that
 * already has these columns.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_font_pairing" AS ENUM('fraunces-hanken', 'playfair-inter', 'lora-sourcesans', 'cormorant-worksans');
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;

   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "font_pairing" "enum_site_settings_font_pairing";
   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "color_teal_deep" varchar;
   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "color_teal" varchar;
   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "color_paper" varchar;
   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "color_ink" varchar;
   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "color_mint" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "font_pairing";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "color_teal_deep";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "color_teal";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "color_paper";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "color_ink";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "color_mint";
   DROP TYPE IF EXISTS "public"."enum_site_settings_font_pairing";
  `)
}
