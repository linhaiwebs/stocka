/*
  # Fix React Template Slugs

  1. Changes
    - Update React template slugs to match their manifest.json definitions
    - Fixes "aistockinsights" to "ai-stock-insights"
    - Fixes "smartmoneyrank-default" or similar to "smartmoney-rank-default"
    - Ensures consistency between frontend registry and backend database

  2. Details
    - Only updates templates with template_type = 'react'
    - Uses component_name to map to correct manifest slug
    - Maintains data integrity by preserving all other fields

  3. Security
    - Safe idempotent updates
    - Only affects React templates
    - No data loss risk
*/

-- Update AIStockInsights template slug to match manifest
UPDATE templates
SET slug = 'ai-stock-insights'
WHERE component_name = 'AIStockInsights'
  AND template_type = 'react'
  AND slug != 'ai-stock-insights';

-- Update SmartMoneyRankDefault template slug to match manifest
UPDATE templates
SET slug = 'smartmoney-rank-default'
WHERE component_name = 'SmartMoneyRankDefault'
  AND template_type = 'react'
  AND slug != 'smartmoney-rank-default';
