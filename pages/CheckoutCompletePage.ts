import { Page, Locator, TestInfo, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Customer, Product, checkout, orderTotals } from '../test-data/testData';
import { urls } from '../test-data/urls';
import { readPdf } from '../utils/pdfHelper';

/** Checkout complete: success message and PDF receipt */
export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly generatePdfButton: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.generatePdfButton = page.locator('[data-test="generate-pdf-order"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async expectSuccessMessage() {
    await this.step('verify success message', async () => {
      await this.expectOnPage(urls.checkoutComplete, 'Checkout: Complete!');
      await expect(this.completeHeader).toHaveText(checkout.successHeader);
      await expect(this.completeText).toHaveText(checkout.successText);
      await this.expectCartCount(0);
    });
  }

  /** Clicks Generate PDF, saves the file, attaches it to the report and returns its path */
  async generatePdf(testInfo: TestInfo): Promise<string> {
    return this.step('click Generate PDF and save the file', async () => {
      const downloadPromise = this.page.waitForEvent('download');
      await this.generatePdfButton.click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toMatch(/^swag-labs-order-.*\.pdf$/);

      const pdfPath = testInfo.outputPath(download.suggestedFilename());
      await download.saveAs(pdfPath);
      await testInfo.attach('order-receipt', { path: pdfPath, contentType: 'application/pdf' });
      return pdfPath;
    });
  }

  async expectPdfReceipt(pdfPath: string, customer: Customer, items: Product[]) {
    await this.step('verify PDF receipt content', async () => {
      const pdf = await readPdf(pdfPath);
      expect(pdf.pages).toBe(1);

      const totals = orderTotals(items);
      expect(pdf.text).toContain('Swag Labs');
      expect(pdf.text).toContain('Order Receipt');
      expect(pdf.text).toContain(`${customer.firstName} ${customer.lastName}`);
      expect(pdf.text).toContain(customer.postalCode);
      for (const product of items) {
        expect(pdf.text).toContain(product.name);
      }
      expect(pdf.text).toContain(`Item total ${totals.itemTotal}`);
      expect(pdf.text).toContain(`Tax ${totals.tax}`);
      expect(pdf.text).toContain(`Total ${totals.total}`);
      expect(pdf.text).toContain(checkout.successHeader);
    });
  }

  async backHome() {
    await this.step('click Back Home', async () => {
      await this.backHomeButton.click();
    });
  }
}
