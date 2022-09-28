import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import fns from '../utils/functions';

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
  limit: z.preprocess((arg) => {
    return fns.toNumber(arg) || arg;
  }, z.number().default(5)),

  before: z.preprocess((arg) => {
    if (typeof arg === 'string' && dayjs(arg, 'MM/DD/YY H:mm:ss A Z').isValid())
      return new Date(arg);
    return arg;
  }, z.date().optional()),

  offset: z.preprocess(
    (arg) => (arg || arg === '0' ? fns.toNumber(arg) : arg),
    z.number().default(10).optional()
  ),

  group: z.enum(['feeds', 'saved', 'liked', 'owned']),
});

export const GetUserPostsSchema = z.object({
  limit: z.preprocess((arg) => {
    return fns.toNumber(arg) || arg;
  }, z.number().default(10).optional()),

  offset: z.preprocess(
    (arg) => (arg || arg === '0' ? fns.toNumber(arg) : arg),
    z.number().default(0).optional()
  ),

  group: z.enum(['saved', 'liked', 'owned', 'initial']),
});

export type GetUserPostsArgs = z.infer<typeof GetUserPostsSchema> & {
  userId: string;
};
