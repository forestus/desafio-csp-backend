import { PhoneEntity } from '@entities/PhoneEntity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(PhoneEntity)
class PhonesRepository extends Repository<PhoneEntity> {}
export { PhonesRepository }
