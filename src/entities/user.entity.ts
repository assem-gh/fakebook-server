import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

type Gender = 'male' | 'female' | 'other';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    name: 'user_name',
  })
  @Index()
  userName: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({})
  password: string;

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

  @Column()
  gender: Gender;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @Column({ type: 'date' })
  birthDay: Date;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
