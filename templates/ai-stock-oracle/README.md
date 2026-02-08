# AI Stock Oracle Template

A modern, professional stock market intelligence landing page template with a dark theme and green accents.

## Design Features

### Color Scheme
- **Background**: Dark gradient from slate-900 through slate-800 to cyan-950
- **Primary Accent**: Bright green (#4ADE80, #22C55E)
- **Text**: White and light gray for optimal readability
- **Cards**: Semi-transparent dark backgrounds with green borders

### Layout Sections

1. **Top Badge**: "#1 Trading Platform in US" with green gradient background
2. **Hero Section**: Large gradient title "Stock Market Intelligence" with descriptive subtitle
3. **Features Grid**: 2x2 grid showcasing 4 key features:
   - Real-time Analysis (Zap icon)
   - 94% Accuracy (Target icon)
   - Market Sentiment (BarChart3 icon)
   - Risk Assessment (Shield icon)
4. **Statistics**: 3-column display of key metrics
5. **Input Section**: Stock symbol input field with focus effects
6. **Primary CTA**: "ANALYZE NOW" button with gradient green background
7. **Trust Badges**: 4 badge icons (Secure, Instant, Verified, Premium)
8. **Secondary CTA**: WhatsApp contact button with service availability
9. **Disclaimer**: Compliant disclaimer text for financial services

## Compliance

This template is designed to comply with Google Ads policies:
- No misleading claims or guaranteed returns
- Clear disclaimer about educational/informational purposes
- Historical performance metrics clearly labeled
- No static text making absolute predictions
- Focus on platform features rather than guaranteed outcomes

## Technical Implementation

### Analytics Tracking
- Dynamic script loading for visitor tracking
- Click tracking on both CTAs
- Conversion tracking for analysis and WhatsApp buttons

### Security
- No hardcoded external URLs
- Only opens traffic links when URL is available
- Uses `noopener,noreferrer` for external links
- Console logging for debugging

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly button sizes (44px minimum)
- Flexible grid layouts that stack on mobile

## User Interactions

1. **Stock Symbol Input**:
   - Auto-converts to uppercase
   - Enter key triggers analysis
   - Focus effect with green glow

2. **Primary CTA ("ANALYZE NOW")**:
   - Tracks click event
   - Triggers conversion tracking
   - Opens traffic link in new tab

3. **Secondary CTA (WhatsApp)**:
   - Separate tracking for WhatsApp conversions
   - Opens same traffic link with different tracking

## Icons Used

From `lucide-react`:
- Zap
- Target
- BarChart3
- Shield
- Lock
- CheckCircle
- Gem
- Smartphone

## Notes

- Template uses only Tailwind CSS classes (no custom CSS)
- All conversions route through the traffic link system
- No fallback URLs or external links without traffic link
- Includes comprehensive console logging for debugging
