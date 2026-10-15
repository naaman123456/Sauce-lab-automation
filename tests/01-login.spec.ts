import { test } from '../fixtures/pages';
import { users } from '../test-data/testData';

test.describe('Sauce Demo - Login', () => {
  test('successful login with standard_user', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });
});
