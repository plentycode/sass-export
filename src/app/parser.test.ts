import Parser from './parser';
import Utils from './utils';
import { expect } from 'chai';

describe('Parser class', () => {

  it('should return an instance of Parser', () => {
    let parser = new Parser('');
    expect(parser).to.be.instanceof(Parser);
  });

  it('should have a public parse() method', () => {
    let parser = new Parser('');
    expect(parser.parse).to.exist;
  });

  it('should return an empty array when content is empty', () => {
    let emptyParser = new Parser('');
    expect(emptyParser.parse()).that.is.an('array');
    expect(emptyParser.parse()).to.be.empty;
  });

  it('should return a array with declarations', () => {
    let rawContent = '$slate-dark: #4f6f7b;';
    let validParser = new Parser(rawContent);

    expect(validParser.parse()).that.is.an('array');
    expect(validParser.parse()).to.have.lengthOf(1);
    expect(validParser.parse()[0].variable).to.be.equal('slate-dark');
    expect(validParser.parse()[0].value).to.be.equal('#4f6f7b');
  });

  it('should ignore unwell formatted declarations', () => {
    let rawContent = `$slate-dark #4f6f7b;
                      not-a-property: red`;
    let parser = new Parser(rawContent);

    expect(parser.parse()).that.is.an('array');
    expect(parser.parse()).to.be.empty;
  });

  describe('parseStructured Validations', () => {

    it('should be an empty object if content is empty', () => {
      let content = `$invalid,`;
      let parser = new Parser(content);
      let structured = parser.parseStructured();

      expect(structured).to.be.an('object');
      expect(structured).to.be.empty;
    });

    it('should be globals property', () => {
      let content = `$black: #000;
                     $white: #fff;`;
      let parser = new Parser(content);
      let structured = parser.parseStructured();

      expect(structured).to.be.an('object');
      expect(structured).to.have.property('globals');
      expect(structured.globals.length).be.equal(2);
    });

    it('should create a property if a section is present', () => {
      let content = `$black: #000;
                     $white: #fff;
                     //@sass-export-section="theme-colors"
                        $brand-gray-light: #eceff1;
                        $brand-gray-medium: #d6d6d6;
                        $brand-gray: #b0bec5;`;
      let parser = new Parser(content);
      let structured = parser.parseStructured();

      expect(structured).to.have.property('theme-colors');
      expect(structured.globals.length).be.equal(2);
      expect(structured['theme-colors'].length).be.equal(3);
      expect(structured['theme-colors'][1].variable).to.be.equal('brand-gray-medium');
    });

    it('should group in globals if end-section is present', () => {
      let content = `$black: #000;
                     $white: #fff;
                     //@sass-export-section="light"
                        $brand-gray-light: #eceff1;
                     //@end-sass-export-section
                    $brand-gray-medium: #d6d6d6;
                    $brand-gray: #b0bec5;`;
      let parser = new Parser(content);
      let structured = parser.parseStructured();

      expect(structured).to.have.property('light');
      expect(structured.globals.length).be.equal(4);
      expect(structured.light.length).be.equal(1);
      expect(structured.light[0].variable).be.equal('brand-gray-light');
    });

    it('should ignore the section if the name is invalid', () => {
      let content = `
                      //@sass-export-section=""
                        $brand-gray: #b0bec5;
                      //@sass-export-section
                        $brand-gray: #b0bec5;
                    `;

      let parser = new Parser(content);
      let structured = parser.parseStructured();
      expect(structured.globals.length).be.equal(2);
    });

    it('should allow JSON friendly names only for section name', () => {
      let content = `
                      //@sass-export-section="valid_-["]"
                        $brand-gray: #b0bec5;
                    `;

      let parser = new Parser(content);
      let structured = parser.parseStructured();

      expect(structured).to.have.property('valid_-[]');
    });

    it('should group variables in the same section even if they are not continue', () => {
      let content = `
                      //@sass-export-section="first"
                        $brand-gray: #b0bec5;
                        $brand-gray-2: #b0bec5;

                      //@sass-export-section="second"
                        $brand-gray: #b0bec5;

                      //@sass-export-section="first"
                        $brand-gray-3: #b0bec5;
                    `;

      let parser = new Parser(content);
      let structured = parser.parseStructured();

      expect(structured.first.length).be.equal(3);
      expect(structured.first[2].variable).be.equal('brand-gray-3');
    });
  });
});
