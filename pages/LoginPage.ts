import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { urls } from '../test-data/urls';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.step('open login page', async () => {
      await this.page.goto(urls.login);
      await expect(this.loginButton).toBeVisible();
    });
  }

  async login(username: string, password: string) {
    await this.step(`login as ${username}`, async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    });
  }
}
