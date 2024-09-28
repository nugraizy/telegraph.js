# Telegraph

## Overview

The [Telegra.ph API](https://telegra.ph/api) wrapper made in Typescript. Simplifies creating and managing accounts, pages, and monitor the page stats on Telegraph. It uses schema validation using `zod`.

## Key Features:

- **Account Management**: Create, edit, and retrieve account info.
- **Page Management**: Create, edit, and retrieve pages.
- **Views**: Track page views.

## Table of Contents

1. [Instalation](#instalation)
2. [Usage](#usage)
   - [Client Setup](#client-setup)
   - [Creating an Account](#creating-an-account)
   - [Editing Account Info](#editing-account-info)
   - [Get Account Info](#get-account-info)
   - [Revoking Access Token](#revoke-access-token)
   - [Creating a Page](#creating-a-page)
   - [Creating a Page using Markdown](#creating-a-page-using-markdown)
   - [Editing a Page](#editing-a-page)
   - [Editing a Page using Markdown](#editing-a-page-using-markdown)
   - [Retrieving a Page](#retrieving-a-page)
   - [Tracking Page Views](#tracking-page-views)
3. [API Referenece](#api-reference)
   - [Constructor](#constructor)
   - [Methods](#methods)
     - [createAccount](#createaccount)
     - [editAccountInfo](#editaccountinfo)
     - [getAccountInfo](#getaccountinfo)
     - [revokeAccessToken](#revok)
     - [createPage](#createaccount)
     - [editPage](#editpage)
     - [getPage](#getpage)
     - [getPageList](#getpagelist)
     - [getViews](#getviews)

## Instalation

```bash
npm install telegraph.js
```

or

```bash
yarn add telegraph.js
```

## Usage

### Client Setup

Before using any of the API methods, you need to create an instance of the `Telegraph` class and set the access token.

```js
import { Telegraph } from 'telegraph.js';

const telegraph = new Telegraph();
```

### Creating an Account

```js
const acount = await telegraph.createAccount({
  shortname: 'nugra',
  author_name: 'nugraizy',
  author_url: 'https://github.com/ngraizy',
});
```

### Editing Account Info

```js
const updatedAccount = await telegraph.updateAccount({
  shortname: 'nugra',
  author_name: 'nugraizy',
  author_url: 'https://github.com/ngraizy',
});
```

### Get Account Info

```js
const accountInfo = await telegraph.getAccountInfo({
  fields: ['author_name', 'author_url', 'page_count', 'short_name', 'auth_url'],
});
```

### Revoke Access Token

```js
const account = await telegraph.revokeAccessToken();
```

### Creating a Page

```js
const page = await telegraph.createPage({
  title: 'My first Page',
  author_name: 'nugraizy',
  author_url: 'https://github.com/ngraizy',
  content: [
    {
      tag: 'p',
      children: ['This is a sample page.'],
      tag: 'p',
      attrs: { href: 'https://github.com/nugraizy' },
      children: ['Visit my profile!'],
    },
  ],
  return_content: false,
});
```

### Creating a Page using Markdown

```js
import { Parser } from 'telegraph.js';

const content = Parser.parse(`This is a sample page.

[Visit my profile!](https://github.com/nugraizy)`);

const page = await telegraph.createPage({
  title: 'My first Page',
  author_name: 'nugraizy',
  author_url: 'https://github.com/ngraizy',
  content: content,
  return_content: false,
});
```

### Editing a Page

```js
const updatedPage = await telegraph.editPage({
  author_name: 'nugraizy',
  author_url: 'https://authorurl.com',
  path: 'my-first-page', // usually the path has date in it.
  title: 'Updated Title',
  content: [{ tag: 'p', children: ['Updated content.'] }],
  return_content: false,
});
```

### Editing a Page using Markdown

```js
import { Parser } from 'telegraph.js';

const content = Parser.parse(`Updated content.

[Visit my profile!](https://github.com/nugraizy)`);

const updatedPage = await telegraph.editPage({
  author_name: 'nugraizy',
  author_url: 'https://authorurl.com',
  path: 'my-first-page', // usually the path has date in it.
  title: 'Updated Title',
  content: content,
  return_content: false,
});
```

### Retrieving a Page

```js
const page = await telegraph.getPage({
  path: 'my-first-page', // usually the path has date in it.
  return_content: true,
});
```

### Tracking Page Views

```js
const page = await telegraph.getViews({
  path: 'my-first-page', // usually the path has date in it.
});
```

## API Reference

### Constructor

```ts
new Telegraph(token?: string);
```

- `token`: _(optional)_ — The access token required for making requests to the [Telegra.ph](https://telegra.ph/api) API

### Methods

## createAccount

```ts
createAccount({ author_name, short_name, author_url });
```

Creates a new Telegraph account.

- **Parameters**:
  - `author_name`: _(string)_ — The author's name (0-128 characters).
  - `short_name`: _(string)_ — The account's short name (1-32 characters).
  - `author_url`: _(string)_ — The author's URL (0-512 characters).
- **Returns**: [`Promise<Partial<Account> | undefined>`](./src/types/index.ts#L132)

## editAccountInfo

```ts
editAccountInfo({ short_name, author_name, author_url });
```

Edits an existing account.

- **Parameters**:
  - `short_name`: _(string)_ — The account's short name.
  - `author_name`: _(string)_ — The author’s name.
  - `author_url`: _(string)_ — The author’s URL.
- **Returns**: [`Promise<Partial<Omit<Account, 'access_token'>> | undefined>`](./src/types/index.ts#L132)

## getAccountInfo

```ts
getAccountInfo({ fields });
```

Retrieves account information.

- **Parameters**:
  - `fields`: _(string[] | ['short_name', 'author_name', 'author_url', 'auth_url', 'page_count'](./src/types/index.ts#L66))_ — List of fields to return (optional).
- **Returns**: [`Promise<Partial<Omit<Account, 'access_token'>> | undefined>`](./src/types/index.ts#L132)

## revokeAccessToken

```ts
revokeAccessToken();
```

Revoke Current Access Token.

- **Returns**: [`Promise<Partial<Account> | undefined>`](./src/types/index.ts#L132)

## createPage

```ts
createPage({ title, author_name, author_url, content, return_content });
```

Creates a new page.

- **Parameters**:
  - `title`: _(string)_ — The title of the page (1-256 characters).
  - `author_name`: _(string)_ — The author’s name.
  - `author_url`: _(string)_ — The author’s URL.
  - `content`: _(NodeElement[])_ — The content of the page.
  - `return_content`: _(boolean)_ — Whether to return the content in the response.
- **Returns**: [`Promise<Partial<Page<T>> | undefined>`](./src/types/index.ts#L145)

## editPage

```ts
editPage({ path, title, content, author_name, author_url, return_content });
```

Edits an existing page.

- **Parameters**:
  - `path`: _(string)_ — The path to the page.
  - `title`: _(string)_ — The new title.
  - `content`: _([NodeElement[]](./src/types/index.ts#L36))_ — The new content.
  - `author_name`: _(string)_ — The author’s name.
  - `author_url`: _(string)_ — The author’s URL.
  - `return_content`: _(boolean)_ — Whether to return the content in the response.
- **Returns**: [`Promise<Partial<Page<T>> | undefined>`](./src/types/index.ts#L145)

## getPage

```ts
getPage({ path, return_content });
```

Retrieves a specific page.

- **Parameters**:
  - `path`: _(string)_ — The path to the page.
  - `return_content`: _(boolean)_ — Whether to return the content in the response.
- **Returns**: [`Promise<Partial<Page<T>> | undefined>`](./src/types/index.ts#L145)

## getPageList

```ts
getPageList({ offset, limit });
```

Retrieves a list of pages.

- **Parameters**:
  - `offset`: _(number)_ — Pagination offset (default 0).
  - `limit`: _(number)_ — Number of pages to retrieve (default 50).
- **Returns**: [`Promise<Partial<PageList> | undefined>`](./src/types/index.ts#L161)

## getViews

```ts
getViews({ path, year, month, day, hour });
```

Retrieves view statistics for a page.

- **Parameters**:
  - `path`: _(string)_ — The path to the page.
  - `year`: _(number)_ — Year filter (optional).
  - `month`: _(number)_ — Month filter (optional).
  - `day`: _(number)_ — Day filter (optional).
  - `hour`: _(number)_ — Hour filter (optional).
- **Returns**: [`Promise<Partial<PageViews> | undefined>`](./src/types/index.ts#L141)
