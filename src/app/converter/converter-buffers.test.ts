
import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import { ConverterBuffer } from './converter-buffer';
import { Utils } from '../utils';

describe('buffers support', () => {

  it('should resolve from buffer', () => {
    let input = [];
    input.push(Buffer.from('$white: red;'));
    let converter = new ConverterBuffer(input);

    converter.getData().then((result) => {
      expect(result).that.is.an('object');
      expect(result.variables[0]).to.have.property('compiledValue');
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

    converter.getData().then((result) => {
      expect(result).that.is.an('object');
      expect(result.variables[0]).to.have.property('compiledValue');
      expect(result.variables).length.greaterThan(0);
    });
  });

  it('should return an array when the array option is specified', () => {
    let input = [];
    let options = { type: 'array' };

    input.push(Buffer.from('$white: red; $size: $white;'));

    let converter = new ConverterBuffer(input, options);

    converter.getData().then((result) => {
      expect(result).that.is.an('array');
      expect(result.length).to.be.equal(2);
      expect(result[1]).to.have.property('compiledValue');
      expect(result[1].compiledValue).equal('red');
    }).catch((err: Error) => {
      console.log('error', err.message);
    });
  });

});
