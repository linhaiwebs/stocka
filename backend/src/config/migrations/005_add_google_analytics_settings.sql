-- Migration 005: Add Google Analytics Settings to Site Settings
--
-- This migration adds support for global Google Analytics and Google Ads tracking.
--
-- Changes:
-- - Add google_ads_id column (TEXT, nullable) - stores AW-XXXXXXXXXX format
-- - Add google_analytics_id column (TEXT, nullable) - stores G-XXXXXXXXXX format
-- - Add google_ads_conversion_id column (TEXT, nullable) - stores full conversion tracking ID like AW-XXXXXXXXXX/YYYYYYYYYY
-- - Add conversion_event_name column (TEXT, default 'conversion') - stores event name for conversion tracking
-- - Add analytics_enabled column (BOOLEAN, default FALSE) - master switch to enable/disable all analytics injection
--
-- Security:
-- - No RLS changes needed (site_settings is admin-managed only)
--
-- Notes:
-- - analytics_enabled defaults to FALSE, meaning no tracking code is injected by default
-- - When analytics_enabled is FALSE, no tracking scripts are loaded regardless of whether IDs are configured
-- - This replaces the template-level tracking_code approach with centralized global configuration
-- - All analytics settings are managed through the admin Settings page and stored in the database

-- Add Google Analytics settings columns to site_settings table
ALTER TABLE site_settings ADD COLUMN google_ads_id TEXT;
ALTER TABLE site_settings ADD COLUMN google_analytics_id TEXT;
ALTER TABLE site_settings ADD COLUMN google_ads_conversion_id TEXT;
ALTER TABLE site_settings ADD COLUMN conversion_event_name TEXT DEFAULT 'conversion';
ALTER TABLE site_settings ADD COLUMN analytics_enabled INTEGER DEFAULT 0;

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (5);
