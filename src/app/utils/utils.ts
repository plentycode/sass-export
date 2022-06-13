const WRAPPER_CSS_ID = '#sass-export-id';
const UNWRAPPER_PATTERN = `${WRAPPER_CSS_ID}\\.(.+)\\s*\\{\\s*content:\\s*["'](.+)["']`;


/**
 * Class for static utility functions
 * Usage: Utils.staticFunction
 */
export class Utils {

  public static getDeclarationByName(declarations: IDeclaration[] = [], name: string): IDeclaration {
    let filtered = declarations.filter((declaration) => declaration.name === name);

    return filtered[0];
  }


  public static wrapCss(cssDeclaration: IDeclaration, useInspect: boolean): string {
    if (useInspect) {
      return `${WRAPPER_CSS_ID}.${cssDeclaration.name}{content:"#{inspect(${cssDeclaration.value})}";}`;
    }
    return `${WRAPPER_CSS_ID}.${cssDeclaration.name}{content:"#{${cssDeclaration.value}}";}`;
  }

  public static removeDoubleQuotes(wrappedContent: string): string {
    wrappedContent = wrappedContent.replace(/"([^'"]+(?="'))"/, '$1');
    return wrappedContent;
  }

  public static unWrapValue(wrappedContent: string): string {
    wrappedContent = wrappedContent.replace(/\n/g, '');

    let matches = wrappedContent.match(UNWRAPPER_PATTERN);

    if (matches && matches.length > 2) {
      return matches[2].trim();
    } else {
      return '';
    }
  }
}
