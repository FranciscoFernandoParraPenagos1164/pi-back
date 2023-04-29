import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection.js'

export function getPatients(req, res, next) {
  const query = 'SELECT * FROM paciente'

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`listing all patients at ${new Date()}`)
      return rows
    })
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(404).end()
      }

      const query = 'SELECT * FROM condicion_medica WHERE cod_paciente = ?'

      const patients = rows.map(async (patient) => {
        const id = patient.cod_paciente
        const response = await pool.query(query, id)
        const conditions = response[0].map((condition) => condition.descripcion)
        return { ...patient, condiciones_medicas: conditions }
      })

      Promise.all(patients).then((patient) => {
        res.status(200)
        res.json(patient)
      })
    })
    .catch(next)
}

export function getPatient(req, res, next) {
  const { id } = req.params
  const query = `SELECT * FROM paciente WHERE documento_identidad = '${id}'`

  pool
    .query(query)
    .then(([rows]) => {
      console.log(`searching patient ${id} at ${new Date()}`)
      return rows
    })
    .then(([rows]) => {
      if (!rows) {
        return res.status(404).end()
      }

      const query = 'SELECT * FROM condicion_medica WHERE cod_paciente = ?'
      const id = rows.cod_paciente
      pool.query(query, id).then(([row]) => {
        const conditions = row.map((condition) => condition.descripcion)
        res.status(200)
        res.json({ ...rows, condiciones_medicas: conditions })
      })
    })
    .catch(next)
}

export function postPatient(req, res, next) {
  const body = { ...req.body }
  const id = uuidv4()
  const newPatient = { cod_paciente: id, ...body }
  delete newPatient.condiciones_medicas
  const conditions = req.body.condiciones_medicas

  const query = 'INSERT INTO paciente SET ?'

  pool
    .query(query, newPatient)
    .then(() => {
      console.log(`creating patient ${id} at ${new Date()}`)
      res.status(201)
      if (conditions.length === 0) {
        return res.json(newPatient)
      }
    })
    .then(() => {
      const medicalConditions = conditions.map((condition) => {
        const conditionID = uuidv4()
        return [conditionID, id, condition]
      })

      const query = 'INSERT INTO condicion_medica VALUES ?'

      pool.query(query, [medicalConditions]).then(() => {
        res.status(201)
        return res.json({ ...newPatient, conditions })
      })
    })
    .catch(next)
}

export function patchPatient(req, res, next) {
  const body = { ...req.body }
  const newInfo = Object.entries(body)
  const { id } = req.params
  const query = `UPDATE paciente SET
  ${newInfo.map(
    ([key, value]) =>
      `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
  )}
  WHERE documento_identidad = '${id}'`

  pool
    .query(query, newInfo)
    .then(([rows]) => {
      console.log(`updating patient ${id} at ${new Date()}`)
      const { changedRows } = rows
      if (changedRows === 0) {
        return res.status(404).end()
      }
      res.status(200)
      return res.json(body)
    })
    .catch(next)
}

export function deletePatient(req, res, next) {
  const { id } = req.params
  const query = `DELETE FROM paciente WHERE documento_identidad = '${id}'`

  pool
    .query(query)
    .then(([fields]) => {
      const { affectedRows } = fields
      console.log(`deleting patient ${id} at ${new Date()}`)
      if (affectedRows <= 0) {
        return res.status(404).end()
      }
      return res.status(204).end()
    })
    .catch(next)
}
