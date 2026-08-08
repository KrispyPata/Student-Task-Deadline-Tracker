import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import taskRoutes from './routes/task.routes.js'
import courseRoutes from './routes/course.routes.js'
import sessionRoutes from './routes/session.routes.js'
import reminderRoutes from './routes/reminder.routes.js'

const app = express()

/*
 * Trust Render's reverse proxy.
 */
app.set('trust proxy', 1)

/*
 * Security headers.
 */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
)

/*
 * Compression.
 */
app.use(compression())

/*
 * Parse request bodies.
 */
app.use(
  bodyParser.json({
    limit: '1mb',
  }),
)

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.use(cookieParser())

/*
 * CORS
 *
 * Allows:
 * - local Vite frontend
 * - deployed Netlify frontend
 */
const allowedOrigins = [
  'http://localhost:5173',
  'https://studenttaskdeadlinetracker.netlify.app',
]

app.use(
  cors({
    origin(origin, callback) {
      /*
       * Requests without an Origin header include
       * Render health checks, Postman, curl, etc.
       */
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(
        new Error(
          `CORS blocked request from origin: ${origin}`,
        ),
      )
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  }),
)

/*
 * API routes
 */
app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', taskRoutes)
app.use('/', courseRoutes)
app.use('/', sessionRoutes)
app.use('/', reminderRoutes)

/*
 * Render health/root route.
 *
 * Visit your Render URL and you should see
 * this JSON if the backend is online.
 */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message:
      'Student Task Tracker API is running',
  })
})

/*
 * Simple health-check endpoint.
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
  })
})

/*
 * API 404 handler.
 */
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

/*
 * Global error handler.
 */
app.use((err, req, res, next) => {
  console.error('Express error:', err)

  /*
   * CORS error
   */
  if (
    err.message?.startsWith(
      'CORS blocked request',
    )
  ) {
    return res.status(403).json({
      error: err.message,
    })
  }

  return res.status(
    err.status || 500,
  ).json({
    error:
      err.message ||
      'Something went wrong',
  })
})

export default app