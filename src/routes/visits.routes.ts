import { IRouter, Router } from 'express'
import QueryController from '../controllers/query.controllers'
import { IVisits } from '../interfaces/IVisits'

const router: IRouter = Router()
const visits = new QueryController<IVisits>(
  'visita',
  'cod_visita',
  'cod_visita',
  ['cod_visita'],
  ['cod_visita', 'cod_cita', 'hora_entrada', 'hora_salida']
)

router.get('/', (req, res, next) => {
  visits.get(req, res, next)
})
router.get('/:id', (req, res, next) => {
  visits.getById(req, res, next)
})
router.post('/', (req, res, next) => {
  visits.post(req, res, next)
})
router.patch('/:id', (req, res, next) => {
  visits.patch(req, res, next)
})
router.delete('/:id', (req, res, next) => {
  visits.delete(req, res, next)
})

export default router
