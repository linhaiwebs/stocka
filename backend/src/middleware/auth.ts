import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { TemplateService } from '../services/template.service.js';

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    email: string;
    username: string;
  };
  templateId?: number;
}

export async function authenticateAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Missing authorization token' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = AuthService.verifyJWT(token);

    if (!payload) {
      res.status(401).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      user_id: payload.user_id,
      email: payload.email,
      username: payload.username
    };

    next();
  } catch (error) {
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
}

export async function authenticateTemplate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Accept multiple header variations for backward compatibility
    const apiKey = (
      req.headers['x-template-api-key'] ||
      req.headers['X-Template-API-Key'] ||
      req.headers['x-api-key'] ||
      req.headers['X-API-Key']
    ) as string;

    if (!apiKey) {
      res.status(401).json({ success: false, error: 'Missing API key' });
      return;
    }

    const template = await TemplateService.getByApiKey(apiKey);

    if (!template) {
      res.status(401).json({ success: false, error: 'Invalid API key' });
      return;
    }

    req.templateId = template.id;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
}
