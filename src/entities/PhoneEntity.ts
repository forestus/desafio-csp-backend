import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { ContactEntity } from './ContactEntity'

@Entity('phones')
class PhoneEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: string

  @Column({ unique: true })
  phone: string

  @ManyToOne(() => ContactEntity, (contactentity) => contactentity.phones, {
    onDelete: 'CASCADE'
  })
  contact: ContactEntity

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
export { PhoneEntity }
