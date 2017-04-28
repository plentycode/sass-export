 import Converter from './converter';

let sassJsConverter = (path) => {
  let converter = new Converter(path);
  return converter;
};

export default sassJsConverter;