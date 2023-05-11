import { IRouter, Router } from 'express'
import Notes from '../controllers/notes.controllers'

const router: IRouter = Router()
const notes = new Notes()

router.get('/', notes.get)
router.get('/:id', notes.getById)
router.post('/', notes.post)
router.patch('/:id', notes.patch)
router.delete('/:id', notes.delete)

export default router
