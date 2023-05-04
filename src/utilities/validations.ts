import { NextFunction } from 'express'

export class Validations {
  public static validateBody<T>(
    validatePropertyes: Array<string>,
    body: T,
    next: NextFunction
  ): Boolean {
    const values = Object.entries(body)

    for (let i = 0; i < values.length; i++) {
      const [key, value] = values[i]

      if (!validatePropertyes.includes(key)) {
        next({
          code: 'NO_VALID_PROPERTY',
          message: `the key ${key} is not valid`
        })
        return false
      }

      if (value === '' || value === null || value === undefined) {
        next({
          code: 'NO_EMPTY_PROPERTY',
          message: `the key ${key} is empty`
        })
        return false
      }
    }
    return true
  }
}
