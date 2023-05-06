import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { RowDataPacket } from 'mysql2'
import { Validations } from '../utilities/validations'
import { IPatients } from '../interfaces/IPatients'
import { IMedicalConditions } from '../interfaces/IMedicalConditions'
import { IControllers } from '../interfaces/IController'

export default class Patients implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM paciente'

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`listing all patients at ${new Date()}`)

        const rows = response[0]

        return rows
      })
      .then((rows: Array<IPatients>) => {
        if (rows.length === 0) {
          res.status(204).end()
          return
        }

        const query = 'SELECT * FROM condicion_medica WHERE cod_paciente = ?'

        const patients = rows.map(async (patient) => {
          const id: string = patient.cod_paciente
          const response: RowDataPacket = await pool.query(query, id)
          const conditions: Array<string> = response[0].map(
            (condition: IMedicalConditions) => condition.descripcion
          )
          return { ...patient, condiciones_medicas: conditions }
        })

        Promise.all(patients).then((patient: Array<IPatients>) => {
          res.status(200)
          res.json(patient)
        })
      })
      .catch(next)
  }

  public getById(_req: Request, res: Response, next: NextFunction): void {
    const { id } = _req.params
    const query = `SELECT * FROM paciente WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`searching patient ${id} at ${new Date()}`)

        const rows: Array<IPatients> = response[0]
        return rows
      })
      .then((rows: Array<IPatients>) => {
        if (rows.length === 0) {
          res.status(204).end()
          return
        }

        const patient: IPatients = rows[0]
        const query = 'SELECT * FROM condicion_medica WHERE cod_paciente = ?'
        const id: string = patient.cod_paciente

        pool.query(query, id).then(([row]) => {
          const conditions: Array<string> = row.map(
            (condition: IMedicalConditions) => condition.descripcion
          )

          res.status(200)
          res.json({ ...patient, condiciones_medicas: conditions })
        })
      })
      .catch(next)
  }

  public post(_req: Request, res: Response, next: NextFunction): void {
    const body: IPatients = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IPatients>(
      Patients.validatePropertyes,
      body,
      next
    )

    if (!isValid) {
      return
    }

    if (body.cod_paciente) {
      next({
        code: 'NO_VALID_PROPERTY',
        message: 'the key cod_paciente is managed by the server'
      })
      return
    }

    const id = uuidv4()
    const newPatient: IPatients = { cod_paciente: id, ...body }
    delete newPatient.condiciones_medicas
    const conditions: Array<string> = _req.body.condiciones_medicas

    const query = 'INSERT INTO paciente SET ?'

    pool
      .query(query, newPatient)
      .then(() => {
        console.log(`creating patient ${id} at ${new Date()}`)
      })
      .then(() => {
        if (conditions.length === 0) {
          res.status(201)
          res.json(newPatient)
          return
        }

        const medicalConditions: Array<Array<string>> = conditions.map(
          (condition: string) => {
            const conditionID = uuidv4()
            return [conditionID, id, condition]
          }
        )

        const query = 'INSERT INTO condicion_medica VALUES ?'

        pool.query(query, [medicalConditions]).then(() => {
          res.status(201)
          res.json({ ...newPatient, conditions })
          return
        })
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: IPatients = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IPatients>(
      Patients.validatePropertyes,
      body,
      next
    )

    if (!isValid) {
      return
    }

    if (body.cod_paciente || body.documento_identidad) {
      next({
        code: 'PROPERTY_UNCHANGEABLE',
        sqlMessage:
          'the key cod_paciente and documento_identidad are not modificable'
      })
      return
    }

    const newInfo = Object.entries(body)
    const { id } = _req.params
    const values = newInfo.map(
      ([key, value]) =>
        `${key} = ${typeof value === 'string' ? `'${value}'` : `${value}`}`
    )

    const query = `UPDATE paciente SET ${values} WHERE documento_identidad = '${id}'`

    console.log(query)

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`updating patient ${id} at ${new Date()}`)

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

    const query = `DELETE FROM paciente WHERE documento_identidad = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(`deleting patient ${id} at ${new Date()}`)

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
    'edad',
    'direccion',
    'primer_nombre',
    'segundo_nombre',
    'primer_apellido',
    'segundo_apellido',
    'tipo_documento',
    'documento_identidad',
    'condiciones_medicas'
  ]
}
