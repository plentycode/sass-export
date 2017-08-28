import * as path from 'path';
import { expect } from 'chai';
import { Converter } from './converter';
import { Utils } from '../utils';

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
      // brand-colors
      expect(structured['brand-colors'][0]).to.have.property('compiledValue');
      // darkens
      expect(structured.darkens[0]).to.have.property('compiledValue');
    });
  });

  describe('includePaths support', () => {

    it('should import variables from other files', () => {
      let opts = { inputFiles: [path.resolve('./test/scss/_with-import.scss')], includePaths: [] };
      opts.includePaths = [path.resolve('./test/scss/')];
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.globals[0]).to.have.property('compiledValue');
    });
  });

  describe('path patterns support', () => {
    it('should read a wildcard', () => {
      let opts = { inputFiles: path.resolve('./test/scss/patterns/*'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.globals[0]).to.have.property('compiledValue');
    });
  });

  describe('map support', () => {
    it('should work even if input files is not an array', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_maps.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.globals[0]).to.have.property('compiledValue');
    });

    it('should compile values inside a map', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_maps.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.globals[0]).to.have.property('compiledValue');
      expect(structured.globals[0]).to.have.property('mapValue');
      expect(structured.globals[0].mapValue[0]).to.have.property('compiledValue');
    });

    it('should compile values inside a map as array also', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_maps.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let result = converter.getArray();

      expect(result[0]).to.have.property('compiledValue');
      expect(result[0]).to.have.property('mapValue');
      expect(result[0].mapValue[0]).to.have.property('compiledValue');
    });

    it('should work with variables in quotes', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_maps.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.icons[0]).to.have.property('mapValue');
      expect(structured.icons[0].mapValue[0].variable).to.be.equal('glass');
      expect(structured.icons[0].mapValue[0].value).to.be.equal('value');
      expect(structured.icons[0].mapValue[0].compiledValue).to.be.equal('value');
    });
  });

  describe('mixins support', () => {
    it('should return a group for mixins', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_mixins.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured).to.have.property('mixins');
    });

    it('should return a name and a parameter list', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_mixins.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.mixins[0].name).to.be.equal('box');
      expect(structured.mixins[0].parameters).that.is.an('array');
      expect(structured.mixins[0].parameters[0]).to.be.equal('$p1');
      expect(structured.mixins[0].parameters[1]).to.be.equal('$p2');
    });

    it('should work for functions', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_mixins.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();
      expect(structured.mixins[1].parameters[0]).to.be.equal('$val');
    });

    it('should work for mixins with default values', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_mixins.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();
      expect(structured.mixins[2].parameters[0]).to.be.equal('$val: 10px');
      expect(structured.mixins[2].parameters[1]).to.be.equal('$p2: \'#COFF33\'');
    });

    it('should have an empty array if not parameter', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_mixins.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.mixins[3].parameters).to.be.empty;
    });

    it('should work with others groups', () => {
      let opts = { inputFiles:
          [
            path.resolve('./test/scss/_mixins.scss'),
            path.resolve('./test/scss/_annotations.scss'),
          ],
          includePaths: [] };

      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured).to.have.property('mixins');
      expect(structured).to.have.property('globals');
      expect(structured).to.have.property('fonts');
    });

  });

});
