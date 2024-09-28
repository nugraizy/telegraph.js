import { NodeElement } from './node-element';

export type Account = {
  short_name: string;
  author_name: string;
  author_url: string;
  access_token: string;
  auth_url: string;
  page_count: number;
};

export type PageViews = {
  views: number;
};

export type Page<T extends boolean> = {
  path: string;
  url: string;
  title: string;
  description: string;
  author_name: string;
  author_url: string;
  image_url: string;
  views: number;
  can_edit: boolean;
} & (T extends true
  ? {
      content: NodeElement[];
    }
  : {});

export type PageList = {
  total_count: number;
  page: Page<false>[];
};
