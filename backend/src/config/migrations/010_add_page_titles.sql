/*
  # Add Page Title and Description Fields

  1. Changes to Templates Table
    - Add `page_title` column (TEXT) - Custom page title for SEO
    - Add `page_description` column (TEXT) - Meta description for SEO
    - These provide default title/description for each template

  2. Changes to Traffic Links Table
    - Add `page_title_override` column (TEXT) - Override template's page title
    - Add `page_description_override` column (TEXT) - Override template's description
    - These allow per-traffic-link customization for A/B testing

  3. Priority Logic
    - Traffic link override > Template custom > Template name > System default

  4. Notes
    - All fields are optional (NULL allowed)
    - Page title recommended length: 50-60 characters
    - Page description recommended length: 150-160 characters
    - Existing records remain unchanged (NULL values)
*/

-- Add page title and description fields to templates table
ALTER TABLE templates ADD COLUMN page_title TEXT;
ALTER TABLE templates ADD COLUMN page_description TEXT;

-- Add page title and description override fields to traffic_links table
ALTER TABLE traffic_links ADD COLUMN page_title_override TEXT;
ALTER TABLE traffic_links ADD COLUMN page_description_override TEXT;
