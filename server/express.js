import express from 'express'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', taskRoutes)

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Authentication required' })
  }

  console.error(err)
  return res.status(400).json({ error: err.message || 'Request failed' })
})

export default app
