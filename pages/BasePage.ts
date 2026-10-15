import { Page, Locator, test, expect } from '@playwright/test';

/** Shared header elements and helpers used by every page */
export class BasePage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /** Wraps actions in a named report step, e.g. "CartPage › checkout" */
  protected step<T>(name: string, body: () => Promise<T>): Promise<T> {
    return test.step(`${this.constructor.name} › ${name}`, body, { box: true });
  }

  async expectOnPage(url: RegExp, title: string) {
    await expect(this.page).toHaveURL(url);
    await expect(this.title).toHaveText(title);
  }

  async expectCartCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }
}
