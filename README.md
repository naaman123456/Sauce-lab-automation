# Sauce Lab Automation

![Playwright Tests](https://github.com/naaman123456/Sauce-lab-automation/actions/workflows/playwright.yml/badge.svg)

End-to-end UI and API test automation for [Sauce Demo](https://www.saucedemo.com), built with Playwright and TypeScript.

## Tech Stack
- Playwright
- TypeScript
- Page Object Model (POM)
- Data-driven testing (CSV and TS test data)
- GitHub Actions (CI/CD)

## Project Structure
```
├── .github/workflows/   # CI pipeline (runs tests on every push)
├── fixtures/            # Custom Playwright fixtures
├── pages/               # Page Object classes (BasePage, CartPage, Checkout pages)
├── test-data/           # Test data (CSV, TS, URLs, API data)
├── tests/
│   ├── api/             # API tests
│   └── *.spec.ts        # UI tests (login, add to cart, checkout)
├── utils/               # Helper functions
└── playwright.config.ts # Playwright configuration
```

## Test Coverage
- Login with valid and invalid users
- Add products to cart (Backpack, Bike Light)
- Full checkout flow: cart, customer info, overview, order complete
- API tests

## How to Run
```bash
git clone https://github.com/naaman123456/Sauce-lab-automation.git
cd Sauce-lab-automation
npm install
npx playwright install
cp .env.example .env
npx playwright test
```

Run only API tests:
```bash
npm run test:api
```

View the HTML report:
```bash
npx playwright show-report
```

## CI/CD
Tests run automatically on GitHub Actions on every push and pull request to `main`. The HTML report is saved as a downloadable artifact for each run.