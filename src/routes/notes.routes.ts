import { IRouter, Router } from 'express'
import QueryController from '../controllers/query.controllers'
import { INotes } from '../interfaces/INotes'

const router: IRouter = Router()
const notes = new QueryController<INotes>(
  'nota',
  'cod_nota',
  'cod_nota',
  ['cod_nota'],
  ['cod_nota', 'cod_visita']
)

router.get('/', (req, res, next) => {
  notes.get(req, res, next)
})
router.get('/:id', (req, res, next) => {
  notes.getById(req, res, next)
})
router.post('/', (req, res, next) => {
  notes.post(req, res, next)
})
router.patch('/:id', (req, res, next) => {
  notes.patch(req, res, next)
})
router.delete('/:id', (req, res, next) => {
  notes.delete(req, res, next)
})

export default router
