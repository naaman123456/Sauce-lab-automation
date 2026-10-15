import { test, expect } from '@playwright/test';
import { apiUser } from '../../test-data/apiData';

test.describe('API - Auth', () => {
  test('POST /auth/login with valid credentials returns a token', async ({ request }) => {
    const response = await request.post('/auth/login', { data: apiUser });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.username).toBe(apiUser.username);
    expect(body.accessToken).toEqual(expect.any(String));
    expect(body.accessToken.length).toBeGreaterThan(0);
  });

  test('GET /auth/me with the token returns the logged-in user', async ({ request }) => {
    const login = await request.post('/auth/login', { data: apiUser });
    expect(login.status()).toBe(200);
    const { accessToken } = await login.json();

    const response = await request.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status()).toBe(200);
    expect((await response.json()).username).toBe(apiUser.username);
  });

  test('POST /auth/login with a wrong password returns 400', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: apiUser.username, password: 'wrong-password' },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toBe('Invalid credentials');
  });

  test('POST /auth/login with missing fields returns 400', async ({ request }) => {
    const response = await request.post('/auth/login', { data: {} });

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toEqual(expect.any(String));
  });

  test('GET /auth/me without a token returns 401', async ({ request }) => {
    const response = await request.get('/auth/me');

    expect(response.status()).toBe(401);
  });
});
