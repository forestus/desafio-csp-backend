import { Router } from 'express'
import contactRouter from './contacts'
const routes = Router()

// Rotas
routes.use('/contacts', contactRouter)

export default routes
