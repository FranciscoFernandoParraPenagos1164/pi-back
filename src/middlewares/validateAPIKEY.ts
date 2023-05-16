import { Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
config()

export default function validateAPIKEY(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  const API_KEY = process.env.API_KEY || 'enfercuidarte123'
  const QUERY_API_KEY = _req.query.api_key

  if (API_KEY !== QUERY_API_KEY) {
    _res.status(401).end()
    return
  }

  next()
}
