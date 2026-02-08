-- Landing Page Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  html_content TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  is_default BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Traffic Links Table
CREATE TABLE IF NOT EXISTS traffic_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

-- Visitors Table
CREATE TABLE IF NOT EXISTS visitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT UNIQUE NOT NULL,
  template_id INTEGER NOT NULL,
  traffic_link_id INTEGER,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
  page_views INTEGER DEFAULT 1,
  converted BOOLEAN DEFAULT 0,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (traffic_link_id) REFERENCES traffic_links(id) ON DELETE SET NULL
);

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  template_id INTEGER NOT NULL,
  traffic_link_id INTEGER,
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (traffic_link_id) REFERENCES traffic_links(id) ON DELETE SET NULL
);

-- Conversions Table
CREATE TABLE IF NOT EXISTS conversions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  template_id INTEGER NOT NULL,
  traffic_link_id INTEGER,
  converted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (traffic_link_id) REFERENCES traffic_links(id) ON DELETE SET NULL
);

-- Database Version Table for Migrations
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Template Seed Log Table (tracks auto-imported templates)
CREATE TABLE IF NOT EXISTS template_seed_log (
  template_id INTEGER PRIMARY KEY,
  filename TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  seeded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_api_key ON templates(api_key);
CREATE INDEX IF NOT EXISTS idx_templates_is_default ON templates(is_default);
CREATE INDEX IF NOT EXISTS idx_traffic_links_template_id ON traffic_links(template_id);
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_template_id ON visitors(template_id);
CREATE INDEX IF NOT EXISTS idx_visitors_traffic_link_id ON visitors(traffic_link_id);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_template_id ON page_views(template_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_conversions_visitor_id ON conversions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversions_template_id ON conversions(template_id);
CREATE INDEX IF NOT EXISTS idx_conversions_converted_at ON conversions(converted_at);

-- Insert initial schema version
INSERT OR IGNORE INTO schema_version (version) VALUES (1);
