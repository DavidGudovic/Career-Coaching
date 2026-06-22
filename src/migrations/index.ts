import * as migration_20260622_120000_add_site_settings_theme from './20260622_120000_add_site_settings_theme'

export const migrations = [
  {
    up: migration_20260622_120000_add_site_settings_theme.up,
    down: migration_20260622_120000_add_site_settings_theme.down,
    name: '20260622_120000_add_site_settings_theme',
  },
]
