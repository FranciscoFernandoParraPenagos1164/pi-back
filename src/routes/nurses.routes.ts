import { IRouter, Router } from 'express'
import QueryController from '../controllers/query.controllers'
import { INurses } from '../interfaces/INurses'

const router: IRouter = Router()
const nurses = new QueryController<INurses>(
  'enfermero',
  'documento_identidad',
  'cod_enfermero',
  ['cod_enfermero'],
  ['cod_enfermero', 'documento_identidad']
)

router.get('/', (req, res, next) => {
  nurses.get(req, res, next)
})
router.get('/:id', (req, res, next) => {
  nurses.getById(req, res, next)
})
router.post('/', (req, res, next) => {
  nurses.post(req, res, next)
})
router.patch('/:id', (req, res, next) => {
  nurses.patch(req, res, next)
})
router.delete('/:id', (req, res, next) => {
  nurses.delete(req, res, next)
})

export default router
