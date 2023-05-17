import express = require('express')
import { Express } from 'express'
import { config } from 'dotenv'
import { CORS } from './middlewares/CORS'
import validateEmptyBody from './middlewares/EmptyBodyValidation'
import validateAPIKEY from './middlewares/validateAPIKEY'
import createTables from './createTables'
import indexRoutes from './routes/index.routes'
import clientsRoutes from './routes/clients.routes'
import patientsRoutes from './routes/patients.routes'
import medicalConditions from './routes/medicalConditions.routes'
import nursesRoutes from './routes/nurses.routes'
import apointmentsRoutes from './routes/apointments.routes'
import extensionsRoutes from './routes/extensions.routes'
import visitsRoutes from './routes/visits.routes'
import notesRoutes from './routes/notes.routes'
import serverError from './middlewares/serverError'
config()

createTables()

const app: Express = express()
const PORT = process.env.APPLICATION_PORT || 8080

app.use(CORS)
app.use(validateAPIKEY)
app.use(express.json())
app.use(validateEmptyBody)
app.use(indexRoutes)
app.use('/clients', clientsRoutes)
app.use('/patients', patientsRoutes)
app.use('/conditions', medicalConditions)
app.use('/nurses', nursesRoutes)
app.use('/apointments', apointmentsRoutes)
app.use('/extensions', extensionsRoutes)
app.use('/visits', visitsRoutes)
app.use('/notes', notesRoutes)
app.use(serverError)

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
