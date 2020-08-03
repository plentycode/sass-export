import * as fs from 'fs';
import * as sass from 'node-sass';
import * as glob from 'glob';
import { Parser, Mixins } from '../parser';
import { Utils } from '../utils';

const LINE_BREAK = '\n';

/**
 * Converter class used for receiving the files and process them
 * @param {IOptions} options options parameters
 */
export class Converter {

  constructor(public options?: IOptions) {
    this.options = options || {} as IOptions;
  }

  public getArray(): IDeclaration[] {
    let content = this.getContent();
    let parsedDeclarations = new Parser(content).parse();

    return parsedDeclarations.map((declaration) => {
      declaration.compiledValue = this.renderPropertyValue(content, declaration);
      declaration.name = `$${declaration.name}`;

      if (declaration.mapValue) {
        declaration.mapValue.map((mapDeclaration) => {
          mapDeclaration.compiledValue = this.renderPropertyValue(content, mapDeclaration);
          return mapDeclaration;
        });
      }
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
    const groups = Object.keys(structuredDeclaration);

    groups.forEach((group) => {
      let content = this.getContent();

      let compiledGroup = structuredDeclaration[group].map((declaration) => {
        declaration.compiledValue = this.renderPropertyValue(content, declaration);
        declaration.name = `$${declaration.name}`;

        if (declaration.mapValue) {
          declaration.mapValue.map((mapDeclaration) => {
            mapDeclaration.compiledValue = this.renderPropertyValue(content, mapDeclaration);
            return mapDeclaration;
          });
        }

        return declaration;
      });
    });

    return this.checkForMixins(structuredDeclaration);
  }


  public getContent(): string {
    return [].concat(this.options.inputFiles)
            .reduce((acc, val) => acc.concat(glob.sync(String(val))), [])
            .map(filePath => fs.readFileSync(String(filePath)))
            .join(LINE_BREAK)
            .replace(/\/\*[\w\W\r\n]*?\*\/|\/\/.*/g, '');
  }

  private checkForMixins(structuredDeclaration: object) {
    const mixinsGroup = 'mixins';
    const parsedMixins = new Mixins(this.getContent()).parse();

    if (parsedMixins && parsedMixins.length) {
      structuredDeclaration[mixinsGroup] = parsedMixins;
    }

    return structuredDeclaration;
  }


  private renderPropertyValue(content: string, declaration: IDeclaration): string {
    let wrappedRendered = ''; //if the property can't be rendered, then it should return an empty string

    try {
      const rendered = sass.renderSync({
        data: content + LINE_BREAK + Utils.wrapCss(declaration),
        includePaths: this.options.includePaths,
        outputStyle: 'compact'
      });

      wrappedRendered = Utils.unWrapValue(String(rendered.css));
    } catch (err) {
      console.error(err);
    }

    return wrappedRendered;
  }
}
