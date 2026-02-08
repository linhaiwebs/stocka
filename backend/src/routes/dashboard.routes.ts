import { Router } from 'express';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.js';
import { DashboardService } from '../services/dashboard.service.js';

const router = Router();

router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const stats = await DashboardService.getStats();
    const recentActivity = await DashboardService.getRecentActivity(5);

    res.json({
      success: true,
      data: {
        ...stats,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/stats', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const stats = await DashboardService.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/activity', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activity = await DashboardService.getRecentActivity(limit);

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/top-templates', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const templates = await DashboardService.getTopTemplates(limit);

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
