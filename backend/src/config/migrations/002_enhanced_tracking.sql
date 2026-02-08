-- Migration 002: Enhanced Tracking and React Template Support
--
-- This migration adds support for:
-- 1. React-based templates alongside HTML templates
-- 2. Enhanced visitor tracking (scroll depth, time on page, interactions)
-- 3. Google tracking code storage for templates
--
-- Tables Modified:
-- - templates: Added template_type, component_name, tracking_code columns
-- - visitors: Added scroll_depth_percent, time_on_page_seconds, interaction_events, last_interaction_at
--
-- New Indexes:
-- - idx_visitors_last_interaction for engagement queries
-- - idx_templates_template_type for filtering by type

-- Add new columns to templates table
ALTER TABLE templates ADD COLUMN template_type TEXT DEFAULT 'html' CHECK(template_type IN ('html', 'react'));
ALTER TABLE templates ADD COLUMN component_name TEXT;
ALTER TABLE templates ADD COLUMN tracking_code TEXT;

-- Add new columns to visitors table for enhanced tracking
ALTER TABLE visitors ADD COLUMN scroll_depth_percent INTEGER DEFAULT 0;
ALTER TABLE visitors ADD COLUMN time_on_page_seconds INTEGER DEFAULT 0;
ALTER TABLE visitors ADD COLUMN interaction_events TEXT DEFAULT '[]';
ALTER TABLE visitors ADD COLUMN last_interaction_at DATETIME;

-- Create new indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_template_type ON templates(template_type);
CREATE INDEX IF NOT EXISTS idx_visitors_last_interaction ON visitors(last_interaction_at);
CREATE INDEX IF NOT EXISTS idx_visitors_scroll_depth ON visitors(scroll_depth_percent);
CREATE INDEX IF NOT EXISTS idx_visitors_time_on_page ON visitors(time_on_page_seconds);

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (2);
