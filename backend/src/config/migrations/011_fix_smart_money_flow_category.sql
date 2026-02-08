/*
  # Fix Smart Money Flow Universal Template Category

  1. Issue
    - The smart-money-flow-universal template was missing templateCategory in manifest.json
    - It was defaulting to 'input-form' category instead of 'standard'
    - This caused it to appear in the wrong category filter in the admin interface

  2. Changes
    - Update smart-money-flow-universal to 'standard' category
    - This is a 通版 template with no input fields and direct conversion flow

  3. Future Prevention
    - Enhanced detectTemplateCategory function now maps Chinese category names
    - Added support for hasInputFields and conversionType detection
    - All manifest files should include templateCategory field
*/

-- Update smart-money-flow-universal to standard category
UPDATE templates
SET template_category = 'standard'
WHERE slug = 'smart-money-flow-universal';

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (11);
