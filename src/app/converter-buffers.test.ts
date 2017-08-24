
import { ConverterBuffer } from './converter-buffer';
import Utils from './utils';
import * as path from 'path';
import * as fs from 'fs';

import { expect } from 'chai';

describe('buffers support', () => {

  it('should resolve from buffer', () => {
    let input = [];
    input.push(new Buffer('$white: red;'));
    let converter = new ConverterBuffer(input);

    converter.getStructured().then((result) => {
      expect(result).that.is.an('object');
      expect(result.globals[0]).to.have.property('compiledValue');
    }).catch((err: Error) => {
      console.log('error', err.message);
    });
  });


  it('should work from a file buffer', () => {
    let input = [];
    let filePath = path.resolve('./test/scss/_colors.scss');
    let fileBuffer = fs.readFileSync(filePath);

    let filePath2 = path.resolve('./test/scss/_variables.scss');
    let fileBuffer2 = fs.readFileSync(filePath);

    input.push(fileBuffer);
    input.push(fileBuffer2);

    let converter = new ConverterBuffer(input);

    converter.getStructured().then((result) => {
      expect(result).that.is.an('object');
      expect(result.globals[0]).to.have.property('compiledValue');
      expect(result.globals).length.greaterThan(0);
    });
  });
});
