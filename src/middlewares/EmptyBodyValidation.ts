import { Request, Response, NextFunction } from 'express'
import { Validations } from '../utilities/validations'

export default function emptyBodyValidation(_req: Request, _res: Response, next: NextFunction) {
  const isEmpty = Validations.validateEmptyBody(_req.body)

  if (_req.method === 'GET' || _req.method === 'DELETE') {
    next()
    return
  }

  if (!isEmpty) {
    next({
      code: 'NO_EMPTY_CONTENT',
      message: 'the content of the body is empty'
    })
    return
  }

  next()
}
