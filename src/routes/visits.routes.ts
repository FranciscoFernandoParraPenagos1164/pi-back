import { IRouter, Router } from 'express'
import Visits from '../controllers/visits.controllers'

const router: IRouter = Router()
const visits = new Visits()

router.get('/', visits.get)
router.get('/:id', visits.getById)
router.post('/', visits.post)
router.patch('/:id', visits.patch)
router.delete('/:id', visits.delete)

export default router
