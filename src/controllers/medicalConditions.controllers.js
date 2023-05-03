import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection.js'

export function getConditions(req, res, next) {
  const query = 'SELECT * FROM condicion_medica'

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`listing all medical conditions at ${new Date()}`)
      if (rows.length === 0) {
        return res.status(404).end()
      }
      res.status(200)
      return res.json(rows)
    })
    .catch(next)
}

export function getCondition(req, res, next) {
  const { id } = req.params
  const query = `SELECT * FROM condicion_medica WHERE cod_condicion_medica = '${id}'`

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`searching medical condition ${id} at ${new Date()}`)
      if (rows.length === 0) {
        return res.status(404).end()
      }
      res.status(200)
      return res.json(rows)
    })
    .catch(next)
}

export function postCondition(req, res, next) {
  const body = { ...req.body }
  const id = uuidv4()
  const newCondition = { cod_condicion_medica: id, ...body }
  const query = 'INSERT INTO condicion_medica SET ?'

  pool
    .query(query, newCondition)
    .then(() => {
      console.log(`creating medical condition ${id} at ${new Date()}`)
      res.status(201)
      return res.json(newCondition)
    })
    .catch(next)
}

export function patchCondition(req, res, next) {
  const body = { ...req.body }
  const newInfo = Object.entries(body)
  const { id } = req.params
  const query = `UPDATE condicion_medica SET
  ${newInfo.map(
    ([key, value]) =>
      `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
  )}
  WHERE cod_condicion_medica = '${id}'`

  pool
    .query(query, newInfo)
    .then(() => {
      console.log(`updating medical condition ${id} at ${new Date()}`)
      res.status(200)
      return res.json(body)
    })
    .catch(next)
}

export function deleteCondition(req, res, next) {
  const { id } = req.params
  const query = `DELETE FROM condicion_medica WHERE cod_condicion_medica = '${id}'`

  pool
    .query(query)
    .then(([fields]) => {
      const { affectedRows } = fields
      console.log(`deleting medical condition ${id} at ${new Date()}`)
      if (affectedRows <= 0) {
        return res.status(404).end()
      }
      return res.status(204).end()
    })
    .catch(next)
}
