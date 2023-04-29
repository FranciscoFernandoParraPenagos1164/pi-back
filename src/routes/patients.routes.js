import { Router } from 'express'
import {
  getPatients,
  getPatient,
  postPatient,
  patchPatient,
  deletePatient
} from '../controllers/patients.controllers.js'

const router = Router()

router.get('/', getPatients)
router.get('/:id', getPatient)
router.post('/', postPatient)
router.patch('/:id', patchPatient)
router.delete('/:id', deletePatient)

export default router
