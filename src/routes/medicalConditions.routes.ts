import { IRouter, Router } from 'express'
import MedicalConditions from '../controllers/medicalConditions.controllers'

const router: IRouter = Router()
const medicalConditions = new MedicalConditions()

router.get('/', medicalConditions.get)
router.get('/:id', medicalConditions.getById)
router.post('/', medicalConditions.post)
router.patch('/:id', medicalConditions.patch)
router.delete('/:id', medicalConditions.delete)

export default router
