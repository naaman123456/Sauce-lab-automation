import { test, expect } from '@playwright/test';
import { existingProductId, missingProductId, newProduct } from '../../test-data/apiData';

test.describe('API - Products', () => {
  test('GET /products/:id returns the product', async ({ request }) => {
    const response = await request.get(`/products/${existingProductId}`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const product = await response.json();
    expect(product.id).toBe(existingProductId);
    expect(typeof product.title).toBe('string');
    expect(product.title.length).toBeGreaterThan(0);
    expect(product.price).toBeGreaterThan(0);
  });

  test('GET /products returns a paginated list', async ({ request }) => {
    const response = await request.get('/products', {
      params: { limit: 5, skip: 0, select: 'title,price' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.limit).toBe(5);
    expect(body.skip).toBe(0);
    expect(body.total).toBeGreaterThanOrEqual(5);
    expect(body.products).toHaveLength(5);
    for (const product of body.products) {
      expect(product).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        price: expect.any(Number),
      });
    }
  });

  test('POST /products/add creates a product', async ({ request }) => {
    const response = await request.post('/products/add', { data: newProduct });

    expect(response.status()).toBe(201);

    const created = await response.json();
    expect(created).toMatchObject(newProduct);
    expect(created.id).toEqual(expect.any(Number));
  });

  test('GET /products/:id with an unknown id returns 404', async ({ request }) => {
    const response = await request.get(`/products/${missingProductId}`);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.message).toContain(String(missingProductId));
  });
});
