import { Router } from 'express';
import { authenticateAdmin, authenticateTemplate, AuthRequest } from '../middleware/auth.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { TemplateService } from '../services/template.service.js';

const router = Router();

router.post('/pageview', authenticateTemplate, async (req: AuthRequest, res) => {
  try {
    const {
      visitor_id,
      template_id,
      traffic_link_id,
      user_agent,
      ip_address,
      referrer
    } = req.body;

    if (!visitor_id || !template_id) {
      return res.status(400).json({
        success: false,
        error: 'visitor_id and template_id are required'
      });
    }

    const success = await AnalyticsService.trackPageView(
      visitor_id,
      template_id,
      traffic_link_id || null,
      user_agent || null,
      ip_address || null,
      referrer || null
    );

    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to track page view'
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.post('/conversion', authenticateTemplate, async (req: AuthRequest, res) => {
  try {
    const { visitor_id, template_id, traffic_link_id } = req.body;

    if (!visitor_id || !template_id) {
      return res.status(400).json({
        success: false,
        error: 'visitor_id and template_id are required'
      });
    }

    const success = await AnalyticsService.trackConversion(
      visitor_id,
      template_id,
      traffic_link_id || null
    );

    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to track conversion'
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.post('/interaction', authenticateTemplate, async (req: AuthRequest, res) => {
  try {
    const {
      visitor_id,
      template_id,
      scroll_depth_percent,
      time_on_page_seconds,
      interaction_events
    } = req.body;

    if (!visitor_id || !template_id) {
      return res.status(400).json({
        success: false,
        error: 'visitor_id and template_id are required'
      });
    }

    const success = await AnalyticsService.trackInteraction(
      visitor_id,
      template_id,
      scroll_depth_percent,
      time_on_page_seconds,
      interaction_events
    );

    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to track interaction'
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/template/:templateId', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const templateId = parseInt(req.params.templateId);

    if (isNaN(templateId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    const analytics = await AnalyticsService.getAnalyticsByTemplate(templateId);

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/all', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const analytics = await AnalyticsService.getAllAnalytics();

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/tracking-script/:templateId', async (req, res) => {
  try {
    const templateId = parseInt(req.params.templateId);

    if (isNaN(templateId)) {
      return res.status(400).send('/* Invalid template ID */');
    }

    const template = await TemplateService.getById(templateId);

    if (!template) {
      return res.status(404).send('/* Template not found */');
    }

    let script = '';

    if (template.tracking_code && template.tracking_code.trim()) {
      const trackingCode = template.tracking_code.trim();

      if (trackingCode.startsWith('AW-')) {
        const conversionIdMatch = trackingCode.match(/^(AW-\d+)/);
        const conversionId = conversionIdMatch ? conversionIdMatch[1] : trackingCode;

        script = `
(function() {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=${conversionId}';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${conversionId}');

  window.trackGoogleAdsConversion = function() {
    gtag('event', 'conversion', {
      'send_to': '${trackingCode}'
    });
  };
})();
`;
      } else if (trackingCode.startsWith('G-') || trackingCode.startsWith('UA-') || trackingCode.startsWith('GT-')) {
        script = `
(function() {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=${trackingCode}';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingCode}');
})();
`;
      } else if (trackingCode.startsWith('GTM-')) {
        script = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${trackingCode}');
`;
      } else {
        script = `
${trackingCode}
`;
      }
    } else {
      script = '/* No tracking code configured for this template */';
    }

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(script);
  } catch (error) {
    console.error('Error generating tracking script:', error);
    res.status(500).send('/* Error generating tracking script */');
  }
});

export default router;
