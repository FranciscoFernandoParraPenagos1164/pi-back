import { Router } from 'express'
import {
  getClients,
  getClient,
  postClient,
  patchClient,
  deleteClient
} from '../controllers/clients.controllers.js'

const router = Router()

router.get('/', getClients)
router.get('/:id', getClient)
router.post('/', postClient)
router.patch('/:id', patchClient)
router.delete('/:id', deleteClient)

export default router
