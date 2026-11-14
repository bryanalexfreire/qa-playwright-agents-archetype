import { BasePage } from './BasePage';

/** Example Page Object. Replace with the real screens of your product. */
export class HomePage extends BasePage {
  protected readonly path = '/';

  get mainNavigation() {
    return this.page.getByRole('navigation').first();
  }
}
