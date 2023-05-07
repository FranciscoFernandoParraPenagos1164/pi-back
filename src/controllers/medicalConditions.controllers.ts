import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'
import { IMedicalConditions } from '../interfaces/IMedicalConditions'

export default class MedicalConditions implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM condicion_medica'

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(
          `listing all medical conditions at ${new Date().toLocaleString()}`
        )
        const rows: Array<IMedicalConditions> = response[0]

        if (rows.length === 0) {
          return res.status(204).end()
        }

        res.status(200)
        res.json(rows)
      })
      .catch(next)
  }

  public getById(_req: Request, res: Response, next: NextFunction): void {
    const { id } = _req.params
    const query = `SELECT * FROM condicion_medica WHERE cod_condicion_medica = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(
          `searching medical condition ${id} at ${new Date().toLocaleString()}`
        )
        const rows: Array<IMedicalConditions> = response[0]

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
    const id = uuidv4()
    const body: IMedicalConditions = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IMedicalConditions>(
      this.validatePropertyes,
      body,
      next,
      ['cod_condicion_medica']
    )

    if (!isValid) {
      return
    }

    const newCondition: IMedicalConditions = {
      cod_condicion_medica: id,
      ...body
    }

    const query = 'INSERT INTO condicion_medica SET ?'

    pool
      .query(query, newCondition)
      .then(() => {
        console.log(
          `creating medical condition ${id} at ${new Date().toLocaleString()}`
        )

        res.status(201)
        res.json(newCondition)
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: IMedicalConditions = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IMedicalConditions>(
      this.validatePropertyes,
      body,
      next,
      ['cod_condicion_medica', 'cod_paciente']
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

    const query = `UPDATE condicion_medica SET ${values} WHERE cod_condicion_medica = '${id}'`

    pool
      .query(query)
      .then((rows: RowDataPacket) => {
        console.log(
          `updating medical condition ${id} at ${new Date().toLocaleString()}`
        )

        const { changedRows } = rows[0]

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

    const query = `DELETE FROM condicion_medica WHERE cod_condicion_medica = '${id}'`

    pool
      .query(query)
      .then((rows: RowDataPacket) => {
        console.log(
          `deleting medical condition ${id} at ${new Date().toLocaleString()}`
        )

        const { affectedRows } = rows[0]

        if (affectedRows <= 0) {
          return res.status(204).end()
        }

        return res.status(200).end()
      })
      .catch(next)
  }

  private validatePropertyes: Array<string> = [
    'cod_condicion_medica',
    'cod_paciente',
    'descripcion'
  ]
}
