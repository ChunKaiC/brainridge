# Brainridge Bank

A simple banking transactions web application built with Angular. Users can create accounts, transfer funds between them, and review each account's transaction history.

The Angular application lives in [`angular/`](./angular).

---

## Features

- **Create accounts** — name, initial balance, and account type (Chequing or Savings), with validation on every field
- **Transfer funds** — move money between any two accounts, with balances updating everywhere immediately
- **Transaction history** — per-account history showing direction, counterparty, amount, date, and notes, with a search filter across all fields

## Tech stack

| | |
|---|---|
| Framework | Angular 22 (NgModule-based, zoneless) |
| UI library | Angular Material 22 (Material 3, dark theme) |
| Forms | Reactive Forms (`FormBuilder` / `FormGroup`) |
| State | Angular signals |
| Tests | Vitest via `@angular/build:unit-test` |

---

## Getting started

**Prerequisites:** Node.js 20+ and npm. (Developed against Node 24.19 / npm 11.17.)

```bash
cd angular
npm install
```

**Run the development server:**

```bash
npm start
```

Then open <http://localhost:4200>. The app redirects to `/accounts`.

**Run the unit tests:**

```bash
npm test
```

**Build for production:**

```bash
npm run build
```

Output is written to `angular/dist/angular`.

---

## Project structure

```
angular/src/app/
├── app-module.ts            # Root module — toolbar, routing, animations
├── app-routing-module.ts    # Root routes + redirect to /accounts
├── app.html                 # Shell: nav toolbar + <router-outlet>
│
├── core/
│   └── account-service.ts   # Single source of truth for all app state
│
├── models/
│   ├── account.model.ts     # Account, AccountType
│   └── transaction.model.ts # Transaction
│
├── shared/                  # SharedModule — reusable UI
│   ├── shared-module.ts
│   └── app-button/          # Reusable button, styled by account type
│
└── accounts/                # AccountsModule — feature module
    ├── accounts-module.ts
    ├── accounts-routing-module.ts
    ├── account-list/        # /accounts
    ├── account-creation/    # /accounts/new
    ├── transfer/            # /accounts/transfer
    └── transaction-history/ # /accounts/:id/history
```

### Routes

| Path | Page |
|---|---|
| `/` | Redirects to `/accounts` |
| `/accounts` | Account list (landing page) |
| `/accounts/new` | Create an account |
| `/accounts/transfer` | Transfer funds |
| `/accounts/:id/history` | Transaction history for one account |

---

## Architecture notes

### Module organisation

Three modules with distinct responsibilities:

- **`AppModule`** — the root shell (toolbar, router outlet) and app-wide providers.
- **`SharedModule`** — reusable UI. It declares and **exports** `AppButton` so any feature module can use it, keeping presentational components independent of any one feature.
- **`AccountsModule`** — the accounts feature: four page components plus its own `AccountsRoutingModule` using `RouterModule.forChild()`, so the feature owns its own routes.

`core/` holds app-wide singletons and `models/` holds plain TypeScript interfaces — neither needs module registration.

### State management with signals

`AccountService` is the single source of truth. It holds accounts and transactions in `signal()`s, exposing them as read-only via `.asReadonly()` so only the service can mutate state.

Updates always produce **new** arrays and objects rather than mutating in place — signals detect change by reference, so in-place mutation wouldn't trigger a re-render. This is also what makes balances update across every view at once: the account list, both transfer dropdowns, and the history page all read the same signal, so a transfer is reflected everywhere without any manual refresh.

Derived state uses `computed()`, which recalculates only when its dependencies change. The transaction history list is a `computed` over the route's account id, the search term, and the service's transactions.

### Validation in two layers

Validation is deliberately duplicated, because the two layers do different jobs:

- **The form layer** guides the user — inline errors while typing, and a disabled submit button. Cross-field rules (`sameAccount`, `insufficientBalance`) are implemented as custom validators on the `FormGroup`, since they compare fields against each other and against live account balances.
- **The service layer** enforces correctness. `AccountService.transfer()` re-checks every rule and throws if violated, so an account balance can never go negative regardless of who calls it. Here the service stands in for what would normally be a backend API — and a backend never trusts the client.

The transfer page also wraps its service call in `try`/`catch` and surfaces any error to the user, as a backstop for anything the form didn't prevent.

---

## Design decisions and assumptions

**State is in memory only.** Creating accounts and transferring funds works fully within a session, but a browser refresh resets the app. Persistence wasn't part of the brief, so it was left out to keep the data layer focused; adding `localStorage` would be a contained change inside `AccountService`.

**Reactive forms rather than `ngModel` for the transfer form.** The brief asks for both `FormBuilder`/`FormControls` and two-way data binding. Those belong to Angular's two different forms paradigms, and mixing `ngModel` into a reactive form is discouraged by Angular. The forms therefore use reactive forms, and the requirement's intent — balances updating after each transaction — is met through signals, which propagate a change to every view rather than binding one input to one property. Literal two-way binding (`[(ngModel)]`) is used on the transaction history search field, where template-driven binding is the natural fit.

**Account IDs are UUIDs** (`crypto.randomUUID()`), displayed truncated to five characters in lists and in full on the account detail view.

**Colours are defined once as CSS custom properties** in `src/styles.scss` — account-type and transaction-direction colours are shared between the reusable button and the pages that use them, so there's a single place to change them.

---

## Requirements coverage

| Requirement | Where |
|---|---|
| `FormBuilder` + `FormControls` | `account-creation.ts`, `transfer.ts` |
| Account type via radio buttons | `account-creation.html` (`mat-radio-group`) |
| Button conditionally **rendered** by account type | `account-creation.html` (`@if` on the submit button) |
| Button conditionally **styled** by account type | `app-button.ts` / `app-button.scss` (`variant` input → class binding) |
| Input validators (balance > 0, name length) | `account-creation.ts` |
| Amount cannot exceed balance / cannot be negative | `transfer.ts` (`sufficientBalance` validator + service guard) |
| Reusable button component in a shared module | `shared/app-button/`, declared and exported by `SharedModule` |
| Routing between pages via `RouterModule` | `app-routing-module.ts`, `accounts-routing-module.ts` |
| Transaction history per account | `transaction-history/` (reads `:id` route param) |
| Search / filter (optional) | `transaction-history.ts` — matches notes, counterparty, direction, amount, date |
| Modular codebase | `AppModule` / `SharedModule` / `AccountsModule` / `core` / `models` |
| Bootstrap or Material UI | Angular Material throughout |
