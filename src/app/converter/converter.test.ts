import * as path from 'path';
import { expect } from 'chai';
import { Converter } from './converter';
import { Utils } from '../utils';

describe('Converter class', () => {
  let options = { inputFiles: [''], format: 'JSON' };

  it('should return an instance of Converter', () => {
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


  describe('JSON exported structure', () => {
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
      expect(results[0]).to.have.property('name');
      expect(results[0]).to.have.property('value');
      expect(results[0]).to.have.property('compiledValue');
    });

    it('should have the variable the same as the sass file', () => {
      expect(results[0].name).to.equal('$white');
      expect(results[0].value).to.equal('#fff');
      expect(results[0].compiledValue).to.equal('#fff');
    });

    it('should work for built in mixins', () => {
      let foundDeclaration = Utils.getDeclarationByName(results, '$scss-function');

      expect(foundDeclaration.value).to.equal('lighten(#123, 10%)');
      expect(foundDeclaration.compiledValue).to.equal('#1e3c59');
    });

    it('should work for values with spaces', () => {
      let foundDeclaration = Utils.getDeclarationByName(results, '$multiple-variables');

      expect(foundDeclaration.compiledValue).to.equal('52px solid red');
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

      // variables
      expect(structured.variables[0]).to.have.property('compiledValue');
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

      expect(structured.variables[0]).to.have.property('compiledValue');
    });
  });

  describe('path patterns support', () => {
    it('should read a wildcard', () => {
      let opts = { inputFiles: path.resolve('./test/scss/patterns/*'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.variables[0]).to.have.property('compiledValue');
    });
  });

  describe('function result support', () => {
    it('should return correct compiledValue when function is used', () => {
      let opts = { inputFiles: path.resolve('./test/scss/_functions.scss'), includePaths: [] };
      let converter = new Converter(opts);
      let structured = converter.getStructured();

      expect(structured.variables[1].compiledValue).to.be.equal('bootstrap/');
    })
  });

  describe('map support', () => {
    let opts = { inputFiles: path.resolve('./test/scss/_maps.scss'), includePaths: [] };
    let converter = new Converter(opts);
    let structured = converter.getStructured();

    it('should work even if input files is not an array', () => {
      expect(structured.variables[0]).to.have.property('compiledValue');
    });

    it('should compile values inside a map', () => {
      expect(structured.variables[0]).to.have.property('compiledValue');
      expect(structured.variables[0]).to.have.property('mapValue');
      expect(structured.variables[0].mapValue[0]).to.have.property('compiledValue');
    });

    it('should compile values inside a map as array also', () => {
      let result = converter.getArray();

      expect(result[0]).to.have.property('compiledValue');
      expect(result[0]).to.have.property('mapValue');
      expect(result[0].mapValue[0]).to.have.property('compiledValue');
    });

    it('should work with variables in quotes', () => {
      expect(structured.icons[0]).to.have.property('mapValue');
      expect(structured.icons[0].mapValue[0].name).to.be.equal('glass');
      expect(structured.icons[0].mapValue[0].value).to.be.equal('value');
      expect(structured.icons[0].mapValue[0].compiledValue).to.be.equal('value');
    });

    it('should work with map-get within maps', () => {
      let result = structured['map-get'][0];
      expect(result).to.have.property('mapValue');
      let map = result.mapValue;
      expect(map[0].name).to.be.equal('breakpoint');
      expect(map[0].value).to.be.equal('map-get($bps, \'mobile\')');
      expect(map[0].compiledValue).to.be.equal('320px');
      expect(map[1].name).to.be.equal('icon');
      expect(map[1].value).to.be.equal('map-get($icons, music)');
      expect(map[1].compiledValue).to.be.equal('value');
    });

    it('should allow function calls with multiple arguments in values', () => {
      let result = structured['funcs'][0];
      expect(result).to.have.property('mapValue');
      let map = result.mapValue;

      let expected = [
        { name: 'max', value: 'max(1px, 4px)', compiled: '4px' },
        { name: 'min', value: 'min(1px, 4px)', compiled: '1px' },
        { name: 'str-index', value: 'str-index("Helvetica Neue", "Neue")', compiled: '11' },
        { name: 'adjust-color', value: 'adjust-color(#d2e1dd, $red: -10, $blue: 10)', compiled: '#c8e1e7' },
        { name: 'rgba', value: 'rgba(255, 0, 0, .5)', compiled: 'rgba(255, 0, 0, 0.5)' },
        { name: 'darken', value: 'darken(#b37399, 20%)', compiled: '#7c4465' }
      ];

      expected.forEach(({name, value, compiled}, ix) => {
        expect(map[ix].name).to.be.equal(name);
        expect(map[ix].value).to.be.equal(value);
        expect(map[ix].compiledValue).to.be.equal(compiled);
      });
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
      expect(structured).to.have.property('variables');
      expect(structured).to.have.property('fonts');
    });

  });

});
