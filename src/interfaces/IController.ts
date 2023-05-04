import { Request, Response, NextFunction } from 'express'

export interface IControllers {
  get(request: Request, response: Response, next: NextFunction): void
  getById(request: Request, response: Response, next: NextFunction): void
  post(request: Request, response: Response, next: NextFunction): void
  patch(request: Request, response: Response, next: NextFunction): void
  delete(request: Request, response: Response, next: NextFunction): void
}
