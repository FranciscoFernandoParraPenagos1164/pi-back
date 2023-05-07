import { IRouter, Router } from 'express'
import Clients from '../controllers/clients.controllers'

const router: IRouter = Router()
const clients = new Clients()

router.get('/', clients.get)
router.get('/:id', clients.getById)
router.post('/', clients.post)
router.patch('/:id', clients.patch)
router.delete('/:id', clients.delete)

export default router
