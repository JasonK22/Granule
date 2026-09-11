# Granule
A personal budget tracker that lives entirely on your device. No accounts, no servers, no syncing. Log what comes in and goes out, set monthly limits per category, and let the dashboard do the arithmetic.

# Features
Multiple accounts: separate cash, card, or however you split your money

Transactions: income and expenses with categories, filtering, and sorting

Monthly budgets: a recurring limit per category, tracked automatically against the selected month

Dashboard: income, expenses, net balance, and savings rate at a glance, plus a category breakdown and a 6-month income/expense trend

Quick add: a floating button (or press N anywhere) to log a transaction from any page

Custom categories: add or remove categories, each with its own icon and color

Multi-currency — Switch the display currency in settings, choose from USD - US Dollar EUR - Euro GBP - British Pound JPY - Japanese Yen CAD - Canadian Dollar AUD - Australian Dollar NGN - Nigerian Naira INR - Indian Rupee ZAR -South African Rand

# Local-first: everything is saved to localStorage; nothing leaves your browser

# Tech stack
React 19 + React Router
Vite for tooling and dev server
Recharts for charts
Lucide for icons
Plain CSS with custom properties: no UI framework
Project structure
src/
  components/
    Dashboard/      summary cards, category/trend chart, budget overview
    Transactions/   ledger list, filters, add/edit form
    Budgets/        monthly limits, progress bars
    Settings/       currency, categories, data reset
    Layout/         sidebar navigation, page headers
    Onboarding/      first-run welcome flow
    common/          modal, toast, confirm dialog, and other shared UI
  context/          global state (accounts, transactions, budgets) and UI state
  hooks/            localStorage persistence, transaction queries, month filtering
  utils/            calculations, currency formatting, category metadata
Granule

## Tech stack
- [React 19](https://react.dev) + [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev) for tooling and dev server
- [Recharts](https://recharts.org) for charts
- [Lucide](https://lucide.dev) for icons
- Plain CSS with custom properties: no UI framework

<!-- ## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Build for production with:

```bash
npm run build
``` -->

## Project structure

```
src/
  components/
    Dashboard/      summary cards, category/trend chart, budget overview
    Transactions/   ledger list, filters, add/edit form
    Budgets/        monthly limits, progress bars
    Settings/       currency, categories, data reset
    Layout/         sidebar navigation, page headers
    Onboarding/      first-run welcome flow
    common/          modal, toast, confirm dialog, and other shared UI
  context/          global state (accounts, transactions, budgets) and UI state
  hooks/            localStorage persistence, transaction queries, month filtering
  utils/            calculations, currency formatting, category metadata
```
# Granule

