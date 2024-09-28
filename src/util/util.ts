import { marked } from 'marked';
import sanitize, { IOptions } from 'sanitize-html';
import { parse as parse5 } from 'parse5';
import type {
  Document,
  Element,
  Node,
  TextNode,
} from 'parse5/dist/tree-adapters/default';
import {
  ALLOWED_TAGS,
  NodeElement,
  ParseMode,
  Tag,
} from '../types/node-element';

const HTML_SANITIZER_OPTIONS: IOptions = {
  transformTags: {
    h1: 'h3',
    h2: 'h4',
    h5: 'h3',
    h6: 'h4',
    del: 's',
  },
  allowedTags: [...ALLOWED_TAGS],
  allowedAttributes: {
    a: ['href'],
    img: ['src'],
    iframe: ['src'],
    video: ['src'],
  },
};

const IFRAME_SRC_REGEX: Record<string, RegExp> = {
  twitter:
    /(https?:\/\/)?(www.)?twitter.com\/([a-z,A-Z]*\/)*status\/([0-9])[?]?.*/,
  telegram:
    /^(https?):\/\/(t\.me|telegram\.me|telegram\.dog)\/([a-zA-Z0-9_]+)\/(\d+)/,
  vimeo:
    /(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/,
  youtube:
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]+).*/,
};

const markdownToHtml = (content: string): string =>
  marked.parse(content, { async: false });

const parseHtmlToDOM = (html: string): Document => parse5(html.trim());

const transformToIframeURL = (url: string): string => {
  for (const site in IFRAME_SRC_REGEX) {
    if (!IFRAME_SRC_REGEX[site].test(url)) {
      continue;
    }

    return `/embed/${site}?url=${encodeURIComponent(url)}`;
  }

  return url;
};

const domToNode = (element: Node) => {
  if (element.nodeName == '#text') {
    const parent = (element as TextNode).parentNode;
    return parent && parent.nodeName === 'p'
      ? (element as TextNode).value.replace('\n', ' ')
      : (element as TextNode).value;
  }

  const tag = (element as Element).nodeName.toLowerCase() as Tag;

  const nodeElement: NodeElement = { tag };

  if (tag === 'code' && (element as Element).parentNode?.nodeName === 'pre') {
    nodeElement.tag = 'pre';
  }

  const href = (element as Element).attrs.find((attr) => attr.name === 'href');

  if (href != null) {
    nodeElement.attrs = { href: href.value };
  }

  const attrs = (element as Element).attrs;
  for (const attr of attrs) {
    if (attr.name === 'href') {
      nodeElement.attrs = {
        ...nodeElement.attrs,
      };
    }
    if (attr.name === 'src') {
      nodeElement.attrs ??= {};
      nodeElement.attrs.src =
        tag === 'iframe' ? transformToIframeURL(attr.value) : attr.value;
    }
  }

  if ((element as Element).childNodes.length) {
    nodeElement.children = [];
    for (const childElement of (element as Element).childNodes) {
      const childNode = domToNode(childElement);
      if (childNode && childNode !== '\n') {
        nodeElement.children.push(childNode);
      }
    }
  }

  return nodeElement;
};

export const parse = (content: string, parseMode: ParseMode) => {
  const mode = parseMode.toLowerCase();

  content = content.trim();
  const html = mode === 'html' ? content : markdownToHtml(content);
  const sanitized = sanitize(html, HTML_SANITIZER_OPTIONS);
  const dom = parseHtmlToDOM(sanitized);

  if (!dom || !dom.childNodes.length) {
    throw new Error('Failed to parse HTML to DOM');
  }

  const node = domToNode(dom.childNodes[0]);

  if (!node || typeof node === 'string') {
    throw new Error('Empty node content');
  }

  return node.children || [];
};
