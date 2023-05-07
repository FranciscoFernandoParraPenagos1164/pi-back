import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'
import { IExtensions } from '../interfaces/IExtensions'

export default class Extensions implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM extencion_cita'

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`listing all extensions at ${new Date().toLocaleString()}`)
        const rows: Array<IExtensions> = response[0]

        if (rows.length === 0) {
          res.status(204).end()
          return
        }

        res.status(200)
        res.json(rows)
      })
      .catch(next)
  }

  public getById(_req: Request, res: Response, next: NextFunction): void {
    const { id } = _req.params

    const query = `SELECT * FROM extencion_cita WHERE cod_extencion_cita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(
          `searching extension ${id} at ${new Date().toLocaleString()}`
        )
        const rows: Array<IExtensions> = response[0]

        if (rows.length === 0) {
          res.status(204).end()
          return
        }

        res.status(200)
        res.json(rows)
      })
      .catch(next)
  }

  public post(_req: Request, res: Response, next: NextFunction): void {
    const body: IExtensions = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IExtensions>(
      Extensions.validatePropertyes,
      body,
      next,
      ['cod_extencion_cita']
    )

    if (!isValid) {
      return
    }

    const id = uuidv4()
    const newExtension: IExtensions = { cod_extencion_cita: id, ...body }
    const query = 'INSERT INTO extencion_cita SET ?'

    pool
      .query(query, newExtension)
      .then(() => {
        console.log(
          `creating extension ${id} at ${new Date().toLocaleString()}`
        )

        res.status(201)
        res.json(newExtension)
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: IExtensions = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IExtensions>(
      Extensions.validatePropertyes,
      body,
      next,
      ['cod_extension_cita']
    )

    if (!isValid) {
      return
    }

    const { id } = _req.params
    const newInfo = Object.entries(body)

    const values = newInfo.map(
      ([key, value]) =>
        `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
    )

    const query = `UPDATE extencion_cita SET ${values} WHERE cod_extencion_cita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(
          `updating extension ${id} at ${new Date().toLocaleString()}`
        )

        const { changedRows } = response[0]

        if (changedRows === 0) {
          res.status(204).end()
          return
        }

        res.status(200)
        res.json(body)
      })
      .catch(next)
  }

  public delete(_req: Request, res: Response, next: NextFunction): void {
    const { id } = _req.params

    const query = `DELETE FROM extencion_cita WHERE cod_extencion_cita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(
          `deleting extension ${id} at ${new Date().toLocaleString()}`
        )

        const { affectedRows } = response[0]

        if (affectedRows <= 0) {
          res.status(204).end()
          return
        }

        res.status(200).end()
      })
      .catch(next)
  }

  private static validatePropertyes: Array<string> = [
    'cod_cita',
    'tiempo_extendido'
  ]
}
