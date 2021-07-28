import { Request, Response } from 'express'
import { AppError } from '@errors/AppError'
import { ContactsServices } from '@services/Posts/ContactsServices'

class ContactController {
  // Cria uma nova Postagem recebendo os dados pelo corpo da requisição, retorna os dados da Postagem criada e seu relacionamento com status correspondente.
  async store (request: Request, response: Response): Promise<Response> {
    const { firstname, lastname, email, phones } = request.body
    const contactsService = new ContactsServices()

    try {
      const contact = await contactsService.store(firstname, lastname, email, phones)
      return response.status(201).json({
        ...contact
      })
    } catch (error) {
      throw new AppError(error)
    }
  }
}
export default new ContactController()
