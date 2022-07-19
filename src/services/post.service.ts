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

export default { createPost };
