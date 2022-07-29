import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const CreatePostSchema = z.object({
  content: z.string(),
});

export const UpdatePostSchema = CreatePostSchema.extend({
  links: z.preprocess((arg) => {
    if (!arg) return [];
    return arg;
  }, z.string().array()),
  id: z.string(),
});

export interface NewPost {
  content: string;
  owner: string;
  images: string[];
}
export interface UpdatePost {
  content: string;
  id: string;
  images: string[];
}

export const GetAllSchema = z.object({
  take: z.number().default(5),
  before: z.preprocess((arg) => {
    if (typeof arg === 'string' && dayjs(arg, 'MM/DD/YY H:mm:ss A Z').isValid())
      return new Date(arg);
    if (!arg) return new Date();
    return arg;
  }, z.date()),
});
