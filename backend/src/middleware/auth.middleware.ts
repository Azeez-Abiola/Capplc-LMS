import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'

/**
 * Verify Supabase token from Authorization header.
 * Attaches the full user object (including user_metadata) to req.user.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    console.log(`[AUTH] 401 - No Bearer token for ${req.originalUrl}`)
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.log(`[AUTH] 401 - ${error?.message || 'No user found'} for ${req.originalUrl}`)
      return res.status(401).json({ error: error?.message || 'Invalid or expired token.' })
    }

    req.user = user

    // OPTIMIZATION: Fetch the "source of truth" role from profiles table
    // because user_metadata in the JWT can be stale.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role) {
      // Sync the role to req.user so authorize middleware works
      req.user.user_metadata = { 
        ...req.user.user_metadata, 
        role: profile.role 
      }
    }

    next()
  } catch (error) {
    console.error(`[AUTH] 401 - Exception for ${req.originalUrl}`, error)
    return res.status(401).json({ error: 'Authentication failed.' })
  }
}

/**
 * Authorize based on roles stored in user_metadata.
 * Roles: 'admin', 'professional', 'painter' (default free-tier user)
 */
export function authorize(roles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log(`[AUTH] 401 - No user object in request for ${req.originalUrl}`)
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userRole = req.user.user_metadata?.role || 'painter'
    if (roles.length && !roles.includes(userRole)) {
      console.log(`[AUTH] 403 - Role mismatch for ${req.originalUrl}. Expected ${roles}, got ${userRole}`)
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
    }

    next()
  }
}

/**
 * Require super_admin role
 */
export const requireSuperAdmin = authorize(['super_admin'])

/**
 * Require admin role (shorthand)
 */
export const requireAdmin = authorize(['admin', 'super_admin'])

/**
 * Require professional or admin role (shorthand) —
 * used to gate access to paid/restricted courses
 */
export const requireProfessional = authorize(['professional', 'admin', 'super_admin'])

/**
 * Middleware to check if the user's subscription tier allows access to a course.
 * Must be called AFTER authenticate() so req.user is available.
 * Checks `subscription_tiers` table via the user's active subscription.
 *
 * Usage: router.get('/:id/content', authenticate, requireTier, getContent)
 */
export async function requireTier(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    // Admins and Super Admins bypass tier checks
    const userRole = req.user.user_metadata?.role || 'painter'
    if (userRole === 'admin' || userRole === 'super_admin') return next()

    // Get the course being accessed
    const courseId = req.params.id || req.params.courseId
    if (!courseId) return next() // No course context — allow

    // Fetch the course's required tier
    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .select('tier_access')
      .eq('id', courseId)
      .single()

    if (courseErr || !course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // If course is free-tier (null or 'free'), allow everyone
    if (!course.tier_access || course.tier_access === 'free') return next()

    // Check user's active subscription
    const { data: sub, error: subErr } = await supabase
      .from('subscriptions')
      .select('*, subscription_tiers(name, level)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subErr || !sub) {
      return res.status(403).json({
        error: 'This course requires an active subscription.',
        requiredTier: course.tier_access
      })
    }

    // Tier hierarchy: ELITE > PRO > free
    const tierHierarchy: Record<string, number> = { free: 0, PRO: 1, ELITE: 2 }
    const userTierLevel = tierHierarchy[sub.subscription_tiers?.name] ?? 0
    const requiredLevel = tierHierarchy[course.tier_access] ?? 0

    if (userTierLevel < requiredLevel) {
      return res.status(403).json({
        error: `This course requires a ${course.tier_access} subscription.`,
        requiredTier: course.tier_access,
        currentTier: sub.subscription_tiers?.name
      })
    }

    next()
  } catch (error: any) {
    console.error('[TIER_CHECK] Error:', error.message)
    return res.status(500).json({ error: 'Failed to verify subscription tier.' })
  }
}
