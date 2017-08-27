import * as fs from 'fs';
import * as sass from 'node-sass';
import * as glob from 'glob';
import { Parser } from '../parser';
import { Utils } from '../utils';

const LINE_BREAK = '\n';

/**
 * Converter class used for receiving the files and process them
 * @param {IOptions} options options parameters
 */
export class Converter {
  constructor( public options?: IOptions) {
    this.options = options || {} as IOptions;
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


  public compileStructure(structuredDeclaration: IDeclaration): object {
    for (let group in structuredDeclaration) {
      if (structuredDeclaration.hasOwnProperty(group)) {
        let content = this.getContent();
        let compiledGroup = structuredDeclaration[group].map((declaration) => {
          declaration.compiledValue = this.renderPropertyValue(content, declaration);
          declaration.variable = `$${declaration.variable}`;

          if (declaration.mapValue) {
            declaration.mapValue.map((mapDeclaration) => {
              mapDeclaration.compiledValue = this.renderPropertyValue(content, mapDeclaration);
              return mapDeclaration;
            });
          }

          return declaration;
        });
      }
    }
    return structuredDeclaration;
  }


  protected getContent(): string {
    let inputFiles = [];
    let inputs = [];

    if (!Array.isArray(this.options.inputFiles)) {
      inputFiles.push(this.options.inputFiles);
    } else {
      inputFiles = this.options.inputFiles;
    }

    inputFiles.forEach((path) => {
      let files = glob.sync(String(path));
      inputs.push(...files);
    });

    let contents = inputs.map((filePath) => fs.readFileSync(String(filePath)));

    return contents.join(LINE_BREAK);
  }


  private renderPropertyValue(content: string, declaration: IDeclaration): string {
    try {
      let rendered = sass.renderSync({
        data: content + LINE_BREAK + Utils.wrapCss(declaration),
        includePaths: this.options.includePaths,
        outputStyle: 'compact'
      });

      let wrappedRendered = String(rendered.css);

      return Utils.unWrapValue(wrappedRendered);

    } catch (err) {
      console.error(err);
      return ''; // if the property can't be render, then it should return an empty string
    }
  }
}
