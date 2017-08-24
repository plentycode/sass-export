import * as fs from 'fs';
import * as sass from 'node-sass';
import Parser from './parser';
import Utils from './utils';

export class ConverterBuffer {
  private content: string;
  private options: IOptions;
  private inputBuffers: Buffer[];

  constructor(inputBuffers: Buffer[],  options?: IOptions) {
    this.inputBuffers = inputBuffers;
    this.options = options || {} as IOptions;
  }

  public getStructured(): Promise<any> {
    let structuredDeclaration = new Parser(this.getContent()).parseStructured();
    structuredDeclaration = this.compileStructure(structuredDeclaration);

    return Promise.resolve(structuredDeclaration);
  }


  private compileStructure(structuredDeclaration: IDeclaration): object {
    for (let group in structuredDeclaration) {
      if (structuredDeclaration.hasOwnProperty(group)) {
        let compiledGroup = structuredDeclaration[group].map((declaration) => {
          declaration.compiledValue = this.renderPropertyValue(this.getContent(), declaration);
          declaration.variable = `$${declaration.variable}`;
          return declaration;
        });
      }
    }

    return structuredDeclaration;
  }


  private renderPropertyValue(content: string, declaration: IDeclaration): string {
    let rendered = sass.renderSync({
      data: content + '\n' + Utils.wrapCss(declaration),
      includePaths: this.options.includePaths,
      outputStyle: 'compact'
    });
    let wrappedRendered = String(rendered.css);

    return Utils.unWrapValue(wrappedRendered);
  }
  private getContent(): string {
    let contents = this.inputBuffers.map((buffer: Buffer) => buffer.toString());

    return contents.join('\n');
  }
}
