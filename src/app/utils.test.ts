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
});
