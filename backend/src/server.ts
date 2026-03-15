import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

// Route imports
import authRoutes from './routes/auth.routes'
import courseRoutes from './routes/course.routes'
import moduleRoutes from './routes/module.routes'
import videoRoutes from './routes/video.routes'
import progressRoutes from './routes/progress.routes'
import webhookRoutes from './routes/webhook.routes'
import subscriptionRoutes from './routes/subscription.routes'
import paymentRoutes from './routes/payment.routes'
import certificateRoutes from './routes/certificate.routes'
import userRoutes from './routes/user.routes'
import analyticsRoutes from './routes/analytics.routes'
import superAdminRoutes from './routes/super-admin.routes'
import notificationRoutes from './routes/notification.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Routes
app.use('/auth', authRoutes)
app.use('/courses', courseRoutes)
app.use('/modules', moduleRoutes)
app.use('/videos', videoRoutes)
app.use('/progress', progressRoutes)
app.use('/webhooks', webhookRoutes)
app.use('/subscriptions', subscriptionRoutes)
app.use('/payments', paymentRoutes)
app.use('/certificates', certificateRoutes)
app.use('/users', userRoutes)
app.use('/analytics', analyticsRoutes)
app.use('/super-admin', superAdminRoutes)
app.use('/notifications', notificationRoutes)

// Test route
app.get('/test-api', (req, res) => {
  res.json({ message: 'API is reachable', routes: ['auth', 'courses', 'modules', 'videos', 'progress', 'analytics'] })
})

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Debug: Catch-all to log unmatched requests
app.use((req, res) => {
  console.log(`[404] Unmatched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Path not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`🚀 CAP Business Pro API running on port ${PORT}`)
})

export default app
