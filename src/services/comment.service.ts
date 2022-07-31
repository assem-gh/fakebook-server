import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment.entity';
import { NewComment, UpdateComment } from '../schemas/commentSchema';
import { HttpError } from '../utils/HttpError';
import postService, { ownerFields } from './post.service';
import userService from './user.service';

const commentRepository = AppDataSource.getRepository(Comment);

const findComment = async (id: string) => {
  const comment = await commentRepository.findOne({
    where: { id },
    relations: ['owner'],
    select: {
      owner: ownerFields,
    },
  });
  if (!comment) throw new HttpError(401, 'comment not found');
  return comment;
};
const getPostComments = async (postId: string) => {
  const comments = await commentRepository.find({
    where: { postId },
    relations: ['owner'],
    select: {
      owner: ownerFields,
    },
  });

  return comments;
};

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
  newComment.postId = post.id;
  const comment = await commentRepository.save(newComment);

  return comment;
};

const deleteComment = async (commentId: string) => {
  const comment = await findComment(commentId);
  await commentRepository.delete(commentId);
};

const updateComment = async ({ commentId, content }: UpdateComment) => {
  const comment = await findComment(commentId);
  comment.content = content;
  await commentRepository.save(comment);

  return comment;
};

export default { getPostComments, createComment, deleteComment, updateComment };
