import { z } from 'zod';
import { NodeElement } from './node-element';

type Methods =
  | 'createAccount'
  | 'editAccountInfo'
  | 'getAccountInfo'
  | 'revokeAccessToken'
  | 'createPage'
  | 'editPage'
  | 'getPage'
  | 'getPageList'
  | 'getViews';

type PayloadMap = {
  createAccount: z.infer<typeof createAccountSchema>;
  editAccountInfo: z.infer<typeof editAccountInfoSchema>;
  getAccountInfo: z.infer<typeof getAccountInfoSchema>;
  revokeAccessToken: z.infer<typeof revokeAccessTokenSchema>;
  createPage: z.infer<typeof createPageSchema>;
  editPage: z.infer<typeof editPageSchema>;
  getPage: z.infer<typeof getPageSchema>;
  getPageList: z.infer<typeof getPageListSchema>;
  getViews: z.infer<typeof getViewsSchema>;
};

type PayloadType<T extends Methods> = T extends keyof PayloadMap
  ? PayloadMap[T]
  : never;

const Content = z.custom<NodeElement[]>().refine((arr) => arr.length > 0, {
  message: 'Content cannot be empty.',
});

const createAccountSchema = z.object({
  short_name: z.string().min(1).max(32),
  author_name: z.string().min(0).max(128),
  author_url: z.string().min(0).max(512),
});

const editAccountInfoSchema = z.object({
  access_token: z.string(),
  short_name: z.string().min(1).max(32),
  author_name: z.string().min(0).max(128),
  author_url: z.string().min(0).max(512),
});

const getAccountInfoSchema = z.object({
  access_token: z.string(),
  fields: z.array(
    z
      .enum([
        'short_name',
        'author_name',
        'author_url',
        'auth_url',
        'page_count',
      ])
      .optional()
  ),
});

const revokeAccessTokenSchema = z.object({
  access_token: z.string(),
});

const createPageSchema = z.object({
  access_token: z.string(),
  title: z.string().min(1).max(256),
  author_name: z.string().min(0).max(128).optional(),
  author_url: z.string().min(0).max(512).optional(),
  content: Content,
  return_content: z.boolean().default(false).optional(),
});

const editPageSchema = z.object({
  access_token: z.string(),
  path: z.string(),
  title: z.string().min(1).max(256),
  content: Content,
  author_name: z.string().min(0).max(128).optional(),
  author_url: z.string().min(0).max(512).optional(),
  return_content: z.boolean().default(false).optional(),
});

const getPageSchema = z.object({
  path: z.string(),
  return_content: z.boolean().default(false).optional(),
});

const getPageListSchema = z.object({
  access_token: z.string(),
  offset: z.number().int().default(0).optional(),
  limit: z.number().int().min(0).max(200).default(50).optional(),
});

const getViewsSchema = z
  .object({
    path: z.string(),
    year: z.number().int().min(2000).max(2100).optional(),
    month: z.number().int().min(1).max(12).optional(),
    day: z.number().int().min(1).max(31).optional(),
    hour: z.number().int().min(0).max(24).optional(),
  })
  .refine((data) => !data.hour || data.day, {
    message: 'Day is required when hour is provided.',
    path: ['day'],
  })
  .refine((data) => !data.day || data.month, {
    message: 'Month is required when day is provided.',
    path: ['month'],
  })
  .refine((data) => !data.month || data.year, {
    message: 'Year is required when month is provided.',
    path: ['year'],
  });

export {
  createAccountSchema,
  createPageSchema,
  editAccountInfoSchema,
  editPageSchema,
  getAccountInfoSchema,
  getPageListSchema,
  getPageSchema,
  getViewsSchema,
  revokeAccessTokenSchema,
  PayloadMap,
  PayloadType,
  Methods,
};
