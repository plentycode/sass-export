
import * as fs from 'fs';
import * as sass from 'node-sass';
import Parser from './parser';

class Converter {
  options: IOptions;

  constructor(options: IOptions) {
    this.options = options;

    this.readContent();

    this.compile();
  }

  private readContent(): void {
    let content = fs.readFileSync(this.options.filePath).toString();
    let parser = new Parser(content);
  }

  public compile(): void {
    let rendered = sass.renderSync({
      file: this.options.filePath
    });

    console.log(rendered.css);
  }
}

export default Converter;