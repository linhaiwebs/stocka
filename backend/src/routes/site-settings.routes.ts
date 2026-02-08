import { Router } from 'express';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.js';
import { SiteSettingsService } from '../services/site-settings.service.js';

const router = Router();

router.get('/public', async (req, res) => {
  try {
    const settings = SiteSettingsService.getPublicSettings();

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch site settings'
    });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const analyticsSettings = SiteSettingsService.getAnalyticsSettings();

    if (!analyticsSettings.analytics_enabled) {
      return res.json({
        success: true,
        data: {
          analytics_enabled: false
        }
      });
    }

    res.json({
      success: true,
      data: analyticsSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics settings'
    });
  }
});

router.get('/privacy-policy', async (req, res) => {
  try {
    const content = SiteSettingsService.getPrivacyPolicy();

    res.json({
      success: true,
      data: { content }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch privacy policy'
    });
  }
});

router.get('/terms-of-service', async (req, res) => {
  try {
    const content = SiteSettingsService.getTermsOfService();

    res.json({
      success: true,
      data: { content }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch terms of service'
    });
  }
});

router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const settings = SiteSettingsService.getSiteSettings();

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch site settings'
    });
  }
});

router.put('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      domain_name,
      copyright_text,
      privacy_policy_content,
      terms_of_service_content,
      google_ads_id,
      google_analytics_id,
      google_ads_conversion_id,
      conversion_event_name,
      analytics_enabled
    } = req.body;

    const updates: any = {};

    if (domain_name !== undefined) {
      updates.domain_name = domain_name;
    }

    if (copyright_text !== undefined) {
      updates.copyright_text = copyright_text;
    }

    if (privacy_policy_content !== undefined) {
      updates.privacy_policy_content = privacy_policy_content;
    }

    if (terms_of_service_content !== undefined) {
      updates.terms_of_service_content = terms_of_service_content;
    }

    if (google_ads_id !== undefined) {
      updates.google_ads_id = google_ads_id;
    }

    if (google_analytics_id !== undefined) {
      updates.google_analytics_id = google_analytics_id;
    }

    if (google_ads_conversion_id !== undefined) {
      updates.google_ads_conversion_id = google_ads_conversion_id;
    }

    if (conversion_event_name !== undefined) {
      updates.conversion_event_name = conversion_event_name;
    }

    if (analytics_enabled !== undefined) {
      updates.analytics_enabled = analytics_enabled ? 1 : 0;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    const updated = SiteSettingsService.updateSiteSettings(updates);

    res.json({
      success: true,
      data: updated,
      message: 'Site settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update site settings'
    });
  }
});

export default router;
