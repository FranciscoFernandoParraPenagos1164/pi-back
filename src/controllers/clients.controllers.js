import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection.js'

export function getClients(req, res, next) {
  pool
    .query('SELECT * FROM cliente')
    .then(([rows]) => {
      console.log(`listing all clients at ${new Date()}`)
      res.status(200)
      res.json(rows)
    })
    .catch(next)
}

export function getClient(req, res, next) {
  const { id } = req.params

  pool
    .query(`SELECT * FROM cliente WHERE cod_cliente = ${id}`)
    .then(([rows]) => {
      console.log(`searching client ${id} at ${new Date()}`)
      res.status(200)
      res.json(rows)
    })
    .catch(next)
}

export function postClient(req, res, next) {
  const body = { ...req.body }
  const id = uuidv4()
  const newClient = { cod_cliente: id, ...body }
  pool
    .query('INSERT INTO cliente SET ?', newClient)
    .then(() => {
      console.log(`creating client ${id} at ${new Date()}`)
      res.status(201)
      res.json(newClient)
    })
    .catch(next)
}

export function patchClient(req, res, next) {
  const body = { ...req.body }
  const newInfo = Object.entries(body)
  const { id } = req.params
  pool
    .query(
      `UPDATE cliente SET ${newInfo.map(
        ([key, value]) =>
          `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
      )} WHERE cod_cliente = '${id}'`,
      newInfo
    )
    .then(() => {
      console.log(`updating client ${id} at ${new Date()}`)
      res.status(200)
      res.json(body)
    })
    .catch(next)
}

export function deleteClient(req, res, next) {
  const { id } = req.params

  pool
    .query(`DELETE FROM cliente WHERE cod_cliente = '${id}'`)
    .then(() => {
      console.log(`deleting client ${id} at ${new Date()}`)
      res.status(204).end()
    })
    .catch(next)
}
