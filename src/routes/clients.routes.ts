import { IRouter, Router } from 'express'
import QueryController from '../controllers/query.controllers'
import { IClient } from '../interfaces/IClients'

const router: IRouter = Router()
const clients = new QueryController<IClient>(
  'cliente',
  'documento_identidad',
  ['cod_cliente'],
  ['cod_cliente', 'documento_identidad'],
  'cod_cliente'
)

router.get('/', (req, res, next) => {
  clients.get(req, res, next)
})
router.get('/:id', (req, res, next) => {
  clients.getById(req, res, next)
})
router.post('/', (req, res, next) => {
  clients.post(req, res, next)
})
router.patch('/:id', (req, res, next) => {
  clients.patch(req, res, next)
})
router.delete('/:id', (req, res, next) => {
  clients.delete(req, res, next)
})

export default router
