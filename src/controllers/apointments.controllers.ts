import { Request, Response, NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '../connection'
import { Validations } from '../utilities/validations'
import { IControllers } from '../interfaces/IController'
import { IApointments } from '../interfaces/IApointmens'
import { INurses } from '../interfaces/INurses'

export default class Apointments implements IControllers {
  public get(_req: Request, res: Response, next: NextFunction): void {
    const query = 'SELECT * FROM cita'

    pool
      .query(query)
      .then(async (response: RowDataPacket) => {
        console.log(`listing all apointments at ${new Date().toLocaleString()}`)
        const rows: Array<IApointments> = response[0]

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

    const query = `SELECT * FROM cita WHERE cod_cita = '${id}'`

    pool
      .query(query)
      .then(async (response: RowDataPacket) => {
        console.log(
          `searching apointments ${id} at ${new Date().toLocaleString()}`
        )
        const rows: Array<IApointments> = response[0]

        if (rows.length === 0) {
          res.status(204).end()
          return
        }

        const apointment: IApointments = rows[0]

        const queryNurse = `SELECT * FROM enfermero WHERE cod_enfermero = '${apointment.cod_enfermero}'`
        const responseWithNurse = await pool.query(queryNurse)
        const [nurse] = responseWithNurse[0]
        const apointmentWithNurse = { ...apointment, enfermero: nurse }
        delete apointmentWithNurse.cod_enfermero

        const queryClient = `SELECT * FROM cliente WHERE cod_cliente = '${apointment.cod_cliente}'`
        const responseWithClient = await pool.query(queryClient)
        const [client] = responseWithClient[0]
        const apointmentWithClient = { ...apointmentWithNurse, cliente: client }
        delete apointmentWithClient.cod_cliente

        const queryPatient = `SELECT * FROM paciente WHERE cod_paciente = '${apointment.cod_paciente}'`
        const responseWithPatient = await pool.query(queryPatient)
        const [patient] = responseWithPatient[0]
        const apointmentWithPatient = {
          ...apointmentWithClient,
          paciente: patient
        }
        delete apointmentWithPatient.cod_paciente

        res.status(200)
        res.json(apointmentWithPatient)
      })
      .catch(next)
  }

  public post(_req: Request, res: Response, next: NextFunction): void {
    const body: IApointments = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IApointments>(
      Apointments.validatePropertyes,
      body,
      next,
      ['cod_cita']
    )

    if (!isValid) {
      return
    }

    const { cod_enfermero, fecha, hora } = body
    const queryNurse = `SELECT enfermero.* FROM enfermero,cita WHERE enfermero.cod_enfermero = '${cod_enfermero}' AND cita.cod_enfermero = '${cod_enfermero}' AND cita.fecha = '${fecha}' AND cita.hora = '${hora}'`

    pool
      .query(queryNurse)
      .then((response: RowDataPacket) => {
        const rows: Array<INurses> = response[0]
        return rows
      })
      .then((rows: Array<INurses>) => {
        if (rows.length > 0) {
          next({
            code: 'NO_FREE_NURSE',
            message: `the nurse ${cod_enfermero} is already assigned to an appointment for that date and time`
          })
          return
        }

        const id = uuidv4()
        const newApointment: IApointments = { cod_cita: id, ...body }
        const query = 'INSERT INTO cita SET ?'

        pool.query(query, newApointment).then(() => {
          console.log(
            `creating apointment ${id} at ${new Date().toLocaleString()}`
          )

          res.status(201)
          res.json(newApointment)
        })
      })
      .catch(next)
  }

  public patch(_req: Request, res: Response, next: NextFunction): void {
    const body: IApointments = { ..._req.body }

    const isValid: Boolean = Validations.validateBody<IApointments>(
      Apointments.validatePropertyes,
      body,
      next,
      ['cod_cita', 'cod_cliente', 'cod_paciente']
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

    const query = `UPDATE cita SET ${values} WHERE cod_cita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(
          `updating apointment ${id} at ${new Date().toLocaleString()}`
        )

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

    const query = `DELETE FROM cita WHERE cod_cita = '${id}'`

    pool
      .query(query)
      .then((response: RowDataPacket) => {
        console.log(
          `deleting apointment ${id} at ${new Date().toLocaleString()}`
        )

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
    'cod_enfermero',
    'cod_cliente',
    'cod_paciente',
    'fecha',
    'hora',
    'razon_cita',
    'dias'
  ]
}
