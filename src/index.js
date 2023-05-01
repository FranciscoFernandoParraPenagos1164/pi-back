import express from 'express'
import dotenv from 'dotenv'
import indexRoutes from './routes/index.routes.js'
import clientsRoutes from './routes/clients.routes.js'
import patientsRoutes from './routes/patients.routes.js'
import medicalConditions from './routes/medicalCondition.routes.js'
import nursesRoutes from './routes/nurse.routes.js'
import { badRequest } from './middlewares/bad-request.middlewares.js'
dotenv.config()

const app = express()
const PORT = process.env.APLICATION_PORT || 3050

app.use(express.json())
app.use(indexRoutes)
app.use('/clients', clientsRoutes)
app.use('/patients', patientsRoutes)
app.use('/medical-conditions', medicalConditions)
app.use('/nurses', nursesRoutes)
app.use(badRequest)

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
