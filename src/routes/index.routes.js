import { Router } from 'express'
import { getIndex, getName } from '../controllers/index.controllers.js'

const router = Router()

router.get('/', getIndex)
router.get('/:name', getName)

export default router
