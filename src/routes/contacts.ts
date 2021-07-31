import ContactController from '@controllers/ContactController'
import ContactValidator from '@services/Posts/ContactValidator'
import { Router } from 'express'
const router = Router()

// Rotas Publicas
// Contacts
router.post('/', ContactValidator.validateStore, ContactController.store)
router.get('/:id(\\d+)', ContactValidator.validateId, ContactController.findOne) // deve vir sempre antes de findAll
router.get('/:names?/:email?', ContactValidator.validateFindAll, ContactController.findAll)
router.put('/:id', ContactValidator.validateUpdate, ContactController.update)
router.put('/phone/:id', ContactValidator.validateUpdatePhone, ContactController.updatePhone)
router.delete(['/', '/:id'], ContactValidator.validateId, ContactController.destroy)
router.delete(['/phone', '/phone/:id'], ContactValidator.validateId, ContactController.destroyPhone)

export default router
