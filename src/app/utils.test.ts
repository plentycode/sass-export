import Utils from './utils';
import { expect } from 'chai';

describe('Utils class', () => {

  let declarations = [
    // tslint:disable:object-literal-key-quotes
    { "variable": "$brand-blue-gray", "value": "#647b86", "compiledValue": "#647b86" },
    { "variable": "$brand-blue-gray-dark", "value": "#546E7A", "compiledValue": "#546E7A" },
    { "variable": "$brand-solitude", "value": "#ebeff2", "compiledValue": "#ebeff2" }
  ];

  it('should have a public helper getDeclaration', () => {
    expect(Utils.getDeclarationByName).to.exist;
  });

  it('should return undefined when no declaration is found', () => {
    let result = Utils.getDeclarationByName([], '$white');
    expect(result).to.be.undefined;
  });

  it('should return a valid object if it is found', () => {
    let result = Utils.getDeclarationByName(declarations, '$brand-blue-gray');

    expect(result).not.to.be.empty;
    expect(result.value).to.be.equal('#647b86');
  });

  it('should return undefined object if it is not found', () => {
    let result = Utils.getDeclarationByName(declarations, '$purple');
    expect(result).to.be.undefined;
  });

  it('should wrap a variable', () => {
    let declaration = { variable: 'var', value: '$the-value', compiledValue: '' };
    let expectedResult = '#sass-export-id.var{content:"#{$the-value}";}';
    let wrapped = Utils.wrapCss(declaration);

    expect(wrapped).to.be.equal(expectedResult);
  });

  it('should unwrap the css generated', () => {
    let compiledCss = '#sass-export-id.var{content:"#{$the-value}";}';
    let expectedResult = '#{$the-value}';
    let extracted = Utils.unWrapValue(compiledCss);

    expect(extracted).to.be.equal(expectedResult);
  });
});
