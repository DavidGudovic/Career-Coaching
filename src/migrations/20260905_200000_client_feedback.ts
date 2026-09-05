import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Additive migration: keeps all existing page text, media IDs and editor choices.
// Matches the schema produced by Payload 3.85.1 on a copy of the deployed DB.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_site_settings_font_pairing" ADD VALUE IF NOT EXISTS 'playfair-montserrat';
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "booking_url" varchar,
      ADD COLUMN IF NOT EXISTS "webinar_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "webinar_url" varchar,
      ADD COLUMN IF NOT EXISTS "newsletter_enabled" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "newsletter_url" varchar;
    ALTER TABLE "site_settings_locales"
      ADD COLUMN IF NOT EXISTS "nav_blog_label" varchar,
      ADD COLUMN IF NOT EXISTS "blog_all_label" varchar,
      ADD COLUMN IF NOT EXISTS "nav_resources_label" varchar,
      ADD COLUMN IF NOT EXISTS "webinar_title" varchar,
      ADD COLUMN IF NOT EXISTS "webinar_text" varchar,
      ADD COLUMN IF NOT EXISTS "webinar_button_label" varchar,
      ADD COLUMN IF NOT EXISTS "newsletter_title" varchar,
      ADD COLUMN IF NOT EXISTS "newsletter_text" varchar,
      ADD COLUMN IF NOT EXISTS "newsletter_button_label" varchar;

    CREATE TABLE IF NOT EXISTS "resources_page" (
      "id" serial PRIMARY KEY,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    CREATE TABLE IF NOT EXISTS "resources_page_locales" (
      "eyebrow" varchar DEFAULT 'Besplatni resursi',
      "headline" varchar DEFAULT 'Mali koraci za _tvoju_ karijeru.',
      "sub" varchar DEFAULT 'Vodiči i vježbe koji ti pomažu da zastaneš, razmisliš i napraviš sljedeći korak — svojim tempom.',
      "empty_text" varchar DEFAULT 'Prvi besplatni resurs stiže uskoro. Svrati ponovo.',
      "id" serial PRIMARY KEY,
      "_locale" "public"."_locales" NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "resources_page"("id") ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "resources_page_locales_locale_parent_id_unique" ON "resources_page_locales" ("_locale", "_parent_id");
    CREATE TABLE IF NOT EXISTS "resources_page_resources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "resources_page"("id") ON DELETE CASCADE,
      "_locale" "public"."_locales" NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "description" varchar,
      "file_id" integer NOT NULL REFERENCES "media"("id") ON DELETE SET NULL,
      "button_label" varchar
    );
    CREATE INDEX IF NOT EXISTS "resources_page_resources_order_idx" ON "resources_page_resources" ("_order");
    CREATE INDEX IF NOT EXISTS "resources_page_resources_parent_id_idx" ON "resources_page_resources" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "resources_page_resources_locale_idx" ON "resources_page_resources" ("_locale");
    CREATE INDEX IF NOT EXISTS "resources_page_resources_file_idx" ON "resources_page_resources" ("file_id");

    INSERT INTO "resources_page" ("created_at", "updated_at")
      SELECT now(), now() WHERE NOT EXISTS (SELECT 1 FROM "resources_page");
    INSERT INTO "resources_page_locales" ("_parent_id", "_locale", "eyebrow", "headline", "sub", "empty_text")
      SELECT "id", 'me', 'Besplatni resursi', 'Mali koraci za _tvoju_ karijeru.',
        'Vodiči i vježbe koji ti pomažu da zastaneš, razmisliš i napraviš sljedeći korak — svojim tempom.',
        'Prvi besplatni resurs stiže uskoro. Svrati ponovo.' FROM "resources_page"
      ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
    INSERT INTO "resources_page_locales" ("_parent_id", "_locale", "eyebrow", "headline", "sub", "empty_text")
      SELECT "id", 'en', 'Free resources', 'Small steps for _your_ career.',
        'Guides and exercises to help you pause, reflect and take your next step — at your own pace.',
        'The first free resource is coming soon. Check back here.' FROM "resources_page"
      ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

    -- Fix spelling in the existing blog headings, including content edited since seeding.
    -- URLs stay unchanged so shared links continue working.
    UPDATE "home_page_locales" SET
      "blog_eyebrow" = replace(replace("blog_eyebrow", 'bjeleške', 'bilješke'), 'Bjeleške', 'Bilješke'),
      "blog_headline" = replace(replace("blog_headline", 'bjeleške', 'bilješke'), 'Bjeleške', 'Bilješke')
      WHERE "_locale" = 'me';
    UPDATE "blog_page_locales" SET
      "eyebrow" = replace(replace("eyebrow", 'bjeleške', 'bilješke'), 'Bjeleške', 'Bilješke'),
      "headline" = replace(replace("headline", 'bjeleške', 'bilješke'), 'Bjeleške', 'Bilješke'),
      "sub" = replace(replace("sub", 'bjeleške', 'bilješke'), 'Bjeleške', 'Bilješke')
      WHERE "_locale" = 'me';
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Preserve uploaded resources and editor changes on rollback. Older app versions
  // safely ignore these additive fields; dropping them would destroy client content.
}
