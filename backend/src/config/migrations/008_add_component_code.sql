/*
  # Add Component Code Column for Dynamic React Templates

  1. Changes
    - Add `component_code` column to `templates` table
      - Stores the full React component source code for dynamic rendering
      - Allows React templates to be modified in the database without recompiling
      - Only used when template_type = 'react'

  2. Benefits
    - React templates become fully dynamic like HTML templates
    - No need to rebuild/redeploy frontend when modifying React templates
    - Administrators can edit React component code directly in the database
    - Maintains backwards compatibility with statically-bundled templates

  3. Usage
    - HTML templates: Use html_content, css_content, js_content (unchanged)
    - React templates: Use component_code for full component source
    - Frontend will dynamically compile and render React components at runtime
*/

-- Add component_code column to store React component source code
ALTER TABLE templates ADD COLUMN component_code TEXT;

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (8);
