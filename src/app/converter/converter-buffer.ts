import { Converter } from './converter';
import { Parser } from '../parser';
import { Utils } from '../utils';

const Types = {
  STRUCTURED: 'structured',
  ARRAY: 'array'
};

export class ConverterBuffer extends Converter {
  private inputBuffers: Buffer[];

  constructor(inputBuffers: Buffer[], options?: IOptions) {
    super(options);
    this.inputBuffers = inputBuffers;
  }

  public getData(): Promise<any> {
    if (this.options && this.options.type === Types.ARRAY) {
      return Promise.resolve(this.getArray());
    } else {
      return Promise.resolve(this.getStructured());
    }
  }


  public getContent(): string {
    let contents = this.inputBuffers.map((buffer: Buffer) => buffer.toString());
    return contents.join('\n');
  }
}
