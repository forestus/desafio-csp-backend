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
    const {
      names
      , email
    } = request.params
    const contactsService = new ContactsServices()
    try {
      const contacts = await contactsService.findAll(names, email)
      return response.status(200).json(contacts)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Busca um Contato armazenado no Banco pelo ID, retorna os dados do Contato criado e seu relacionamento com status correspondente.
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

  // Atualiza um Contato ja Existente no Banco com os Dados Informados pelo ID passado como parametro, firstname, lastname, email passados no corpo da requisição,
  // retorna os dados do Contato atualizado e seu relacionamento com status correspondente.
  async update (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { firstname, lastname, email } = request.body
    const contactsService = new ContactsServices()
    try {
      const contactUpdated = await contactsService.update(id, firstname, lastname, email)
      return response
        .status(200).json({
          ...contactUpdated
        })
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Atualiza um Telefone ja Existente no Banco com os Dados Informados pelo ID passado como parametro, phones passado no corpo da requisição,
  // retorna os dados do Contato atualizado e seu relacionamento com status correspondente.
  async updatePhone (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { phone } = request.body
    const contactsService = new ContactsServices()
    try {
      const contactUpdated = await contactsService.updatePhone(id, phone)
      return response
        .status(200).json({
          ...contactUpdated
        })
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Exclui um Contato pelo ID passado como parametro, retorna o status correspondente.
  async destroy (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const contactsService = new ContactsServices()

    try {
      const isDeleted = await contactsService.destroy(id)
      if (!isDeleted.affected) {
        throw new AppError('Não foi Deletado!', 500)
      }
      return response.sendStatus(200)
    } catch (error) {
      throw new AppError(error)
    }
  }

  // Exclui um Telefone pelo ID passado como parametro, retorna o status correspondente.
  async destroyPhone (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const contactsService = new ContactsServices()

    try {
      const isDeleted = await contactsService.destroyPhone(id)
      if (!isDeleted.affected) {
        throw new AppError('Não foi Deletado!', 500)
      }
      return response.sendStatus(200)
    } catch (error) {
      throw new AppError(error)
    }
  }
}
export default new ContactController()
