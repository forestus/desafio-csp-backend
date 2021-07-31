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
    let phoneExists: string[] = []
    // Busca no banco o contato.
    const postAlreadyExists = await this.contactsRepository.findOne({ email })
    // Se ela já existe, retorna status e mensagem de erro.
    if (postAlreadyExists) {
      throw new AppError('Este Email de Contato Já Existe!', 409)
    }
    // Percorre a Array de Telefones verificando cada um no banco
    await Promise.all(
      phones.map(async (phone) => {
        function hasDuplicates (phones: string[]): boolean {
          return new Set(phones).size !== phones.length
        }
        // caso telefones estejam repetidos retorna mensagem e status de erro
        if (hasDuplicates(phones)) {
          throw new AppError('Telefones Repetidos!', 409)
        }
        // busca no banco o telefone.
        const phoneCheck = await this.phonesRepository.findOne({ phone })
        // caso o telefone já exista ele retorna o mesmo.
        phoneCheck && phoneExists.push(phoneCheck.phone)
        return phoneExists
      })
    )
    // caso telefone já exista retorna mensagem e status de erro
    if (phoneExists.length !== 0) {
      throw new AppError(phoneExists && `Telefone's Já Existem! ${phoneExists}`, 409)
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
          // salva o telefone no banco
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

  async findAll (names: string, email: string): Promise<ContactEntity[]> {
    let firstname, lastname
    // Caso passe os nomes, Converte os mesmos para usar como filtro.
    if (names) {
      [firstname, lastname] = names.trim().split(' ')
    }
    // Busca no banco todos os Contatos a partir dos filtros.
    const contacts = await this.contactsRepository.find({
      where: {
        firstname: firstname || false,
        lastname: lastname || false,
        email: email || false
      },
      relations: ['phones']
    })
    // Se os Contatos não forem encontrados, retorna status e mensagem de erro.
    if (contacts.length === 0) {
      throw new AppError('Nenhum Contato Encontrado!', 404)
    }
    // retorna os contatos encontrados ao Controller
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

  async update (id: string, firstname: string, lastname: string, email: string): Promise<ContactEntity> {
    // Busca no banco o Contato.
    const contact = await this.contactsRepository.findOne({
      where: { id }
    })
    // Se o Contato não existe, retorna status e mensagem de erro.
    if (contact == null) {
      throw new AppError('Nenhum Contato Encontrado!', 404)
    }
    // Verifica no banco se esse email já existe e caso sim retorna mensagem e erro.
    const emailAlreadyExists = await this.contactsRepository.findOne({ email })
    if (emailAlreadyExists) {
      throw new AppError('Este Email de Contato Já Existe!', 409)
    }

    // Tenta salvar no banco o Contato Atualizado, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Cria a entidade do Contato.
      const contactUpdated = this.contactsRepository.create({
        firstname,
        lastname,
        email
      })
      // Atualiza a entidade no banco e logo após retorna para o Controller.
      await this.contactsRepository.update(id, { ...contactUpdated })
      return contactUpdated
    } catch (error) {
      throw new AppError(error)
    }
  }

  async updatePhone (id: string, phone: string): Promise<PhoneEntity> {
    // Busca no banco o Telefone.
    const phoneAlreadyExists = await this.phonesRepository.findOne({
      where: { id }, relations: ['contact']
    })
    // Se o Telefone não existe, retorna status e mensagem de erro.
    if (!phoneAlreadyExists) {
      throw new AppError('Nenhum Telefone Encontrado!', 404)
    }
    // Tenta salvar no banco o Telefone Atualizado, caso falhe retorna o erro pela instancia de erro "AppError" criada.
    try {
      // Cria a entidade do Telefone.
      const phoneData = this.phonesRepository.create({
        phone
      })
      // Atualiza a entidade no banco e logo após retorna para o Controller.
      await this.phonesRepository.update(id, phoneData)
      return phoneData
    } catch (error) {
      throw new AppError(error)
    }
  }

  async destroy (id: string): Promise<DeleteResult> {
    // Busca no banco o Contato com id do mesmo.
    const post = await this.contactsRepository.findOne({ id })
    // Se o Contato não existe, retorna status e mensagem de erro.
    if (!post) {
      throw new AppError('Contato não Encontrado!', 404)
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
