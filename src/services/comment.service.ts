import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment.entity';
import { NewComment } from '../schemas/commentSchema';
import postService from './post.service';
import userService from './user.service';

const commentRepository = AppDataSource.getRepository(Comment);

const createComment = async ({ content, postId, ownerId }: NewComment) => {
  const post = await postService.findPost(postId);
  const owner = await userService.findUser(ownerId);

  const newComment = commentRepository.create({
    content: content,
  });

  newComment.owner = {
    id: owner.id,
    profileImage: owner.profileImage,
    userName: owner.userName,
  } as any;
  newComment.post = post.id as any;
  const comment = await commentRepository.save(newComment);

  return comment;
};

export default { createComment };
