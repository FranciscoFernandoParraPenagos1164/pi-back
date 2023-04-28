import { createPool } from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const POOL_CONFIG = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT || '3306',
  database: process.env.DATABASE_NAME
}

export const pool = createPool(POOL_CONFIG).promise()
