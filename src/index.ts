import { Client, Dispatcher } from 'undici';
import { ZodError } from 'zod';
import { Parser } from './parser/parser';
import {
  createAccountSchema,
  createPageSchema,
  editAccountInfoSchema,
  editPageSchema,
  getAccountInfoSchema,
  getPageListSchema,
  getPageSchema,
  getViewsSchema,
  revokeAccessTokenSchema,
} from './types/schemas';
import type { PayloadMap, PayloadType, Methods } from './types/schemas';
import type { Account, Page, PageList, PageViews } from './types/response';

class TelegraphError extends Error {
  private info: any;
  constructor(message: string, info?: any) {
    super(message);

    this.info = info || null;
  }
}

const printErr = (error: typeof ZodError | Error) => {
  if (error instanceof ZodError) {
    const messages = error.errors
      .map((err) => `{${err.path.join('.')}} - ${err.message}`)
      .join('; ');

    const err = new TelegraphError(messages);

    console.log(err);
  } else {
    console.log(error);
  }
};

class Telegraph {
  private _api: string = 'https://api.telegra.ph';
  private _token?: string;
  private _request: InstanceType<typeof Client> = new Client(this._api);

  public createAccount: ({
    author_name,
    author_url,
    short_name,
  }: PayloadMap['createAccount']) => Promise<Partial<Account> | undefined>;

  public editAccountInfo: ({
    short_name,
    author_name,
    author_url,
  }: Omit<PayloadMap['editAccountInfo'], 'access_token'>) => Promise<
    Partial<Omit<Account, 'access_token'>> | undefined
  >;

  public getAccountInfo: ({
    fields,
  }: Omit<PayloadMap['getAccountInfo'], 'access_token'>) => Promise<
    Partial<Omit<Account, 'access_token'>> | undefined
  >;

  public revokeAccessToken: () => Promise<Partial<Account> | undefined>;

  public createPage: <T extends boolean>({
    author_name,
    author_url,
    content,
    return_content,
    title,
  }: Omit<PayloadMap['createPage'], 'access_token'>) => Promise<
    Partial<Page<T>>
  >;

  public editPage: <T extends boolean>({
    author_name,
    author_url,
    content,
    path,
    return_content,
    title,
  }: Omit<PayloadMap['editPage'], 'access_token'>) => Promise<
    Partial<Page<T>> | undefined
  >;

  public getPage: <T extends boolean>({
    path,
    return_content,
  }: PayloadMap['getPage']) => Promise<Partial<Page<T>> | undefined>;

  public getPageList: ({
    offset,
    limit,
  }: Omit<PayloadMap['getPageList'], 'access_token'>) => Promise<
    Partial<PageList> | undefined
  >;

  public getViews: ({
    day,
    hour,
    month,
    path,
    year,
  }: PayloadMap['getViews']) => Promise<Partial<PageViews> | undefined>;

  set token(token: string) {
    this._token = token;
  }

  get token(): string {
    if (!this._token) {
      throw new TelegraphError('Access token is not set.');
    }

    return this._token;
  }

  constructor(token?: string) {
    this._token = token;

    this.initializeMethods();
  }

  private initializeMethods() {
    this.createAccount = this.catchError(this._createAccount.bind(this));
    this.editAccountInfo = this.catchError(this._editAccountInfo.bind(this));
    this.getAccountInfo = this.catchError(this._getAccountInfo.bind(this));
    this.revokeAccessToken = this.catchError(
      this._revokeAccessToken.bind(this)
    );
    this.createPage = this.catchError(this._createPage.bind(this));
    this.editPage = this.catchError(this._editPage.bind(this));
    this.getPage = this.catchError(this._getPage.bind(this));
    this.getPageList = this.catchError(this._getPageList.bind(this));
    this.getViews = this.catchError(this._getViews.bind(this));
  }

  private catchError<T extends (...args: any[]) => Promise<any>>(method: T): T {
    return (async (
      ...args: Parameters<T>
    ): Promise<ReturnType<T> | undefined> => {
      return method(...args).catch((error: ZodError | Error) => {
        printErr(error);
        return undefined;
      });
    }) as T;
  }

  private async request<T extends Methods>(path: T, payload: PayloadType<T>) {
    return this._request
      .request({
        path: `/${path}`,
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(this.process);
  }

  private async process(response: Dispatcher.ResponseData) {
    const statusCode = response.statusCode;

    if (statusCode !== 200) {
      throw new TelegraphError('Error with status code: ' + statusCode, {
        statusCode,
      });
    }

    const resp = (await response.body.json()) as any;

    if ('ok' in resp && !resp.ok) {
      const error = resp.error;

      throw new TelegraphError('Error with reason: ' + error, {
        reason: error,
      });
    }

    return resp.result;
  }

  private async _createAccount({
    author_name,
    author_url,
    short_name,
  }: PayloadMap['createAccount']): Promise<Partial<Account> | undefined> {
    const payload: PayloadMap['createAccount'] = {
      author_name,
      author_url,
      short_name,
    };

    createAccountSchema.parse(payload);

    return this.request('createAccount', payload);
  }

  private async _editAccountInfo({
    author_name,
    author_url,
    short_name,
  }: PayloadMap['editAccountInfo']): Promise<
    Partial<Omit<Account, 'access_token'>> | undefined
  > {
    this.ensureToken();

    const payload: PayloadMap['editAccountInfo'] = {
      access_token: this._token,
      short_name,
      author_name,
      author_url,
    };

    editAccountInfoSchema.parse(payload);

    return this.request('editAccountInfo', payload);
  }

  private async _getAccountInfo({
    fields,
  }: PayloadMap['getAccountInfo']): Promise<
    Partial<Omit<Account, 'access_token'>> | undefined
  > {
    this.ensureToken();

    const payload: PayloadMap['getAccountInfo'] = {
      access_token: this._token,
      fields,
    };

    getAccountInfoSchema.parse(payload);

    return this.request('getAccountInfo', payload);
  }

  private async _revokeAccessToken(): Promise<Partial<Account> | undefined> {
    this.ensureToken();

    const payload: PayloadMap['revokeAccessToken'] = {
      access_token: this._token,
    };

    revokeAccessTokenSchema.parse(payload);

    return this.request('revokeAccessToken', payload);
  }

  private async _createPage<T extends boolean>({
    author_name,
    author_url,
    content,
    return_content,
    title,
  }: PayloadMap['createPage']): Promise<Partial<Page<T>> | undefined> {
    this.ensureToken();

    const payload: PayloadMap['createPage'] = {
      access_token: this._token,
      title,
      author_name,
      author_url,
      content,
      return_content,
    };

    createPageSchema.parse(payload);

    return this.request('createPage', payload);
  }

  private async _editPage<T extends boolean>({
    author_name,
    author_url,
    content,
    path,
    return_content,
    title,
  }: PayloadMap['editPage']): Promise<Partial<Page<T>> | undefined> {
    this.ensureToken();

    const payload: PayloadMap['editPage'] = {
      access_token: this._token,
      path,
      title,
      content,
      author_name,
      author_url,
      return_content,
    };

    editPageSchema.parse(payload);

    return this.request('editPage', payload);
  }

  private async _getPage<T extends boolean>({
    path,
    return_content,
  }: PayloadMap['getPage']): Promise<Partial<Page<T>> | undefined> {
    const payload: PayloadMap['getPage'] = {
      path,
      return_content,
    };

    getPageSchema.parse(payload);

    return this.request('getPage', payload);
  }

  private async _getPageList({
    limit,
    offset,
  }: PayloadMap['getPageList']): Promise<Partial<PageList> | undefined> {
    this.ensureToken();

    const payload: PayloadMap['getPageList'] = {
      access_token: this._token,
      offset,
      limit,
    };

    getPageListSchema.parse(payload);

    return this.request('getPageList', payload);
  }

  private async _getViews({
    day,
    hour,
    month,
    path,
    year,
  }: PayloadMap['getViews']): Promise<Partial<PageViews> | undefined> {
    const payload: PayloadMap['getViews'] = {
      path,
      year,
      month,
      day,
      hour,
    };

    getViewsSchema.parse(payload);

    return this.request('getViews', payload);
  }

  private ensureToken() {
    if (!this.token) {
      throw new TelegraphError('This feature requires an access token.');
    }
  }
}

export { Telegraph, Parser };
export type {
  Account,
  Page,
  PageList,
  PageViews,
  PayloadMap,
  PayloadType,
  TelegraphError,
};
