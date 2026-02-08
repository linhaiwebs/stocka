-- Migration 004: Add Site Settings Table
--
-- This migration adds support for global site settings including:
-- 1. Copyright information and domain name for footer display
-- 2. Privacy Policy content (editable through admin panel)
-- 3. Terms of Service content (editable through admin panel)
--
-- New Tables:
-- - site_settings: Stores global site configuration with singleton pattern
--
-- Features:
-- - Single row table (enforced by id = 1)
-- - Default copyright text with current year
-- - Empty legal pages ready for admin customization
-- - Domain name automatically pulled from environment
-- - Timestamps for tracking updates

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  domain_name TEXT NOT NULL DEFAULT 'example.com',
  copyright_text TEXT NOT NULL DEFAULT '© 2024 All rights reserved.',
  privacy_policy_content TEXT DEFAULT '',
  terms_of_service_content TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings (singleton row)
INSERT OR IGNORE INTO site_settings (id, domain_name, copyright_text, privacy_policy_content, terms_of_service_content)
VALUES (
  1,
  'example.com',
  '© 2024 All rights reserved.',
  '# Privacy Policy

Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.

## Information We Collect
We collect information that you provide directly to us when you use our services.

## How We Use Your Information
We use the information we collect to provide, maintain, and improve our services.

## Contact Us
If you have any questions about this Privacy Policy, please contact us.',
  '# Terms of Service

Welcome to our service. By using our service, you agree to these terms.

## Use of Service
You agree to use our service only for lawful purposes and in accordance with these Terms.

## Limitation of Liability
We shall not be liable for any indirect, incidental, special, consequential or punitive damages.

## Contact Us
If you have any questions about these Terms, please contact us.'
);

-- Update schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (4);
