import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

/**
 * Verify Supabase token from Authorization header
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    console.log(`[AUTH] 401 - No Bearer token for ${req.originalUrl}`);
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      console.log(`[AUTH] 401 - Invalid/Expired token for ${req.originalUrl}`, error?.message);
      return res.status(401).json({ error: 'Invalid or expired token.' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error(`[AUTH] 401 - Exception for ${req.originalUrl}`, error);
    return res.status(401).json({ error: 'Authentication failed.' })
  }
}

/**
 * Authorize based on roles in user_metadata
 */
export function authorize(roles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log(`[AUTH] 401 - No user object in request for ${req.originalUrl}`);
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userRole = req.user.user_metadata?.role || 'painter'
    if (roles.length && !roles.includes(userRole)) {
      console.log(`[AUTH] 403 - Role mismatch for ${req.originalUrl}. Expected ${roles}, got ${userRole}`);
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
    }

    next()
  }
}

/**
 * Require admin role (shorthand)
 */
export const requireAdmin = authorize(['admin'])
