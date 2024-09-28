import { parse } from '../util/util';
import { NodeElement, ParseMode } from '../types/node-element';

export class Parser {
  static parse(input: string, parseMode: ParseMode): (NodeElement | string)[] {
    return parse(input, parseMode);
  }
}
