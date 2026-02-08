import { Router } from 'express';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.js';
import { TrafficService } from '../services/traffic.service.js';
import { TemplateService } from '../services/template.service.js';
import { getDatabase } from '../config/database.js';

const router = Router();

router.post('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { template_id, name, url } = req.body;

    if (!template_id || !name || !url) {
      return res.status(400).json({
        success: false,
        error: 'template_id, name, and url are required'
      });
    }

    const link = await TrafficService.create(template_id, name, url);

    if (!link) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create traffic link'
      });
    }

    res.json({
      success: true,
      data: link
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const links = await TrafficService.getAll();

    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid traffic link ID'
      });
    }

    const link = await TrafficService.getById(id);

    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Traffic link not found'
      });
    }

    res.json({
      success: true,
      data: link
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.put('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, url, page_title_override, page_description_override } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid traffic link ID'
      });
    }

    const link = await TrafficService.update(id, name, url, page_title_override, page_description_override);

    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Traffic link not found'
      });
    }

    res.json({
      success: true,
      data: link
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.delete('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid traffic link ID'
      });
    }

    const success = await TrafficService.delete(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Traffic link not found'
      });
    }

    res.json({
      success: true,
      message: 'Traffic link deleted successfully'
    });
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

    const links = await TrafficService.getByTemplateId(templateId);

    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.post('/:id/click', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid traffic link ID'
      });
    }

    const success = await TrafficService.incrementClicks(id);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to increment clicks'
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

router.get('/resolve/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const db = getDatabase();

    const trafficLink = db.prepare(`
      SELECT * FROM traffic_links WHERE link_slug = ?
    `).get(slug) as any;

    if (!trafficLink) {
      return res.status(404).json({
        success: false,
        error: 'Traffic link not found'
      });
    }

    await TrafficService.incrementClicks(trafficLink.id);

    const template = await TemplateService.getById(trafficLink.template_id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: {
        template: {
          id: template.id,
          slug: template.slug,
          template_type: template.template_type || 'html',
          html_content: template.html_content,
          css_content: template.css_content || '',
          js_content: template.js_content || '',
          api_key: template.api_key,
          tracking_code: template.tracking_code || '',
          name: template.name,
          page_title: template.page_title || null,
          page_description: template.page_description || null
        },
        traffic_link: {
          id: trafficLink.id,
          name: trafficLink.name,
          url: trafficLink.url,
          link_slug: trafficLink.link_slug,
          page_title_override: trafficLink.page_title_override || null,
          page_description_override: trafficLink.page_description_override || null
        }
      }
    });
  } catch (error) {
    console.error('Error resolving traffic link:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid traffic link ID'
      });
    }

    const link = await TrafficService.getById(id);

    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Traffic link not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: link.id,
        name: link.name,
        url: link.url
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/default/template/:templateId', async (req, res) => {
  try {
    const templateId = parseInt(req.params.templateId);

    if (isNaN(templateId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    const links = await TrafficService.getByTemplateId(templateId);

    if (!links || links.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No traffic links found for this template'
      });
    }

    const defaultLink = links[0];

    res.json({
      success: true,
      data: {
        id: defaultLink.id,
        name: defaultLink.name,
        url: defaultLink.url,
        link_slug: defaultLink.link_slug
      }
    });
  } catch (error) {
    console.error('Error getting default traffic link:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
