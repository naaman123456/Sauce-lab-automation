import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Customer } from '../test-data/testData';
import { urls } from '../test-data/urls';

/** Checkout step one: Your Information */
export class CheckoutInfoPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async expectLoaded() {
    await this.step('verify checkout information page is displayed', async () => {
      await this.expectOnPage(urls.checkoutInfo, 'Checkout: Your Information');
    });
  }

  async fillDetails(customer: Customer) {
    await this.step(`fill details for ${customer.firstName} ${customer.lastName}`, async () => {
      await this.firstNameInput.fill(customer.firstName);
      await this.lastNameInput.fill(customer.lastName);
      await this.postalCodeInput.fill(customer.postalCode);
    });
  }

  async expectDetails(customer: Customer) {
    await this.step('verify details appear in the form', async () => {
      await expect(this.firstNameInput).toHaveValue(customer.firstName);
      await expect(this.lastNameInput).toHaveValue(customer.lastName);
      await expect(this.postalCodeInput).toHaveValue(customer.postalCode);
    });
  }

  async continue() {
    await this.step('click continue', async () => {
      await this.continueButton.click();
    });
  }
}
