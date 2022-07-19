import { z } from 'zod';

export const CreatePostSchema = z.object({
  content: z.string(),
});

export interface NewPost {
  content: string;
  owner: string;
  images: string[];
}
