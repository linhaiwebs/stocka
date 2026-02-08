# Landing Page Templates

This folder contains HTML templates that are **automatically loaded** into the system on startup.

## 🚀 How It Works

The template system uses automatic scanning and seeding:

1. **Place HTML files** in this `templates/` directory
2. **Start the server** with `npm run dev`
3. **Templates are automatically imported** into the database
4. **Ready to use** immediately through the admin dashboard

No manual steps required! The system handles everything automatically.

## 📝 Template Metadata Format

Add metadata at the top of your HTML file using HTML comments:

```html
<!--
  Template-Name: Your Template Name
  Template-Description: A brief description of your template
  Template-Version: 1.0.0
  Template-Category: Finance
-->
<!DOCTYPE html>
<html>
  <!-- Your template content -->
</html>
```

**Metadata Fields:**
- `Template-Name` - Display name (if omitted, generated from filename)
- `Template-Description` - Brief description (optional)
- `Template-Version` - Version number (optional)
- `Template-Category` - Category/tag (optional)

## 📦 Available Templates

### SmartMoney Investor Tracker
- **File:** `smartmoney-investor-tracker.html`
- **Category:** Finance
- **Description:** Track billionaire investments and smart money activities
- **Features:**
  - Modern, clean design with gradient hero
  - Live ticker showing investment activities
  - SmartMoney Rank™ top 50 stocks table
  - Investor portfolio tracker (Buffett, Ackman, Dalio)
  - Features grid with 6 core features
  - FAQ section
  - Fully responsive (mobile-first)
  - Conversion tracking ready

## ✨ Creating New Templates

### Template Types

This system supports two types of templates:

1. **HTML Templates** - Traditional HTML files with embedded CSS/JS
2. **React Components** - Modern React-based templates with TypeScript

### React Component Templates

React templates provide better maintainability and dynamic functionality.

#### Directory Structure

Each React template must be in its own directory with these files:

```
templates/
  └─ my-template/
     ├─ manifest.json    (Required - template metadata)
     └─ index.tsx        (Required - React component)
```

#### manifest.json Format

The manifest.json file **must** contain these required fields:

```json
{
  "name": "My Template Name",
  "slug": "my-template-slug",
  "componentName": "MyTemplateName",
  "description": "Description of what this template does",
  "templateCategory": "standard",
  "category": "finance",
  "tags": ["tag1", "tag2"],
  "author": "Your Name"
}
```

**Required Fields:**
- `name` (string) - Display name for the template
- `slug` (string) - URL-friendly identifier (kebab-case, e.g., "my-template")
- `componentName` (string) - React component name (PascalCase, e.g., "MyTemplateName")

**Recommended Fields:**
- `description` (string) - Brief description of the template
- `templateCategory` (string) - Template type: "standard", "input-form", or "free"
- `category` (string) - Business category (e.g., "finance", "crypto", "marketing")

**Optional Fields:**
- `version` (string) - Version number (e.g., "1.0.0")
- `tags` (array) - Array of tag strings
- `author` (string) - Template creator name
- `hasInputFields` (boolean) - Whether template includes form inputs
- `conversionType` (string) - Type of conversion flow
- `isDefault` (boolean) - Whether this is the default template

#### CRITICAL: componentName Must Match Export

The `componentName` in manifest.json **MUST EXACTLY MATCH** the function name exported in index.tsx:

**manifest.json:**
```json
{
  "componentName": "MyAwesomeTemplate"
}
```

**index.tsx:**
```tsx
export default function MyAwesomeTemplate({ templateId, visitorId }: TemplateProps) {
  // Component code
}
```

**Validation:**
- The build process will validate all manifests before building
- Mismatched componentName will cause the build to fail
- Run `npm run validate:manifests` to check your templates

#### Creating a React Template

1. **Create the directory:**
   ```bash
   mkdir templates/my-awesome-template
   ```

2. **Create manifest.json:**
   ```bash
   cat > templates/my-awesome-template/manifest.json << 'EOF'
   {
     "name": "My Awesome Template",
     "slug": "my-awesome-template",
     "componentName": "MyAwesomeTemplate",
     "description": "An amazing React-based landing page",
     "templateCategory": "standard",
     "category": "marketing"
   }
   EOF
   ```

3. **Create index.tsx:**
   ```tsx
   import React from 'react';

   interface TemplateProps {
     templateId: string;
     visitorId: string;
   }

   export default function MyAwesomeTemplate({ templateId, visitorId }: TemplateProps) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
         <div className="container mx-auto px-4 py-16">
           <h1 className="text-4xl font-bold text-white text-center mb-8">
             Welcome to My Awesome Template
           </h1>
           <button
             data-conversion="signup"
             className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
           >
             Get Started
           </button>
         </div>
       </div>
     );
   }
   ```

4. **Validate your template:**
   ```bash
   npm run validate:manifests
   ```

5. **Build and test:**
   ```bash
   npm run build
   npm run dev
   ```

### HTML Templates (Legacy)

#### Quick Start

1. **Create a new HTML file** in this directory:
   ```bash
   touch templates/my-awesome-template.html
   ```

2. **Add metadata** at the top (optional but recommended):
   ```html
   <!--
     Template-Name: My Awesome Template
     Template-Description: An amazing landing page
     Template-Category: Marketing
   -->
   ```

3. **Build your template** using standard HTML/CSS/JavaScript

4. **Save the file** - that's it! Next server start will auto-import it

### Template Best Practices

**Structure Requirements:**
- Valid HTML5 document structure
- Responsive design (use mobile-first approach)
- Include proper `<head>` meta tags for SEO
- Clear call-to-action (CTA) elements
- Form inputs should use standard HTML attributes

**Design Guidelines:**
- Clean, professional appearance
- Fast loading times (optimize images, minimize CSS/JS)
- Cross-browser compatibility
- Accessibility considerations (ARIA labels, semantic HTML)

**Recommended Includes:**
- Email capture form
- Social proof elements (testimonials, trust badges)
- Clear value proposition
- Visual hierarchy and whitespace

## 🔄 Updating Templates

The system automatically detects changes:

1. **Modify your HTML file** in the `templates/` directory
2. **Restart the server** - changes are detected via content hash
3. **Template is updated** automatically in the database

To force update all templates regardless of changes:
```bash
npm run seed-templates:force
```

## 🛠️ Manual Template Management

While templates auto-load on server start, you can also manually trigger seeding:

```bash
# Import/update new or changed templates
npm run seed-templates

# Force reimport ALL templates (ignores change detection)
npm run seed-templates:force
```

## 📊 Template System Features

### Automatic Change Detection
- Uses SHA256 content hashing
- Only updates templates when content changes
- Skips unchanged templates (efficient restarts)

### Smart Import Logic
- Creates new templates if they don't exist
- Updates existing templates if content changed
- Preserves API keys and IDs on updates
- Prevents duplicate imports

### Logging & Tracking
- `template_seed_log` table tracks all imported templates
- Stores filename, content hash, and timestamp
- Console output shows import status (imported/updated/skipped/failed)

### Environment Control
- Set `AUTO_SEED_TEMPLATES=false` to disable auto-loading
- Useful for production environments with manual control needs

## 🎯 Template Usage Flow

```
1. Drop HTML file in templates/
   ↓
2. Server starts (npm run dev)
   ↓
3. Database initializes schema
   ↓
4. Template seeder scans directory
   ↓
5. Reads file & extracts metadata
   ↓
6. Checks if exists (by slug)
   ↓
7. Imports or updates in database
   ↓
8. Template available in admin dashboard
   ↓
9. Create traffic links & start tracking
```

## 📚 Example Template Structure

```html
<!--
  Template-Name: Crypto Newsletter Signup
  Template-Description: Newsletter signup for crypto investors
  Template-Version: 1.0.0
  Template-Category: Crypto
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crypto Newsletter</title>
  <style>
    /* Your styles */
  </style>
</head>
<body>
  <main>
    <h1>Stay Updated on Crypto Markets</h1>
    <form id="signup-form">
      <input type="email" placeholder="Your email" required>
      <button type="submit">Subscribe</button>
    </form>
  </main>
  <script>
    // Your conversion tracking
  </script>
</body>
</html>
```

## 📍 Conversion Tracking

Templates support conversion tracking through `data-conversion` attributes:

```html
<!-- Simple conversion -->
<button data-conversion>Sign Up</button>

<!-- Conversion with event name -->
<button data-conversion="premium-signup">Upgrade Now</button>

<!-- Conversion with value -->
<a href="#"
   data-conversion="purchase"
   data-conversion-value="99.99">
  Buy Now
</a>
```

The TemplateRenderer component automatically tracks these conversion events.

## 🔍 Troubleshooting

**Template not showing up?**
- Check console output during server start for errors
- Verify HTML file is in the `templates/` directory
- Ensure file has `.html` extension
- Check for HTML syntax errors

**Template not updating?**
- Content hash unchanged? Use `npm run seed-templates:force`
- Restart server to trigger rescan
- Check file permissions

**API Key issues?**
- API keys are preserved during updates
- Only new templates get fresh API keys
- Check `templates` table in database for existing keys

### React Template Issues

**Build failing with manifest errors?**
- Run `npm run validate:manifests` to see detailed errors
- Ensure manifest.json has all required fields: name, slug, componentName
- Check that componentName matches the export in index.tsx exactly
- Verify JSON syntax is correct (no trailing commas, proper quotes)

**Component not loading?**
- Check browser console for React errors
- Verify componentName in manifest matches export name in index.tsx
- Ensure index.tsx exports a default function, not a named export
- Check that TemplateProps interface is correctly used

**Template renders blank page?**
- Verify React component returns valid JSX
- Check for JavaScript errors in browser console
- Ensure all imports are correct and available
- Test component in isolation first

**Validation script failing?**
- Check that all templates have manifest.json files
- Verify all manifests have name, slug, and componentName
- Ensure componentName is PascalCase (e.g., MyTemplate, not myTemplate)
- Ensure slug is kebab-case (e.g., my-template, not MyTemplate)
- Check for typos in manifest.json field names

## 🚫 Deprecated Manual Methods

The following manual methods are **no longer needed** but documented for reference:

<details>
<summary>Old Manual Import Methods (Deprecated)</summary>

### Method 1: Using Scripts (Deprecated)
```bash
# Old way - NO LONGER NEEDED
cd backend
node scripts/add-smartmoney-template.js
```

### Method 2: Using API (Still works for manual control)
```bash
curl -X POST http://localhost:3001/api/admin/templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Template Name", "html_content": "HTML_HERE"}'
```

</details>

## 📖 Related Documentation

- [Admin Guide](../ADMIN_GUIDE.md) - Managing templates in admin dashboard
- [Setup Guide](../SETUP.md) - Initial system configuration
- [Quick Start](../QUICK_START.md) - Get up and running quickly
- [Architecture](../ARCHITECTURE.md) - System design overview

## 🎓 Template Guidelines

When creating new templates:

1. **Include conversion tracking** on all primary CTAs
2. **Use responsive design** with mobile-first approach
3. **Optimize performance** - minimize external dependencies
4. **Self-contained** - include all CSS and JS inline
5. **Professional design** - follow modern design principles
6. **Clear hierarchy** - guide users toward conversion actions
7. **Fast loading** - avoid large images or heavy scripts

## 💡 Tips

- Use semantic HTML for better SEO
- Optimize images using modern formats (WebP)
- Minimize CSS/JS for faster loading
- Test on multiple devices and browsers
- A/B test different versions using traffic distribution
- Track conversions on all important actions
- Use clear CTAs with action-oriented language
- Build trust with social proof and testimonials
