import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { PhoneEntity } from './PhoneEntity'

@Entity('contacts')
class ContactEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: string

  @Column()
  firstname: string

  @Column()
  lastname: string

  @Column({ unique: true })
  email: string

  @OneToMany(() => PhoneEntity, (phoneentity) => phoneentity.contact)
  phones: PhoneEntity[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
export { ContactEntity }
