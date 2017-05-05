const WRAPPER_CSS_ID = '#sass-export-id';
const UNWRAPPER_PATTERN = `${WRAPPER_CSS_ID}\\.(.+)\\s*\\{\\s*content:\\s*["'](.+)["']`;


/**
 * Class for static utility functions
 * Usage: Utils.staticFunction
 */
class Utils {

  public static getDeclarationByName(declarations: IDeclaration[] = [], name: string): IDeclaration {
    let filtered = declarations.filter((declaration) => declaration.variable === name);

    return filtered[0];
  }


  public static wrapCss(cssDeclaration: IDeclaration): string {
    return `${WRAPPER_CSS_ID}.${cssDeclaration.variable}{content:"#{${cssDeclaration.value}}";}`;
  }


  public static unWrapValue(wrappedContent: string): string {
    wrappedContent = wrappedContent.replace(/\s/g, '');

    let matches = wrappedContent.match(UNWRAPPER_PATTERN);

    if (matches && matches.length > 2) {
      return matches[2].trim();
    } else {
      return '';
    }
  }
}

export default Utils;
