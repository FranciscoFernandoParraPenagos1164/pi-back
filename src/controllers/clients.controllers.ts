import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { IControllers } from '../interfaces/IController.js'
import { IClient } from '../interfaces/IClients'
import { Validations } from '../utilities/validations'

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
    const id = uuidv4()
    const body: IClient = { ..._req.body }

    const isValid = Validations.validateBody<IClient>(
      Clients.validatePropertyes,
      body,
      next
    )

    if (body.cod_cliente) {
      next({
        code: 'PROPERTY_UNCHANGEABLE',
        message: 'the key cod_cliente is managed by the server'
      })
      return
    }

    if (!isValid) {
      return
    }

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

  public patch(_req: Request, res: Response, next: NextFunction): void {}

  public delete(_req: Request, res: Response, next: NextFunction): void {}

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

// export function patchClient(req, res, next) {
//   const body = { ...req.body }

//   if (body.cod_cliente || body.documento_identidad) {
//     next({
//       code: 'NON_MODIFICABLE_PROPERTY',
//       sqlMessage:
//         "the property 'paciente.cod_paciente' and 'paciente.documento_identidad' are not modificable"
//     })
//     return
//   }

//   const { id } = req.params
//   const newInfo = Object.entries(body)
//   const values = newInfo.map(
//     ([key, value]) =>
//       `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
//   )
//   const query = `UPDATE cliente SET ${values} WHERE documento_identidad = '${id}'`

//   pool
//     .query(query, newInfo)
//     .then(([rows]) => {
//       console.log(`updating client ${id} at ${new Date()}`)
//       const { changedRows } = rows
//       if (changedRows === 0) {
//         return res.status(204).end()
//       }
//       res.status(200)
//       return res.json(body)
//     })
//     .catch(next)
// }

// export function deleteClient(req, res, next) {
//   const { id } = req.params
//   const query = `DELETE FROM cliente WHERE documento_identidad = '${id}'`

//   pool
//     .query(query)
//     .then(([fields]) => {
//       console.log(`deleting client ${id} at ${new Date()}`)
//       const { affectedRows } = fields
//       if (affectedRows <= 0) {
//         return res.status(204).end()
//       }
//       return res.status(204).end()
//     })
//     .catch(next)
// }
