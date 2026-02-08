# Public Assets Directory

This directory contains static assets that are served directly by the application.

## Required Images for Templates

### JP Stock AI Template (jp-stock-ai)

The following image file is required:

**top1.png**
- Location: `/public/top1.png`
- Description: Performance comparison image showing market overall performance (+8.4%) vs AI-selected premium stocks (+32.7%)
- Content: Should display "最新の実績：AI選定・優良銘柄群" with statistics comparing "市場全体の騰落" and "弊会選定・優良株"
- Recommended size: 1200x800px or similar

To add the image:
```bash
# Copy your top1.png file to this directory
cp /path/to/your/top1.png /tmp/cc-agent/63358226/project/public/top1.png
```

The image will be accessible in templates at `/top1.png`.
