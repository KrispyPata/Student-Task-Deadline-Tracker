import dotenv from 'dotenv'

dotenv.config()

const config = {
  env: process.env.NODE_ENV || 'development',

  port: process.env.PORT || 3000,

  mongoUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://nikonkebun_db_user:ncWEHOSa6gDF9nPV@cluster0.m8cz0pz.mongodb.net/Tracker?appName=Cluster0',

  jwtSecret:
    process.env.JWT_SECRET ||
    'YOUR_secret_key',
}

export default config