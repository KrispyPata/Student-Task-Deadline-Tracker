import mongoose from 'mongoose'
import app from './server/express.js'
import config from './config/config.js'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri)

    console.log('Connected to MongoDB')

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:')
    console.error(error)

    process.exit(1)
  }
}

startServer()