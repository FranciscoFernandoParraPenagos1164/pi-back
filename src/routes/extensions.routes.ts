import { IRouter, Router } from 'express'
import QueryController from '../controllers/query.controllers'
import { IExtensions } from '../interfaces/IExtensions'

const router: IRouter = Router()
const extensions = new QueryController<IExtensions>(
  'extencion_cita',
  'cod_extencion_cita',
  'cod_extencion_cita',
  ['cod_extencion_cita'],
  ['cod_extencion_cita', 'cod_cita', 'tiempo_extendido']
)

router.get('/', (req, res, next) => {
  extensions.get(req, res, next)
})
router.get('/:id', (req, res, next) => {
  extensions.getById(req, res, next)
})
router.post('/', (req, res, next) => {
  extensions.post(req, res, next)
})
router.patch('/:id', (req, res, next) => {
  extensions.patch(req, res, next)
})
router.delete('/:id', (req, res, next) => {
  extensions.delete(req, res, next)
})

export default router
