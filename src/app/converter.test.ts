import Converter from './converter';
import Utils from './utils';
import * as path from 'path';

import { expect } from 'chai';


describe('Converter class', () => {
  let options = { inputFiles: [''], format: 'JSON' };

  it('should return an instance of Converer', () => {
    let converter = new Converter(options);
    expect(converter).to.be.instanceof(Converter);
  });

  it('should have a public toArray() method', () => {
    let converter = new Converter(options);
    expect(converter.getArray).to.exist;
  });

  it('should return an empty array if file is empty or invalid', () => {
    let opts = { inputFiles: [path.resolve('./test/scss/_empty-rules.scss')], format: 'JSON' };
    let converter = new Converter(opts);
    expect(converter.getArray()).that.is.an('array');
    expect(converter.getArray()).to.be.empty;
  });


  describe('JSON exported extructure', () => {
    let opts = { inputFiles: [path.resolve('./test/scss/_variables.scss')], format: 'JSON' };
    let converter = null;
    let results = null;

    // tslint:disable-next-line:only-arrow-functions
    before(function () {
      converter = new Converter(opts);
      results = converter.getArray();

    });

    it('should return a valid array', () => {
      expect(results).that.is.an('array');
      expect(results).to.not.be.empty;
    });

    it('should have the correct object structure', () => {
      expect(results[0]).to.have.property('variable');
      expect(results[0]).to.have.property('value');
      expect(results[0]).to.have.property('compiledValue');
    });

    it('should have the variable the same as the sass file', () => {
      expect(results[0].variable).to.equal('$white');
      expect(results[0].value).to.equal('#fff');
      expect(results[0].compiledValue).to.equal('#fff');
    });

    it('should work for built in mixins', () => {
      let foundDeclaration = Utils.getDeclarationByName(results, '$scss-function');

      expect(foundDeclaration.value).to.equal('lighten(#123, 10%)');
      expect(foundDeclaration.compiledValue).to.equal('#1e3c59');
    });
  });

  describe('Multiple input files', () => {
    let opts = { inputFiles: [], format: 'JSON' };
    let converter = null;
    let results = null;

    // tslint:disable-next-line:only-arrow-functions
    before(function () {
      opts.inputFiles.push(path.resolve('./test/scss/_colors.scss'));
      opts.inputFiles.push(path.resolve('./test/scss/_breakpoints.scss'));

      converter = new Converter(opts);
      results = converter.getArray();
    });

    it('should include variables form both files', () => {
      let foundFirst = Utils.getDeclarationByName(results, '$brand-solitude');
      expect(foundFirst.value).to.equal('#ebeff2');

      let foundSecond = Utils.getDeclarationByName(results, '$bp-desktop');
      expect(foundSecond.value).to.equal('1000px');
    });

  });


  describe('Structured Functionality', () => {

    it('should have a public getStructured() method', () => {
      let converter = new Converter(options);
      expect(converter.getStructured).to.exist;
    });

    it('should return an empty array if file is empty or invalid', () => {
      let opts = { inputFiles: [path.resolve('./test/scss/_empty-rules.scss')], format: 'JSON' };
      let converter = new Converter(opts);
      expect(converter.getStructured()).that.is.an('object');
      expect(converter.getStructured()).to.be.empty;
    });

    it('should compile values', () => {
      let opts = { inputFiles: [path.resolve('./test/scss/_colors.scss')], format: 'JSON' };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      // globals
      expect(structured.globals[0]).to.have.property('compiledValue');

    });

  });

});
