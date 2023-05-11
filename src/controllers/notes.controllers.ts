import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'
import { INotes } from '../interfaces/INotes'

export default class Clients implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM nota'

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`listing all notes at ${new Date().toLocaleString()}`)
        const rows: Array<INotes> = response[0]

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

    const query = `SELECT * FROM nota WHERE cod_nota = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`searching notes ${id} at ${new Date().toLocaleString()}`)
        const rows: Array<INotes> = response[0]

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
    const body: INotes = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<INotes>(
      Clients.validatePropertyes,
      body,
      next,
      ['cod_nota']
    )

    if (!isValid) {
      return
    }

    const id = uuidv4()
    const newNote: INotes = { cod_nota: id, ...body }
    const query = 'INSERT INTO nota SET ?'

    pool
      .query(query, newNote)
      .then(() => {
        console.log(`creating note ${id} at ${new Date().toLocaleString()}`)

        res.status(201)
        res.json(newNote)
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: INotes = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<INotes>(
      Clients.validatePropertyes,
      body,
      next,
      ['cod_nota', 'cod_visita']
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

    const query = `UPDATE nota SET ${values} WHERE cod_nota = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`updating note ${id} at ${new Date().toLocaleString()}`)

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

    const query = `DELETE FROM nota WHERE cod_nota = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`deleting nota ${id} at ${new Date().toLocaleString()}`)

        const { affectedRows } = response[0]

        if (affectedRows <= 0) {
          res.status(204).end()
          return
        }

        res.status(200).end()
      })
      .catch(next)
  }

  private static validatePropertyes: Array<string> = ['cod_visita', 'contenido']
}
