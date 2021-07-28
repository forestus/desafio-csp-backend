import { DeleteResult, getCustomRepository, Repository } from 'typeorm'
import { ContactsRepository } from '@repositories/ContactsRepository'
import { PhonesRepository } from '@repositories/PhonesRepository'
import { ContactEntity } from '@entities/ContactEntity'
import { PhoneEntity } from '@entities/PhoneEntity'
import { AppError } from '@errors/AppError'

class ContactsServices {
  private readonly contactsRepository: Repository<ContactEntity>
  private readonly phonesRepository: Repository<PhoneEntity>
  // O Constructor salva os repositórios na variável acima para reutilizar em todos os métodos do Serviço.
  constructor () {
    this.contactsRepository = getCustomRepository(ContactsRepository)
    this.phonesRepository = getCustomRepository(PhonesRepository)
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
        firstname, lastname, email
      })
      // Salva a entidade no banco.
      const contact = await this.contactsRepository.save(contactData)

      // Percorre a Array de Telefones salvando cada um no banco
      await Promise.all(
        phones.map(async (phone) => {
          const phoneData = this.phonesRepository.create({ phone, contact })
          await this.phonesRepository.save(phoneData)
        })
      )
      // insere no contato criado os dados dos telefones criados a partir relacionamento.
      contact.phones = await this.phonesRepository.find({
        contact
      })

      // retorna para o controller.
      return contact
    } catch (error) {
      throw new AppError(error)
    }
  }

  async findAll (): Promise<ContactEntity[]> {
    // Busca no banco todos os Contatos.
    const contacts = await this.contactsRepository.find({
      relations: ['phones']
    })
    // Se os Contatos não forem encontrados, retorna status e mensagem de erro.
    if (!contacts) {
      throw new AppError('Nenhum Contato Encontrado!', 404)
    }
    return contacts
  }

  async findOne (id: string): Promise<ContactEntity> {
    // Busca no banco o Contato com id do mesmo.
    const post = await this.contactsRepository.findOne({
      where: { id: id },
      relations: ['phones']
    })
    // Se o Contato não existe, retorna status e mensagem de erro.
    if (!post) {
      throw new AppError('Nenhum Contato Encontrado!', 404)
    }
    // Retorna para o Controller.
    return post
  }

  async destroy (id: string): Promise<DeleteResult> {
    // Busca no banco o Contato com id do mesmo.
    const post = await this.contactsRepository.findOne({ id })
    // Se o Contato não existe, retorna status e mensagem de erro.
    if (!post) {
      throw new AppError('Contato não Encontrada!', 404)
    }
    // Tenta Excluir no banco o Contato pelo id passado, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Apaga a entidade pelo ID passado e logo após retorna as linhas afetadas no banco para o Controller.
      const deleted = await this.contactsRepository.delete(post.id)
      return deleted
    } catch (error) {
      throw new AppError(error)
    }
  }
}

export { ContactsServices }
