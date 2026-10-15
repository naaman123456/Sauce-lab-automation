import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product, checkout, formatPrice, orderTotals } from '../test-data/testData';
import { urls } from '../test-data/urls';

/** Checkout step two: Overview */
export class CheckoutOverviewPage extends BasePage {
  readonly items: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('[data-test="inventory-item"]');
    this.paymentInfo = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async expectOrderSummary(items: Product[]) {
    await this.step('verify order overview', async () => {
      await this.expectOnPage(urls.checkoutOverview, 'Checkout: Overview');

      await expect(this.items).toHaveCount(items.length);
      for (const product of items) {
        const row = this.items.filter({ hasText: product.name });
        await expect(row.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
        await expect(row.locator('[data-test="inventory-item-price"]')).toHaveText(formatPrice(product.price));
        await expect(row.locator('[data-test="item-quantity"]')).toHaveText('1');
      }

      const totals = orderTotals(items);
      await expect(this.paymentInfo).toHaveText(checkout.paymentInfo);
      await expect(this.shippingInfo).toHaveText(checkout.shippingInfo);
      await expect(this.itemTotal).toHaveText(`Item total: ${totals.itemTotal}`);
      await expect(this.tax).toHaveText(`Tax: ${totals.tax}`);
      await expect(this.total).toHaveText(`Total: ${totals.total}`);
    });
  }

  async finish() {
    await this.step('click finish', async () => {
      await this.finishButton.click();
    });
  }
}
