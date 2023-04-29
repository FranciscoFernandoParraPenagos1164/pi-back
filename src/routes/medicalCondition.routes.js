import { Router } from 'express'
import {
  getConditions,
  getCondition,
  postCondition,
  patchCondition,
  deleteCondition
} from '../controllers/medicalCondition.controllers.js'

const router = Router()

router.get('/', getConditions)
router.get('/:id', getCondition)
router.post('/', postCondition)
router.patch('/:id', patchCondition)
router.delete('/:id', deleteCondition)

export default router
