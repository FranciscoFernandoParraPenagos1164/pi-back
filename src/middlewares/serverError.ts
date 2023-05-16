import { Request, Response, NextFunction } from 'express'
import { IError } from '../interfaces/IError'

export default function serverError(
  err: IError,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const { code, message } = err
  console.error(err)

  res.status(400)
  res.json({ code, message })
}
