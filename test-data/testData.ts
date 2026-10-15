// All test data is loaded from testData.csv: edit values there, not in the tests.
// CSV columns: Category,Key,Field,Value  (e.g. products,backpack,price,29.99)
import * as fs from 'fs';
import * as path from 'path';

const CSV_PATH = path.join(__dirname, 'testData.csv');

export type User = { username: string; password: string };
export type Customer = { firstName: string; lastName: string; postalCode: string };
export type Product = {
  name: string;
  /** Used in data-test ids, e.g. add-to-cart-<id> */
  id: string;
  price: number;
};

type Rows = Record<string, Record<string, Record<string, string>>>;

/** Splits one CSV line into cells, supporting "quoted, values" and "" escapes */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells.map(c => c.trim());
}

/** Reads the CSV into { category: { key: { field: value } } } */
function loadCsv(): Rows {
  const content = fs.readFileSync(CSV_PATH, 'utf8').replace(/^﻿/, ''); // strip Excel BOM
  const lines = content
    .split(/\r?\n/)
    .filter(line => line.trim() !== '' && !/^"?sep=/i.test(line)); // skip blank lines and Excel's "sep=," hint
  const rows: Rows = {};
  lines.slice(1).forEach((line, index) => {
    const [category, key, field, value] = parseCsvLine(line);
    if (!category || !key || !field || value === undefined) {
      throw new Error(`testData.csv line ${index + 2} is invalid: "${line}"`);
    }
    rows[category] ??= {};
    rows[category][key] ??= {};
    rows[category][key][field] = value;
  });
  return rows;
}

const rows = loadCsv();

/** Gets one value and fails with a clear message if it is missing from the CSV */
function value(category: string, key: string, field: string): string {
  const v = rows[category]?.[key]?.[field];
  if (v === undefined || v === '') {
    throw new Error(`Missing value in testData.csv: ${category},${key},${field}`);
  }
  return v;
}

function number(category: string, key: string, field: string): number {
  const n = Number(value(category, key, field));
  if (Number.isNaN(n)) {
    throw new Error(`Value is not a number in testData.csv: ${category},${key},${field}`);
  }
  return n;
}

/** Builds { key: object } for every key in a category; unknown keys throw a clear error */
function group<T>(category: string, build: (key: string) => T): Record<string, T> {
  const keys = Object.keys(rows[category] ?? {});
  const built = Object.fromEntries(keys.map(key => [key, build(key)]));
  return new Proxy(built, {
    get(target, prop) {
      if (typeof prop === 'string' && !(prop in target)) {
        throw new Error(`No "${prop}" found under "${category}" in testData.csv`);
      }
      return target[prop as string];
    },
  });
}

export const users = group<User>('users', key => ({
  username: value('users', key, 'username'),
  password: value('users', key, 'password'),
}));

export const customers = group<Customer>('customers', key => ({
  firstName: value('customers', key, 'firstName'),
  lastName: value('customers', key, 'lastName'),
  postalCode: value('customers', key, 'postalCode'),
}));

export const products = group<Product>('products', key => ({
  name: value('products', key, 'name'),
  id: value('products', key, 'id'),
  price: number('products', key, 'price'),
}));

export const checkout = {
  paymentInfo: value('checkout', 'checkout', 'paymentInfo'),
  shippingInfo: value('checkout', 'checkout', 'shippingInfo'),
  taxRate: number('checkout', 'checkout', 'taxRate'),
  successHeader: value('checkout', 'checkout', 'successHeader'),
  successText: value('checkout', 'checkout', 'successText'),
};

export const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;

/** Expected item total, tax and total for the given products */
export function orderTotals(items: Product[]) {
  const itemTotal = items.reduce((sum, p) => sum + p.price, 0);
  const tax = Math.round(itemTotal * checkout.taxRate * 100) / 100;
  return {
    itemTotal: formatPrice(itemTotal),
    tax: formatPrice(tax),
    total: formatPrice(itemTotal + tax),
  };
}
