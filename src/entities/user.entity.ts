import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Comment } from './Comment.entity';
import { PostEntity } from './post.entity';

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
  birthday: Date;

  @OneToMany(() => PostEntity, (post) => post.owner)
  posts: PostEntity[];

  @ManyToMany(() => PostEntity, (post) => post.likes)
  favoritePosts: PostEntity[];

  @ManyToMany(() => PostEntity, (post) => post.saved)
  @JoinTable({
    joinColumn: { name: 'saved_posts', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'saved', referencedColumnName: 'id' },
  })
  savedPosts: PostEntity[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
