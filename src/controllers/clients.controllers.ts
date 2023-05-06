import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'
import { IClient } from '../interfaces/IClients'

export default class Clients implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM cliente'

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`listing all clients at ${new Date()}`)
        const rows: Array<IClient> = response[0]

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

    const query = `SELECT * FROM cliente WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`searching client ${id} at ${new Date()}`)
        const rows: Array<IClient> = response[0]

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
    const body: IClient = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IClient>(
      Clients.validatePropertyes,
      body,
      next
    )

    if (body.cod_cliente) {
      next({
        code: 'NO_VALID_PROPERTY',
        message: 'the key cod_cliente is managed by the server'
      })
      return
    }

    if (!isValid) {
      return
    }

    const id = uuidv4()
    const newClient: IClient = { cod_cliente: id, ...body }
    const query = 'INSERT INTO cliente SET ?'

    pool
      .query(query, newClient)
      .then(() => {
        console.log(`creating client ${id} at ${new Date()}`)

        res.status(201)
        res.json(newClient)
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: IClient = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IClient>(
      Clients.validatePropertyes,
      body,
      next
    )

    if (!isValid) {
      return
    }

    if (body.cod_cliente || body.documento_identidad) {
      next({
        code: 'PROPERTY_UNCHANGEABLE',
        message:
          'the key cod_cliente and documento_identidad are not modificable'
      })
      return
    }

    const { id } = _req.params
    const newInfo = Object.entries(body)

    const values = newInfo.map(
      ([key, value]) =>
        `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
    )

    const query = `UPDATE cliente SET ${values} WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`updating client ${id} at ${new Date()}`)

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

    const query = `DELETE FROM cliente WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`deleting client ${id} at ${new Date()}`)

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
