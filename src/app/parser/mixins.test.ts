import { Mixins } from './mixins';

import { expect } from 'chai';

describe('Parser for mixins', () => {
  it('should have a public parse() method', () => {
    let parser = new Mixins('');
    expect(parser.parse).to.exist;
  });

  it('should parse an array', () => {
    let content = `@mixin respond-to($options) {
                    @content;
                   };
                   @mixin mixin-second() {}`;
    let parser = new Mixins(content);
    let mixins = parser.parse();

    expect(mixins).to.be.an('array');
    expect(mixins.length).to.equal(2);
  });

  it('should be an array of objects and parametes empty', () => {
    let content = `@mixin respond-to() {
                    @content;
                   };`;

    let parser = new Mixins(content);
    let mixins = parser.parse();

    expect(mixins[0]).to.have.property('name');
    expect(mixins[0]).to.have.property('parameters');
    expect(mixins[0].parameters).to.empty;
    expect(mixins[0].name).to.be.equal('respond-to');
  });

  it('should list the parameters', () => {
    let content = `@mixin fixes($option1, $option2, $option3) { };`;

    let parser = new Mixins(content);
    let mixins = parser.parse();

    expect(mixins[0]).to.have.property('name');
    expect(mixins[0]).to.have.property('parameters');
    expect(mixins[0].parameters.length).to.be.equal(3);
  });

  it('should work for parameters with default value', () => {
    let content = `
        @mixin module($color: grey, $duration: 0s, $border: null) {
            color: $color;
            transition: $duration;
            border: $border;
          }`;

    let parser = new Mixins(content);
    let mixins = parser.parse();

    expect(mixins[0].parameters.length).to.be.equal(3);
    expect(mixins[0].parameters[1]).to.be.equal('$duration: 0s');
  });

  it('should work for functions', () => {
    let content = `
        @function myFn($param1) { };
        @mixin z($p1, $p2) { };
        @mixin myMix2($p1, $p2) { };`;

    let parser = new Mixins(content);
    let mixins = parser.parse();

    expect(mixins.length).to.equal(3);
    expect(mixins[0].name).to.be.equal('myFn');
    expect(mixins[1].name).to.be.equal('z');
  });

});
