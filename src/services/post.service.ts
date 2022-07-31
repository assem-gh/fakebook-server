import { LessThan } from 'typeorm';

import { AppDataSource } from '../data-source';
import { HttpError } from '../utils/HttpError';
import { NewPost, UpdatePost } from '../schemas/post.schema';
import { PostEntity } from '../entities/post.entity';
import userService from './user.service';

export const postRepository = AppDataSource.getRepository(PostEntity);

const createPost = async ({ owner, ...postData }: NewPost) => {
  const newPost = postRepository.create(postData);

  const user = await userService.findUser(owner);

  newPost.owner = owner as any;
  newPost.comments = [];
  const post = await postRepository.save(newPost);

  return post;
};

export const ownerFields = {
  id: true,
  profileImage: true,
  userName: true,
  firstName: true,
  lastName: true,
};

const getAllPosts = async (before: Date, limit: number) => {
  const posts = await postRepository.find({
    relations: ['owner', 'likes'],
    select: {
      owner: ownerFields,
      likes: ownerFields,
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

const updatePost = async ({ content, images, id }: UpdatePost) => {
  const post = await findPost(id);
  post.images = images;
  post.content = content;
  await postRepository.save(post);
  return post;
};

const likePost = async (userId: string, postId: string) => {
  const user = await userService.findUser(userId);

  const post = await findPost(postId);
  if (post?.likes.some((u) => u.id === userId)) {
    post.likes = post.likes.filter((u) => u.id !== userId);
  } else {
    post?.likes.push(user);
  }
  await postRepository.save(post);

  return post;
};

const deletePost = async (postId: string) => {
  const post = await findPost(postId);

  await postRepository.delete(post.id);
};

const findPost = async (id: string) => {
  const post = await postRepository.findOne({
    where: { id },
    relations: ['owner', 'likes'],
    select: {
      owner: ownerFields,
      likes: ownerFields,
    },
  });

  if (!post) throw new HttpError(401, 'Post not found');
  return post;
};

export default {
  createPost,
  getAllPosts,
  likePost,
  findPost,
  updatePost,
  deletePost,
};
