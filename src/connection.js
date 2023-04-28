import { createPool } from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const POOL_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'fr4nc1sc01164',
  port: '3306',
  database: 'cronogramaenfercuidartedb'
}

console.log(POOL_CONFIG)
export const pool = createPool(POOL_CONFIG)
