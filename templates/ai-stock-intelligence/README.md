# AI Stock Intelligence Template

## Overview
Advanced market intelligence and predictive analysis platform powered by AI-driven real-time stock analysis.

## Design Features

### Color Scheme
- **Primary Colors**: Cyan/Teal (#22d3ee, #06b6d4) for borders, icons, and accents
- **Secondary Colors**: Purple/Magenta gradient (#a855f7 to #ec4899) for CTA buttons and labels
- **Background**: Deep teal gradient (from #0a4d5c to #083344)
- **Text Colors**: Light cyan/white (#e0f2fe) for headings, gray (#94a3b8) for body text
- **Warning Color**: Yellow (#fbbf24) for alert icons
- **Card Backgrounds**: Semi-transparent dark with cyan borders

### Layout Structure

#### Header Section
- Small chart icon in cyan circle (top left)
- "Advanced AI Market Platform" gray subtitle
- Main title "AI Stock Intelligence" in light cyan
- Subtitle "Advanced Market Intelligence & Predictive Analysis"

#### Feature Cards (2x2 Grid)
- Real-time Analysis (Zap icon)
- Advanced Analytics (CheckCircle icon)
- Market Sentiment (TrendingUp icon)
- Risk Assessment (BarChart3 icon)
Each card with cyan border, dark background, icon + text + description

#### Statistics Bar (3 Columns)
- $2.4B+ Assets Analyzed
- 150.0K+ Active Users
- 24/7 Market Coverage

#### Input Form Section
- "Stock Symbol" label in purple/magenta gradient
- Rounded input field with cyan border
- Large purple gradient "Analyze Now" button with Play icon

#### Risk Warning Box
- Yellow AlertTriangle icon
- "Risk Warning:" cyan heading
- Complete risk disclaimer text
- Cyan border with dark background

#### Trust Features (2x2 Grid at Bottom)
- Secure & Private (Lock icon)
- Instant Results (RefreshCw icon)
- Verified AI (ShieldCheck icon)
- Premium Quality (Heart icon)

### Interactive Features
- Hover effects on feature cards (subtle glow)
- Button hover with increased brightness
- Smooth transitions on all interactive elements
- Responsive grid layouts that stack on mobile

### Analysis Modal
- Loading animation with progress bar
- Step-by-step analysis progress
- Completion screen with conversion CTA
- Purple gradient conversion button

## Analytics Integration

### GA4 Events
- **"Bdd"** event: Triggered when user clicks "Analyze Now" button
- **"Add"** event: Triggered when user clicks conversion button after analysis

### Conversion Tracking
- Uses `gtag_report_conversion` for Google Ads conversion tracking
- Implements proper URL redirect after conversion
- Falls back to direct navigation if gtag is unavailable

## Technical Stack
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Template context for analytics and traffic link management

## Compliance
- Educational disclaimer included
- Risk warning prominently displayed
- Compliant with Google Ads policies
- No external fallback URLs
- Traffic link only used when available

## Version
1.0.0
