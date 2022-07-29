import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  content: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.favoritePosts)
  @JoinTable({
    joinColumn: { name: 'post_likes', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'liked_posts', referencedColumnName: 'id' },
  })
  likes: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.savedPosts)
  saved: UserEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
