import { AuthModulePage } from './app.po';

describe('auth-module App', function() {
  let page: AuthModulePage;

  beforeEach(() => {
    page = new AuthModulePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
