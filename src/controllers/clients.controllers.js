import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection.js'

export function getClients(req, res, next) {
  const query = 'SELECT * FROM cliente'

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`listing all clients at ${new Date()}`)
      res.status(200)
      return res.json(rows)
    })
    .catch(next)
}

export function getClient(req, res, next) {
  const { id } = req.params
  const query = `SELECT * FROM cliente WHERE documento_identidad = '${id}'`

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`searching client ${id} at ${new Date()}`)
      if (rows.length === 0) {
        return res.status(404).end()
      }
      res.status(200)
      return res.json(rows)
    })
    .catch(next)
}

export function postClient(req, res, next) {
  const body = { ...req.body }
  const id = uuidv4()
  const newClient = { cod_cliente: id, ...body }
  const query = 'INSERT INTO cliente SET ?'

  pool
    .query(query, newClient)
    .then(() => {
      console.log(`creating client ${id} at ${new Date()}`)
      res.status(201)
      return res.json(newClient)
    })
    .catch(next)
}

export function patchClient(req, res, next) {
  const body = { ...req.body }
  const newInfo = Object.entries(body)
  const { id } = req.params
  const query = `UPDATE cliente SET
  ${newInfo.map(
    ([key, value]) =>
      `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
  )} 
  WHERE documento_identidad = '${id}'`

  pool
    .query(query, newInfo)
    .then(([rows]) => {
      console.log(`updating client ${id} at ${new Date()}`)
      if (rows.length === 0) {
        return res.status(404).end()
      }
      res.status(200)
      return res.json(body)
    })
    .catch(next)
}

export function deleteClient(req, res, next) {
  const { id } = req.params
  const query = `DELETE FROM cliente WHERE documento_identidad = '${id}'`

  pool
    .query(query)
    .then(() => {
      console.log(`deleting client ${id} at ${new Date()}`)
      return res.status(204).end()
    })
    .catch(next)
}
