/*
  # Add Template Category System

  1. Schema Changes
    - Add `template_category` column to `templates` table
      - Type: TEXT with CHECK constraint
      - Allowed values: 'input-form', 'standard', 'free'
      - Default: 'input-form'

  2. Categories
    - input-form (输入框): Templates with input forms that trigger GA4 'bdd' event, then 'Add' event in modal
    - standard (通版): Templates with direct conversion buttons that immediately trigger traffic link
    - free (无料): Reserved for future free-tier templates

  3. Data Migration
    - Assign categories to existing templates based on slug patterns
    - Input-form category: analyzer, insights, intelligence, oracle, stock-usa, signm templates
    - Standard category: smartmoney, jp-stock templates

  4. Performance
    - Add index on template_category for efficient filtering queries
*/

-- Add template_category column with CHECK constraint
ALTER TABLE templates ADD COLUMN template_category TEXT DEFAULT 'input-form'
  CHECK(template_category IN ('input-form', 'standard', 'free'));

-- Create index for efficient category filtering
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(template_category);

-- Migrate existing templates to appropriate categories
-- Input-form category (输入框)
UPDATE templates
SET template_category = 'input-form'
WHERE slug IN (
  'ai-stock-analyzer',
  'ai-stock-insights',
  'ai-stock-intelligence',
  'ai-stock-oracle',
  'ai-stock-usa',
  'ai-stock-usa2',
  'ai-stock-usa3',
  'signm-stock-analysis'
);

-- Standard category (通版)
UPDATE templates
SET template_category = 'standard'
WHERE slug IN (
  'smartmoney-rank-default',
  'jp-stock-ai'
);

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (9);
