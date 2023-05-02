import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection.js'

export function getNurses(req, res, next) {
  const query = 'SELECT * FROM enfermero'

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`listing all nurses at ${new Date()}`)
      if (rows.length === 0) {
        return res.status(204).end()
      }
      res.status(200)
      return res.json(rows)
    })
    .catch(next)
}

export function getNurse(req, res, next) {
  const { id } = req.params
  const query = `SELECT * FROM enfermero WHERE documento_identidad = '${id}'`

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`searching nurse ${id} at ${new Date()}`)
      if (!rows) {
        return res.status(204).end()
      }
      res.status(200)
      return res.json(rows)
    })
    .catch(next)
}

export function postNurse(req, res, next) {
  const body = { ...req.body }
  const id = uuidv4()
  const newNurse = { cod_enfermero: id, ...body }
  const query = 'INSERT INTO enfermero SET ?'

  pool
    .query(query, newNurse)
    .then(() => {
      console.log(`creating nurse ${id} at ${new Date()}`)
      res.status(201)
      return res.json(newNurse)
    })
    .catch(next)
}

export function patchNurse(req, res, next) {
  const body = { ...req.body }

  if (body.cod_enfermero || body.documento_identidad) {
    next({
      code: 'NON_MODIFICABLE_PROPERTY',
      sqlMessage:
        "the property 'paciente.cod_paciente' and 'paciente.documento_identidad' are not modificable"
    })
    return
  }

  const { id } = req.params
  const newInfo = Object.entries(body)
  const values = newInfo.map(
    ([key, value]) =>
      `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
  )
  const query = `UPDATE enfermero SET ${values} WHERE documento_identidad = '${id}'`

  pool
    .query(query, newInfo)
    .then(([rows]) => {
      console.log(`updating enfermero ${id} at ${new Date()}`)
      const { changedRows } = rows
      if (changedRows === 0) {
        return res.status(204).end()
      }
      res.status(200)
      return res.json(body)
    })
    .catch(next)
}

export function deleteNurse(req, res, next) {
  const { id } = req.params
  const query = `DELETE FROM enfermero WHERE documento_identidad = '${id}'`

  pool
    .query(query)
    .then(([fields]) => {
      console.log(`deleting nurse ${id} at ${new Date()}`)
      const { affectedRows } = fields
      if (affectedRows <= 0) {
        return res.status(204).end()
      }
      return res.status(204).end()
    })
    .catch(next)
}
