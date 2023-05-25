import { Request, Response, NextFunction } from 'express'

export function CORS(_req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  )
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Allow', 'GET, POST, PATC, DELETE, OPTIONS')

  if (_req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  next()
}
