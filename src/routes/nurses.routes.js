import { Router } from 'express'
import {
  getNurses,
  getNurse,
  postNurse,
  patchNurse,
  deleteNurse
} from '../controllers/nurses.controllers.js'

const router = Router()

router.get('/', getNurses)
router.get('/:id', getNurse)
router.post('/', postNurse)
router.patch('/:id', patchNurse)
router.delete('/:id', deleteNurse)

export default router
