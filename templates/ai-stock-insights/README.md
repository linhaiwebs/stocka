# AI Stock Insights Template

A modern, conversion-optimized landing page for AI-powered stock analysis with WhatsApp integration.

## Features

### Core Functionality
- **Stock Ticker Input**: Users can enter any US stock symbol (or leave empty, defaults to AAPL)
- **No Validation Required**: Button can be clicked regardless of input state
- **Custom Analytics**: Triggers `gtag('event', 'Bdd')` on scan button click
- **3-Second Loading Animation**: Beautiful scanning interface with progress bar
- **Step-by-step Progress**: 6 scanning steps with visual feedback
- **Modal Popup**: Results shown in a centered modal with backdrop
- **WhatsApp Integration**: Conversion button triggers WhatsApp with pre-filled message
- **Full Conversion Tracking**: Integrated with platform's analytics system

### Design Elements
- Sticky header with brand logo
- Animated stock ticker marquee
- Hero section with gradient background
- Feature benefits grid with icons
- Social proof testimonials
- Professional footer with disclaimers
- Fully responsive design (mobile-first)

### Technical Implementation
- Built with React + TypeScript
- Styled with Tailwind CSS
- Icons from lucide-react
- Uses TemplateContext for analytics
- Modal with backdrop blur effect
- Custom CSS animations for marquee and loading states

## User Flow

1. User lands on page
2. User enters stock symbol (optional - can be empty)
3. User clicks "Run AI Scan" button
   - Triggers `gtag('event', 'Bdd')`
   - Shows loading modal with progress animation
4. After 3 seconds, scan completes
5. Modal shows results with WhatsApp CTA button
6. Clicking WhatsApp button:
   - Triggers conversion tracking
   - Opens WhatsApp with pre-filled message
   - Includes stock symbol in message

## Conversion Tracking

The template tracks:
- Page views
- Scan button clicks
- WhatsApp CTA clicks (conversion event)
- Scroll depth
- Time on page
- All user interactions

## Customization Points

- Stock ticker items (TICKER_ITEMS array)
- Scan steps text (SCAN_STEPS array)
- Benefits content (BENEFITS array)
- Testimonials (TESTIMONIALS array)
- WhatsApp URL and message format
- Scan duration (currently 3 seconds)
- Colors and styling via Tailwind

## Template Metadata

- **Name**: AI Stock Insights
- **Category**: Finance
- **Version**: 1.0.0
- **Component Path**: ai-stock-insights
- **API Key**: Auto-generated on import

## Files

- `index.tsx` - Main React component
- `manifest.json` - Template metadata
- `README.md` - This documentation

## Integration Notes

This template is fully integrated with the landing page platform:
- Auto-imported via `npm run import-templates`
- Available in admin dashboard
- Can be assigned to traffic links
- All analytics tracked automatically
- Google Ads conversion supported
