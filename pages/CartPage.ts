import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product, formatPrice } from '../test-data/testData';
import { urls } from '../test-data/urls';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectItems(items: Product[]) {
    await this.step(`verify cart contains ${items.map(p => p.name).join(', ')}`, async () => {
      await this.expectOnPage(urls.cart, 'Your Cart');
      await expect(this.cartItems).toHaveCount(items.length);
      for (const product of items) {
        const row = this.cartItems.filter({ hasText: product.name });
        await expect(row.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
        await expect(row.locator('[data-test="inventory-item-price"]')).toHaveText(formatPrice(product.price));
        await expect(row.locator('[data-test="item-quantity"]')).toHaveText('1');
      }
    });
  }

  async checkout() {
    await this.step('click checkout', async () => {
      await this.checkoutButton.click();
    });
  }
}
