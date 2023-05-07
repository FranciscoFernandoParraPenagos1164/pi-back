import { IRouter, Router } from 'express'
import Extensions from '../controllers/extensions.controllers'

const router: IRouter = Router()
const extension = new Extensions()

router.get('/', extension.get)
router.get('/:id', extension.getById)
router.post('/', extension.post)
router.patch('/:id', extension.patch)
router.delete('/:id', extension.delete)

export default router
