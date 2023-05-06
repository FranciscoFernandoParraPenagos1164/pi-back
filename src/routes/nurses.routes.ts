import { IRouter, Router } from 'express'
import Nurses from '../controllers/nurses.controllers'

const router: IRouter = Router()
const nurses = new Nurses()

router.get('/', nurses.get)
router.get('/:id', nurses.getById)
router.post('/', nurses.post)
router.patch('/:id', nurses.patch)
router.delete('/:id', nurses.delete)

export default router
