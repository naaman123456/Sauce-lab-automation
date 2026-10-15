import { loggedInTest as test } from '../fixtures/pages';
import { customers, products } from '../test-data/testData';

// Slow down each action so every step is easy to watch
test.use({ launchOptions: { slowMo: 1500 } });

const product = products.bikeLight;
const customer = customers.ibrahim;

test.describe('Sauce Demo - Add Cart & Checkout (Bike Light)', () => {
  test('add Sauce Labs Bike Light to cart, checkout and verify PDF order', async (
    { inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage },
    testInfo
  ) => {
    test.setTimeout(120_000);

    // Add to cart
    await inventoryPage.expectProductDisplayed(product);
    await inventoryPage.expectCartCount(0);
    await inventoryPage.addToCart(product);
    await inventoryPage.expectAddedToCart(product, 1);

    // Cart
    await inventoryPage.openCart();
    await cartPage.expectItems([product]);
    await cartPage.checkout();

    // Checkout: your information
    await checkoutInfoPage.expectLoaded();
    await checkoutInfoPage.fillDetails(customer);
    await checkoutInfoPage.expectDetails(customer);
    await checkoutInfoPage.continue();

    // Checkout: overview
    await checkoutOverviewPage.expectOrderSummary([product]);
    await checkoutOverviewPage.finish();

    // Checkout: complete + PDF receipt, then back to products
    await checkoutCompletePage.expectSuccessMessage();
    const pdfPath = await checkoutCompletePage.generatePdf(testInfo);
    await checkoutCompletePage.expectPdfReceipt(pdfPath, customer, [product]);
    await checkoutCompletePage.backHome();
    await inventoryPage.expectLoaded();
  });
});
