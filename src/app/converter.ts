
import * as fs from 'fs';
import * as sass from 'node-sass';
import Parser from './parser';

// Consts
const WRAPPER_CSS_ID = '#sass-export-id';

class Converter {
  private options: IOptions;

  constructor(options: IOptions) {
    this.options = options;
  }

  public getArray(): IDeclaration[] {
    let content = fs.readFileSync(this.options.filePath).toString();
    let parsedDeclarations = new Parser(content).parse();


    return parsedDeclarations.map((declaration) => {
      declaration.compiledValue = this.renderPropertyValue(content, declaration);
      return declaration;
    });

  }

  private renderPropertyValue(content: string, declaration: IDeclaration): string {
    let rendered = sass.renderSync({
      data: content + this.wrapCss(declaration),
      // includePaths: [this.options.filePath]
    });

    let wrappedRendered = String(rendered.css);

    return this.unWrapValue(wrappedRendered);
  }

  private wrapCss(cssDeclaration: IDeclaration): string {
    return `${WRAPPER_CSS_ID}.${cssDeclaration.variable}{content:"#{${cssDeclaration.value}}";}`;
  }

  private unWrapValue(wrappedContent: string): string {
    let regex = `${WRAPPER_CSS_ID}\\.(.+)\\s*\\{\\s*content:\\s*["'](.+)["']`;
    let matches = wrappedContent.match(regex);

    return matches[2].trim();
  }
}

export default Converter;
