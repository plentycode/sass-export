import { Parser } from './parser';

const MIXIN_VALUES_REGEX = /@mixin ?((?!\d)[\w_-][\w\d_-]*)(\([^\)"]+.)?/gi;
const FUNC_VALUES_REGEX = /@function ?((?!\d)[\w_-][\w\d_-]*)(\([^\)"]+.)?/gi;

const MIXIN_DECLARATION_REGEX = '@mixin.[^\{]+|@function.[^\{]+';

export class Mixins {

  constructor(private rawContent: string) {

  }

  public parse(): any[] {
    let matches = this.extractDeclarations(this.rawContent);
    let declarations = [];

    matches.forEach((match) => {
      let mixins = this.parseSingle(match);
      let functions = this.parseSingle(match, true);

      if (mixins) { declarations.push(mixins); }
      if (functions) { declarations.push(functions); }
    });
    return declarations;
  }

  private extractDeclarations(content: string): [any] {
    let matches = content.match(new RegExp(MIXIN_DECLARATION_REGEX, 'gi'));

    if (!matches) {
      return [] as any;
    }

    return matches as any;
  }

  private parseSingle(declaration: string, checkFunctions = false): object {
    let regex = checkFunctions ? FUNC_VALUES_REGEX : MIXIN_VALUES_REGEX;
    let matches = (new RegExp(regex, 'gi')).exec(declaration);

    if (!matches) {
      return null;
    }

    let name = matches[1].trim();
    let parameters = [];

    if (matches.length > 2 && matches[2]) {
      let params = matches[2].split(',').map((param) => param.trim().replace(/[\(\)]/g, ''));
      parameters.push(...params);
    }

    return { name, parameters } as object;
  }
}
