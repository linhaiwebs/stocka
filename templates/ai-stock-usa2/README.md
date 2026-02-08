# AI Stock Prediction USA (ai-stock-usa2)

A modern, conversion-focused landing page template for AI-powered stock analysis with a beautiful purple gradient design.

## Features

- **Stunning Visual Design**: Purple gradient background with clean white card layout
- **AI Stock Analysis**: Real-time stock symbol input with AI-powered predictions
- **Interactive Elements**:
  - Animated feature cards showcasing key benefits
  - Progress indicator dots
  - Trust badges (Secure, Instant, Free)
- **Loading Animation**: Professional multi-step scanning process with progress bar
- **Success Modal**: Engaging completion screen with call-to-action
- **Conversion Tracking**: Integrated analytics with button click and conversion tracking
- **Traffic Link Integration**: Automatic redirection to configured URLs or WhatsApp fallback
- **Responsive Design**: Optimized for all device sizes

## Design Elements

### Main Landing Page
- **Logo Section**: StockAI branding with robot icon
- **Headline**: "AI Stock Prediction" with descriptive subtitle
- **Feature Cards**: Three animated cards (Instant Analysis, Market Insights, Expert Advice)
- **Input Field**: Stock symbol entry with placeholder examples
- **CTA Button**: Gradient "Analyze with AI" button with icon
- **Trust Indicators**: Three badge pills showing security, speed, and cost benefits
- **Disclaimer**: Educational purpose notice

### Loading State
- **Modal Overlay**: Dark backdrop with blur effect
- **Progress Display**: Percentage-based progress bar with gradient
- **Step Tracker**: Six-step analysis process with checkmarks
- **Active Indicators**: Real-time step highlighting

### Success State
- **Completion Icon**: Large green checkmark
- **Success Message**: Personalized with stock symbol
- **Info Box**: Context-aware description based on traffic link availability
- **Conversion Button**: Adapts text/icon for traffic link or WhatsApp

## Conversion Tracking

The template implements comprehensive conversion tracking:

1. **Button Clicks**:
   - `trackClick('analyze-button', 'button')` - When user starts analysis
   - `trackClick('get-report', 'button')` - When user clicks final CTA

2. **Conversions**:
   - `trackConversion('stock-analysis')` - Before redirecting to traffic link

3. **Traffic Links**:
   - Primary: Opens `trafficLink.url` if configured
   - Fallback: WhatsApp message with stock symbol

## Technical Implementation

### State Management
- Stock symbol input
- Loading and modal visibility
- Progress tracking (0-100%)
- Step completion tracking
- Active feature rotation

### Analytics Integration
- Loads tracking script from backend API
- Google Ads conversion trigger support
- Proper cleanup on component unmount

### User Experience
- Keyboard support (Enter key submits)
- Click-outside to close modal
- Smooth animations and transitions
- Active state feedback
- Hover effects

## Usage

This template automatically registers with the template system. To use:

1. Ensure the template files are in `templates/ai-stock-usa2/`
2. Run `npm run generate:templates` to register
3. Build the project with `npm run build`
4. Access via admin dashboard or direct URL

## Customization

The template uses:
- Purple/indigo color scheme (avoiding pure violet)
- Lucide React icons
- Tailwind CSS for styling
- Gradient backgrounds and buttons
- Professional animations

## Best Practices

- Input validation with fallback to 'AAPL'
- Loading state prevents multiple submissions
- Clear visual feedback at each stage
- Accessible design with proper focus states
- Mobile-responsive layout

## Integration Notes

- Uses `useTemplate()` hook for tracking functions
- Integrates with backend analytics service
- Supports Google Analytics/Ads events
- Compatible with traffic link management system
- WhatsApp fallback for missing traffic links
