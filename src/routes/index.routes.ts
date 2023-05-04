import { Router, IRouter } from 'express'
import { Index } from '../controllers/index.controllers'

const router: IRouter = Router()
const index = new Index()

router.get('/', index.get)

export default router
