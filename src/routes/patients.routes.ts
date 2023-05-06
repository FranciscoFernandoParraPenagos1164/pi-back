import { IRouter, Router } from 'express'
import Patients from '../controllers/patients.controllers'

const router: IRouter = Router()
const patients = new Patients()

router.get('/', patients.get)
router.get('/:id', patients.getById)
router.post('/', patients.post)
router.patch('/:id', patients.patch)
router.delete('/:id', patients.delete)

export default router
