import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'
import { IVisits } from '../interfaces/IVisits'

export default class Visits implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM visita'

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`listing all visits at ${new Date().toLocaleString()}`)
        const rows: Array<IVisits> = response[0]

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

    const query = `SELECT * FROM visita WHERE cod_visita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`searching visit ${id} at ${new Date().toLocaleString()}`)
        const rows: Array<IVisits> = response[0]

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
    const body: IVisits = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IVisits>(
      Visits.validatePropertyes,
      body,
      next,
      ['cod_visita']
    )

    if (!isValid) {
      return
    }

    const id = uuidv4()
    const newVisit: IVisits = { cod_visita: id, ...body }
    const query = 'INSERT INTO visita SET ?'

    pool
      .query(query, newVisit)
      .then(() => {
        console.log(`creating visit ${id} at ${new Date().toLocaleString()}`)

        res.status(201)
        res.json(newVisit)
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: IVisits = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IVisits>(
      Visits.validatePropertyes,
      body,
      next,
      ['cod_visita', 'cod_cita']
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

    const query = `UPDATE visita SET ${values} WHERE cod_visita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`updating visit ${id} at ${new Date().toLocaleString()}`)

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

    const query = `DELETE FROM visita WHERE cod_visita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`deleting visit ${id} at ${new Date().toLocaleString()}`)

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
    'hora_entrada',
    'hora_salida'
  ]
}
