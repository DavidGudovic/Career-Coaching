import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Backfills the theme fields on the EXISTING site_settings row, which predates these
 * fields and therefore has NULLs (the admin shows them blank). Only fills NULLs, so it
 * never overwrites a value Jelena has chosen. Fresh installs already get these via the
 * field defaults; this is for the already-deployed row.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site_settings" SET "font_pairing" = 'fraunces-hanken' WHERE "font_pairing" IS NULL;
   UPDATE "site_settings" SET "color_teal_deep" = '#1c4e52' WHERE "color_teal_deep" IS NULL;
   UPDATE "site_settings" SET "color_teal" = '#2c636a' WHERE "color_teal" IS NULL;
   UPDATE "site_settings" SET "color_paper" = '#f6f2ea' WHERE "color_paper" IS NULL;
   UPDATE "site_settings" SET "color_ink" = '#14292b' WHERE "color_ink" IS NULL;
   UPDATE "site_settings" SET "color_mint" = '#9dc3b6' WHERE "color_mint" IS NULL;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: backfilled defaults aren't safely reversible (would clobber user edits).
}
