import { IRouter, Router } from 'express'
import Apointments from '../controllers/apointments.controllers'

const router: IRouter = Router()
const apointments = new Apointments()

router.get('/', apointments.get)
router.get('/:id', apointments.getById)
router.post('/', apointments.post)
router.patch('/:id', apointments.patch)
router.delete('/:id', apointments.delete)

export default router
