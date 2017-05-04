
import * as fs from 'fs';
import * as sass from 'node-sass';
import Parser from './parser';

const WRAPPER_CSS_ID = '#sass-export-id';

class Converter {
  private options: IOptions;

  constructor(options: IOptions) {
    this.options = options;
  }

  public getArray(): any[] {
    let content = this.getContent();
    let parsedDeclarations = new Parser(content).parse();

    return parsedDeclarations.map((declaration) => {
      declaration.compiledValue = this.renderPropertyValue(content, declaration);
      declaration.variable = `$${declaration.variable}`;
      return declaration;
    });

  }

  public getStructured(): any {
    let content = this.getContent();
    let parsedDeclarations = new Parser(content).parseStructured();
    this.compileValue(parsedDeclarations);

    return parsedDeclarations;
  }

  private compileValue(parsedDeclarations: any): object {
    for (let group in parsedDeclarations) {
      if (parsedDeclarations.hasOwnProperty(group)) {
        let content = this.getContent();
        let compiledGroup = parsedDeclarations[group].map((declaration) => {
          declaration.compiledValue = this.renderPropertyValue(content, declaration);
          declaration.variable = `$${declaration.variable}`;
          return declaration;
        });
      }
    }


    return parsedDeclarations;

  }

  private renderPropertyValue(content: string, declaration: IDeclaration): string {
    let rendered = sass.renderSync({
      data: content + this.wrapCss(declaration),
      // includePaths: [this.options.filePath]
    });

    let wrappedRendered = String(rendered.css);

    return this.unWrapValue(wrappedRendered);
  }

  private getContent(): string {
    let contents = this.options.inputFiles.map((path) => fs.readFileSync(path).toString());

    return contents.join('\n\n');
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
