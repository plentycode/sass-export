import Converter from './app/converter';

let sassExporter = (options: IOptions) => {
  return new Converter(options);
};

export default sassExporter;
