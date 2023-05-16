import { IRouter, Router } from 'express'
import QueryController from '../controllers/query.controllers'
import { IMedicalConditions } from '../interfaces/IMedicalConditions'

const router: IRouter = Router()
const medicalConditions = new QueryController<IMedicalConditions>(
  'condicion_medica',
  'cod_condicion_medica',
  'cod_condicion_medica',
  ['cod_condicion_medica'],
  ['cod_condicion_medica', 'cod_paciente']
)

router.get('/', (req, res, next) => {
  medicalConditions.get(req, res, next)
})
router.get('/:id', (req, res, next) => {
  medicalConditions.getById(req, res, next)
})
router.post('/', (req, res, next) => {
  medicalConditions.post(req, res, next)
})
router.patch('/:id', (req, res, next) => {
  medicalConditions.patch(req, res, next)
})
router.delete('/:id', (req, res, next) => {
  medicalConditions.delete(req, res, next)
})

export default router
