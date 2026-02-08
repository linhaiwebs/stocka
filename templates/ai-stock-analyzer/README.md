# AI Stock Analyzer

A next-generation AI-powered stock analysis landing page featuring a modern dark theme with cyan accents. This template provides an immersive user experience for stock market analysis with real-time data visualization and AI-driven insights.

## Features

### Design & User Experience
- **Modern Dark Theme**: Sleek slate and blue gradient background with cyan accent colors
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop screens
- **Smooth Animations**: Fade-in effects, progress indicators, and seamless transitions
- **Live User Counter**: Static display showing active users (4,696 users online)
- **Scrolling Stock Ticker**: Auto-scrolling marquee displaying real-time market data

### Core Functionality
- **Stock Symbol Input**: Clean, focused input field for entering stock tickers
- **AI Analysis Simulation**: Multi-step analysis process with progress tracking
- **Modal Interface**: Full-screen modal showing analysis progress and results
- **Conversion Tracking**: Integrated analytics and conversion tracking
- **Traffic Link Integration**: Support for custom traffic URLs or WhatsApp fallback

### Key Sections

1. **Hero Section**
   - AI Stock Analyzer branding with live status indicator
   - Large headline: "AI Stock Assistant - Next-Generation Stock Analysis"
   - Tagline: "Organizing fundamentals and technicals"
   - Live user counter with animated pulse dot
   - Stock symbol input with large "Analyze" button

2. **Features Section**
   - Three feature cards with icons:
     - AI Stock Analysis
     - Market Forecast
     - Instant Diagnostics
   - Hover effects with cyan border highlights

3. **User Reviews Section**
   - Three review cards with user testimonials
   - Auto-scrolling carousel (5-second intervals)
   - User avatars and credentials
   - Active review indicator with pagination dots

4. **Stock Ticker**
   - Horizontal scrolling ticker with major stocks (XOM, META, JPM, AAPL, GOOGL, AMZN, MSFT, NVDA)
   - Color-coded percentage changes (green for positive, red for negative)
   - Seamless infinite scroll animation

5. **Educational Disclosure**
   - Comprehensive legal and educational disclaimers
   - Five disclosure sections with detailed information
   - Copyright notice and educational program statement

### Analysis Modal

The modal displays:
- **Loading State**:
  - Spinning cyan loader
  - Progress bar (0-100%)
  - Six analysis steps with checkmarks
  - Real-time step updates
- **Complete State**:
  - Success icon with cyan background
  - Analysis complete message
  - Call-to-action button (traffic link or WhatsApp)
  - Full report access option

### Analytics Integration

- **Event Tracking**: Custom event tracking for button clicks and conversions
- **GTM Integration**: Google Tag Manager event firing (Bdd event)
- **Traffic Link Support**: Configurable traffic URLs for conversion tracking
- **Console Logging**: Debug information for traffic link data

### Technical Details

**Technologies**:
- React with TypeScript
- Lucide React icons (Activity, BarChart2, Zap, User, X, CheckCircle, TrendingUp, ArrowRight)
- Tailwind CSS for styling
- Template Context for tracking hooks

**State Management**:
- `tickerInput`: User input for stock symbol
- `isAnalyzing`: Loading state during analysis
- `showModal`: Modal visibility control
- `analysisProgress`: Progress percentage (0-100)
- `currentStep`: Current analysis step index
- `completedSteps`: Array of completed step indices
- `analyzedSymbol`: The stock symbol being analyzed
- `activeReview`: Current active review for carousel

**Animations**:
- `marquee`: 30-second infinite scroll for stock ticker
- `fadeIn`: Smooth fade-in effect for modal content
- `spin`: Rotating loader animation
- `pulse`: Animated dot for live indicator

### Color Scheme

- **Backgrounds**: slate-950, slate-900, slate-800
- **Accent**: cyan-400, cyan-500, cyan-600
- **Text**: white, slate-300, slate-400, slate-500
- **Success**: emerald-400
- **Error**: red-400
- **Borders**: slate-700, cyan-500

### Conversion Flow

1. User enters stock symbol (or uses default 'AAPL')
2. Clicks "Analyze" button (tracked via `analyze-button` event)
3. Modal opens with loading animation
4. Progress bar advances through 6 analysis steps
5. Analysis completes after simulation
6. User presented with CTA button
7. On click, tracks conversion (`whatsapp-cta` button, `whatsapp` conversion)
8. Opens traffic link URL or WhatsApp with pre-filled message

### Customization

To customize the template:
- **Stock Ticker**: Modify `TICKER_ITEMS` array
- **Analysis Steps**: Update `ANALYSIS_STEPS` array
- **Features**: Edit `FEATURES` array with custom icons and descriptions
- **Reviews**: Change `REVIEWS` array for different testimonials
- **Disclosure**: Update `DISCLOSURE_SECTIONS` for custom legal text
- **Colors**: Adjust Tailwind CSS classes for different color schemes
- **User Count**: Change static value in hero section

## Usage

This template automatically integrates with the template system and requires:
- `templateId`: Unique identifier for analytics tracking
- `visitorId`: Unique visitor identifier
- `trafficLink`: Optional traffic link data from context

The template will automatically:
1. Load analytics tracking script
2. Track user interactions
3. Handle conversions
4. Display appropriate CTAs based on traffic link availability

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox support
- Animation support recommended for best experience

## Notes

- All tracking events are logged to console for debugging
- WhatsApp integration requires proper URL encoding
- Modal can be closed by clicking backdrop or X button
- Auto-scroll review carousel can be manually controlled via dots
- Static user counter can be made dynamic with API integration
