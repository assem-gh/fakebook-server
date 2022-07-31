import { z } from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string(),
  postId: z.string(),
});

export const UpdateCommentSchema = z.object({
  content: z.string(),
});

export interface NewComment {
  content: string;
  postId: string;
  ownerId: string;
}

export interface UpdateComment {
  commentId: string;
  content: string;
}
