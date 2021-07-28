import { getCustomRepository, Repository } from 'typeorm'
import { ContactsRepository } from '@repositories/ContactsRepository'
import { ContactEntity } from '@entities/ContactEntity'
import { AppError } from '@errors/AppError'

class ContactsServices {
  private readonly contactsRepository: Repository<ContactEntity>
  // O Constructor salva os repositórios na variável acima para reutilizar em todos os métodos do Serviço.
  constructor () {
    this.contactsRepository = getCustomRepository(ContactsRepository)
  }

  async store (firstname: string, lastname: string, email: string, phones: string[]): Promise<ContactEntity> {
    // Busca no banco o contato.
    const postAlreadyExists = await this.contactsRepository.findOne({ email })
    // Se ela já existe, retorna status e mensagem de erro.
    if (postAlreadyExists) {
      throw new AppError('Este Email de Contato Já Existe!', 409)
    }
    // Tenta salvar no banco, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Cria a entidade do Contato.
      const contactData = this.contactsRepository.create({
        firstname, lastname, email, ...phones
      })
      // Salva a entidade no banco.
      const contact = await this.contactsRepository.save(contactData)
      // retorna para o controller.
      return contact
    } catch (error) {
      throw new AppError(error)
    }
  }
}

export { ContactsServices }
