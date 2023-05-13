import { createPool, PoolOptions } from 'mysql2'
import { config } from 'dotenv'
config()

const POOL_CONFIG: PoolOptions = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD || '123',
  database: process.env.DATABASE_NAME
}

export const pool = createPool(POOL_CONFIG).promise()
