import { Request, Response } from 'express'
import { AppError } from '@errors/AppError'
import { ContactsServices } from '@services/Posts/ContactsServices'

class ContactController {
  // Cria um novo Contato recebendo os dados pelo corpo da requisição, retorna os dados do Contato criado e seu relacionamento com status correspondente.
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

  // Busca todos os Contatos armazenados no Banco, retorna os dados dos contatos criados e seus relacionamentos em uma Array com status correspondente.
  async findAll (request: Request, response: Response): Promise<Response> {
    const contactsService = new ContactsServices()
    try {
      const contacts = await contactsService.findAll()
      return response.status(200).json(contacts)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Busca uma Postagem armazenada no Banco pelo ID, retorna os dados da Postagem criado e seu relacionamento com status correspondente.
  async findOne (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const contactsService = new ContactsServices()
    try {
      const contact = await contactsService.findOne(id)
      return response
        .status(200).json({
          ...contact
        })
    } catch (error) {
      throw new AppError(error)
    }
  }
}
export default new ContactController()
