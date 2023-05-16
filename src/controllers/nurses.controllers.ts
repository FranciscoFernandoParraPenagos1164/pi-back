import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'
import { INurses } from '../interfaces/INurses'

export default class Nurses implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM enfermero'

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`listing all nurses at ${new Date().toLocaleString()}`)
        const rows: Array<INurses> = response[0]

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

    const query = `SELECT * FROM enfermero WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`searching nurse ${id} at ${new Date().toLocaleString()}`)
        const rows: Array<INurses> = response[0]

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
    const body: INurses = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<INurses>(
      body,
      next,
      ['cod_enfermero']
    )

    if (!isValid) {
      return
    }

    const id = uuidv4()
    const newNurse: INurses = { cod_enfermero: id, ...body }
    const query = 'INSERT INTO enfermero SET ?'

    pool
      .query(query, newNurse)
      .then(() => {
        console.log(`creating nurse ${id} at ${new Date().toLocaleString()}`)

        res.status(201)
        res.json(newNurse)
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: INurses = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<INurses>(
      body,
      next,
      ['cod_enfermero', 'documento_identidad']
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

    const query = `UPDATE enfermero SET ${values} WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`updating nurse ${id} at ${new Date().toLocaleString()}`)

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

    const query = `DELETE FROM enfermero WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`deleting nurse ${id} at ${new Date().toLocaleString()}`)

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
    'especialidad',
    'titulo',
    'email',
    'celular',
    'primer_nombre',
    'segundo_nombre',
    'primer_apellido',
    'segundo_apellido',
    'tipo_documento',
    'documento_identidad'
  ]
}
