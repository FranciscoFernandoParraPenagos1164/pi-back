import { Router } from 'express'
import { getClientes } from '../controllers/clients.controllers.js'

const router = Router()

router.get('/', getClientes)

export default router
