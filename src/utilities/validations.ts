import { NextFunction } from 'express'

export class Validations {
  public static validateEmptyBody(body: Object): boolean {
    if (!body || Object.entries(body).length === 0) {
      return false
    }
    return true
  }

  public static validateBody<T>(
    body: T,
    next: NextFunction,
    excludePropertyes?: Array<string>
  ): Boolean {
    const entries = Object.entries(body)

    for (let values of entries) {
      const [key, value] = values

      if (excludePropertyes.includes(key)) {
        next({
          code: 'NO_VALID_PROPERTY',
          message: `the key ${key} is managed by the server or is not modificable`
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
