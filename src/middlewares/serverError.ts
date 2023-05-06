import { Request, Response, NextFunction } from 'express'
import { IError } from '../interfaces/IError'

export default function serverError(
  err: IError,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const { code, message } = err

  const validErrors = [
    'PROPERTY_UNCHANGEABLE',
    'NO_VALID_PROPERTY',
    'NO_EMPTY_PROPERTY',
    'NO_EMPTY_CONTENT'
  ]

  if (!validErrors.includes(code)) {
    next(err)
    return
  }

  res.status(400)
  res.json({ code, message })
}
