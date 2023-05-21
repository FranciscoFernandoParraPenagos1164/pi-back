import { createPool, PoolOptions } from 'mysql2'
import { config } from 'dotenv'
config()

const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PORT,
  DATABASE_PASSWORD,
  DATABASE_NAME
} = process.env

let POOL_CONFIG: PoolOptions

POOL_CONFIG = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  port: Number.parseInt(DATABASE_PORT),
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME
}

export const pool = createPool(POOL_CONFIG).promise()
