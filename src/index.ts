import { Converter, ConverterBuffer } from './app/converter';

let sassExporter = (options: IOptions) => {
  return new Converter(options);
};

let bufferExporter = (input: Buffer[], options: IOptions) => {
  let converter = new ConverterBuffer(input, options);
  return converter.getStructured();
};

module.exports = {
  exporter: sassExporter,
  buffer: bufferExporter
};
