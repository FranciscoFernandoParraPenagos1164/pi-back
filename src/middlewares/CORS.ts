import { Request, Response, NextFunction } from 'express'

export function CORS(_req: Request, res: Response, next: NextFunction) {
  res.append('Access-Control-Allow-Origin', ['*'])
  res.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.append('Access-Control-Allow-Headers', 'Content-Type')
  next()
}
