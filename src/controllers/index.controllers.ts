import { Request, Response } from 'express'
import { IControllers } from '../interfaces/IController'

export default class Index implements IControllers {
  public get(_req: Request, res: Response): void {
    res.status(200)
    res.send('welcome to the enfercuidarte api')
  }
  public getById(): void {}
  public post(): void {}
  public patch(): void {}
  public delete(): void {}
}
