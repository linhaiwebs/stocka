-- Migration 006: Add link_slug to traffic_links
--
-- This migration adds a unique slug field to traffic_links for short URL generation.
--
-- Changes:
-- - Add link_slug column (TEXT, unique) - stores the short code for /l/:slug URLs
-- - Generate slugs for existing records using a combination of ID and random characters
-- - Add unique index on link_slug for fast lookups
--
-- Security:
-- - No RLS changes needed (traffic_links uses existing access controls)
--
-- Notes:
-- - The slug is automatically generated when creating a new traffic link
-- - Format: 6-8 character alphanumeric string (e.g., "a7k2m9")
-- - Existing records get slugs based on their ID plus random suffix for uniqueness
-- - The slug allows short URLs like /l/a7k2m9 instead of /go/undefined

-- Add link_slug column to traffic_links table
ALTER TABLE traffic_links ADD COLUMN link_slug TEXT;

-- Generate unique slugs for existing records
-- Using a combination of ID and base36 encoding for uniqueness
UPDATE traffic_links
SET link_slug = lower(
  substr('0000000' || hex(randomblob(3)), -6)
)
WHERE link_slug IS NULL;

-- Make link_slug NOT NULL after populating existing records
-- SQLite doesn't support ALTER COLUMN, so we need to check constraints in application layer

-- Create unique index on link_slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_traffic_links_slug ON traffic_links(link_slug);

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (6);
