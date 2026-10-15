import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';

// Load environment settings (BASE_URL) from .env
if (fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    // Delay (ms) between each browser action so runs are easy to watch
    launchOptions: { slowMo: 1000 },
  },
  // Run tests one at a time so the order below is respected
  workers: 1,
  projects: [
    {
      name: 'login',
      testMatch: /01-login\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'add-cart-checkout',
      testMatch: /02-.*\.spec\.ts/,
      dependencies: ['login'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'add-cart-checkout-bike-light',
      testMatch: /add card checkout saucelabbike\.spec\.ts/,
      dependencies: ['login'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // API tests: no browser, only the `request` fixture
      name: 'api',
      testMatch: /api[\\/].*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://dummyjson.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
