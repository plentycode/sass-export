import * as fs from 'fs';
import * as sass from 'node-sass';
import Parser from './parser';
import Utils from './utils';


/**
 * Converter class used for receiving the files and process them
 * @param {IOptions} options options parameters
 */
class Converter {
  private options: IOptions;

  constructor(options: IOptions) {
    this.options = options;
  }


  public getArray(): IDeclaration[] {
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
    let structuredDeclaration = new Parser(content).parseStructured();
    structuredDeclaration = this.compileStructure(structuredDeclaration);

    return structuredDeclaration;
  }


  private compileStructure(structuredDeclaration: IDeclaration): object {
    for (let group in structuredDeclaration) {
      if (structuredDeclaration.hasOwnProperty(group)) {
        let content = this.getContent();
        let compiledGroup = structuredDeclaration[group].map((declaration) => {
          declaration.compiledValue = this.renderPropertyValue(content, declaration);
          declaration.variable = `$${declaration.variable}`;
          return declaration;
        });
      }
    }

    return structuredDeclaration;
  }


  private renderPropertyValue(content: string, declaration: IDeclaration): string {
    let rendered = sass.renderSync({
      data: content + Utils.wrapCss(declaration),
      includePaths: this.options.includePaths,
      outputStyle: 'compact'
    });
    let wrappedRendered = String(rendered.css);

    return Utils.unWrapValue(wrappedRendered);
  }


  private getContent(): string {
    let contents = this.options.inputFiles.map((path) => fs.readFileSync(path).toString());

    return contents.join('\n');
  }
}


export default Converter;
