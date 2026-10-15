import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product, formatPrice } from '../test-data/testData';
import { urls } from '../test-data/urls';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productCard(product: Product): Locator {
    return this.page.locator('[data-test="inventory-item"]').filter({ hasText: product.name });
  }

  addToCartButton(product: Product): Locator {
    return this.page.locator(`[data-test="add-to-cart-${product.id}"]`);
  }

  removeButton(product: Product): Locator {
    return this.page.locator(`[data-test="remove-${product.id}"]`);
  }

  async expectLoaded() {
    await this.step('verify products page is displayed', async () => {
      await this.expectOnPage(urls.inventory, 'Products');
    });
  }

  async expectProductDisplayed(product: Product) {
    await this.step(`verify ${product.name} is displayed`, async () => {
      const card = this.productCard(product);
      await expect(card).toBeVisible();
      await expect(card.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
      await expect(card.locator('[data-test="inventory-item-price"]')).toHaveText(formatPrice(product.price));
      await expect(this.addToCartButton(product)).toBeVisible();
    });
  }

  async addToCart(product: Product) {
    await this.step(`add ${product.name} to cart`, async () => {
      await this.addToCartButton(product).click();
    });
  }

  async expectAddedToCart(product: Product, cartCount: number) {
    await this.step(`verify ${product.name} was added to cart`, async () => {
      await expect(this.removeButton(product)).toBeVisible();
      await expect(this.addToCartButton(product)).toHaveCount(0);
      await this.expectCartCount(cartCount);
    });
  }

  async openCart() {
    await this.step('open cart', async () => {
      await this.cartLink.click();
    });
  }
}
