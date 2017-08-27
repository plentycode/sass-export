import { expect } from 'chai';
import * as app from './index';

describe('main program', () => {

  it('it should have an exporter method', ( ) => {
    expect(app).to.have.property('exporter');
  });

  it('it should have a buffer method', ( ) => {
    expect(app).to.have.property('buffer');
  });
});
