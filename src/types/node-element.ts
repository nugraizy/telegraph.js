export const PARSE_MODES = ['html', 'markdown'] as const;

export const ALLOWED_TAGS = [
  'a',
  'aside',
  'b',
  'blockquote',
  'br',
  'code',
  'em',
  'figcaption',
  'figure',
  'h3',
  'h4',
  'hr',
  'i',
  'iframe',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'strong',
  'u',
  'ul',
  'video',
] as const;

export type ParseMode = (typeof PARSE_MODES)[number];

export type Tag = (typeof ALLOWED_TAGS)[number];

export type NodeElement = {
  tag: Tag;
  attrs?: {
    href?: string;
    src?: string;
  };
  children?: (NodeElement | string)[];
};
