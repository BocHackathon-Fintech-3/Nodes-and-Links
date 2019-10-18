import { getGreeting } from '../support/app.po';

describe('busipay', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to busipay!');
  });
});
