import { Request, Response, NextFunction } from 'express'
import { QueryError } from 'mysql2'

export default function sqlError(
  err: QueryError,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const { code, message } = err

  const validErrors = [
    'ER_DUP_ENTRY',
    'ER_NO_DEFAULT_FOR_FIELD',
    'ER_TRUNCATED_WRONG_VALUE',
    'ER_DATA_TOO_LONG'
  ]

  if (!validErrors.includes(code)) {
    next(err)
    return
  }

  res.status(400)
  res.json({ code, message })
}
