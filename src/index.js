import express from 'express'
import dotenv from 'dotenv'
import indexRoutes from './routes/index.routes.js'
import clientsRoutes from './routes/clients.routes.js'
import { badRequest } from './middlewares/bad-request.middleware.js'
dotenv.config()

const app = express()
const PORT = process.env.APLICATION_PORT || 3050

app.use(express.json())
app.use(indexRoutes)
app.use('/clients', clientsRoutes)
app.use(badRequest)

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
