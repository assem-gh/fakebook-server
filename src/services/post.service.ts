import { LessThan } from 'typeorm';

import { AppDataSource } from '../data-source';
import { HttpError } from '../utils/HttpError';
import { NewPost } from '../schemas/post.schema';
import { PostEntity } from '../entities/post.entity';
import { userRepository } from './user.service';

export const postRepository = AppDataSource.getRepository(PostEntity);

const createPost = async ({ owner, ...postData }: NewPost) => {
  const newPost = postRepository.create(postData);

  const user = await userRepository.findOneBy({
    id: owner,
  });
  if (!user) throw new HttpError(400, 'User Not found');

  newPost.owner = owner as any;
  const post = await postRepository.save(newPost);

  return post;
};

const getAllPosts = async (before: Date, limit: number) => {
  const posts = await postRepository.find({
    relations: {
      owner: true,
    },
    select: {
      owner: {
        id: true,
        profileImage: true,
        userName: true,
        firstName: true,
        lastName: true,
      },
    },
    where: { updatedAt: LessThan(before) },
    take: limit,
    order: {
      updatedAt: 'DESC',
    },
  });

  const first = await getFirstPost();
  const end = posts[posts.length - 1].id === first.id;
  const next = end ? '' : posts[posts.length - 1].updatedAt;

  return { posts, next, end };
};

const getFirstPost = async () => {
  const [first] = await postRepository.find({
    order: {
      updatedAt: 'ASC',
    },
    take: 1,
  });

  return first;
};

export default { createPost, getAllPosts };
