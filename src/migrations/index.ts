import * as migration_20260622_120000_add_site_settings_theme from './20260622_120000_add_site_settings_theme'
import * as migration_20260622_130000_backfill_site_settings_theme_defaults from './20260622_130000_backfill_site_settings_theme_defaults'

export const migrations = [
  {
    up: migration_20260622_120000_add_site_settings_theme.up,
    down: migration_20260622_120000_add_site_settings_theme.down,
    name: '20260622_120000_add_site_settings_theme',
  },
  {
    up: migration_20260622_130000_backfill_site_settings_theme_defaults.up,
    down: migration_20260622_130000_backfill_site_settings_theme_defaults.down,
    name: '20260622_130000_backfill_site_settings_theme_defaults',
  },
]
