-- Migration 003: Add CSS and JS Content Columns
--
-- This migration adds support for storing extracted CSS and JS separately from HTML.
--
-- The HTMLParser utility extracts <style> tags, inline styles, and <script> tags
-- from uploaded HTML templates. Previously, these were being extracted but not stored,
-- causing templates to display without any styling.
--
-- Tables Modified:
-- - templates: Added css_content and js_content columns
--
-- Benefits:
-- - Separate storage for HTML, CSS, and JS improves security
-- - Better performance through selective loading
-- - Easier content management and updates
-- - Allows independent sanitization of each content type

-- Add css_content column to store extracted CSS
ALTER TABLE templates ADD COLUMN css_content TEXT;

-- Add js_content column to store extracted JavaScript
ALTER TABLE templates ADD COLUMN js_content TEXT;

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (3);
