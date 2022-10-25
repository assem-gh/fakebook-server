import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

type Gender = 'male' | 'female' | 'other';

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gender: Gender;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    name: 'profile_image',
    default:
      'https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png',
  })
  profileImage: string;

  @Column({
    name: 'cover_image',
    nullable: true,
  })
  coverImage: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    cascade: true,
  })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
