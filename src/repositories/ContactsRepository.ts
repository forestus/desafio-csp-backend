import { ContactEntity } from '@entities/ContactEntity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(ContactEntity)
class ContactsRepository extends Repository<ContactEntity> {}
export { ContactsRepository }
