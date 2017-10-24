import { AppContactosPage } from './app.po';

describe('app-contactos App', () => {
  let page: AppContactosPage;

  beforeEach(() => {
    page = new AppContactosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
