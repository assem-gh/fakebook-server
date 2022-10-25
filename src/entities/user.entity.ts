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
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from './Comment.entity';
import { NotificationEntity } from './Notification.entity';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';

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

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => PostEntity, (post) => post.owner)
  posts: PostEntity[];

  @ManyToMany(() => PostEntity, (post) => post.likes)
  favoritePosts: PostEntity[];

  @ManyToMany(() => PostEntity, (post) => post.savedBy)
  @JoinTable({
    joinColumn: { name: 'saved_posts', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'saved_by', referencedColumnName: 'id' },
  })
  savedPosts: PostEntity[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
