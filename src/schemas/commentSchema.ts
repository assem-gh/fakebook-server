import { z } from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string(),
  postId: z.string(),
});

export interface NewComment {
  content: string;
  postId: string;
  ownerId: string;
}
