import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'

export default class QueryController<T> implements IControllers {
  constructor(
    private table: string,
    private rowToCompare: string,
    private excludedPostPropertyes: Array<string>,
    private excludedPatchPropertyes: Array<string>,
    private newRowCodName: string
  ) {}

  get(_req: Request, res: Response, next: NextFunction): void {
    const query = `SELECT * FROM ${this.table}`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        const rows: Array<T> = response[0]

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

    const query = `SELECT * FROM ${this.table} WHERE ${this.rowToCompare} = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        const rows: Array<T> = response[0]

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
    const body: T = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<T>(
      body,
      next,
      this.excludedPostPropertyes
    )

    if (!isValid) {
      return
    }

    const id = uuidv4()
    const newRow: T = { ...body }
    Object.defineProperty(newRow, this.newRowCodName, { value: id })
    const query = `INSERT INTO ${this.table} SET ?`

    pool
      .query(query, newRow)
      .then(() => {
        res.status(201)
        res.json(newRow)
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: T = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<T>(
      body,
      next,
      this.excludedPatchPropertyes
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

    const query = `UPDATE ${this.table} SET ${values} WHERE ${this.rowToCompare} = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
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

    const query = `DELETE FROM ${this.table} WHERE ${this.rowToCompare} = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`deleting client ${id} at ${new Date().toLocaleString()}`)

        const { affectedRows } = response[0]

        if (affectedRows <= 0) {
          res.status(204).end()
          return
        }

        res.status(200).end()
      })
      .catch(next)
  }
}
