# Orders Dashboard


## Setup & Run


```bash
yarn
yarn start:api # Starts mock backend at http://localhost:3001
yarn start:web # Starts Angular app at http://localhost:4200
```


## Features (MVP)
- **Orders List** `/orders` — table/cards view with pagination, sorting, text search, and filters (status, date range). State synced to URL.
- **Order Details** `/orders/:id` — shows customer info, items, total, status timeline, and action buttons (Mark as Processing, Ship, Cancel). Supports optimistic update with rollback on failure.


## Architecture Decisions


### Tech Stack
- **Angular 17+** with **Standalone Components** and **Signals** (zoneless).
- **json-server** as mock backend with artificial delay (300–1200ms) and 10% simulated 500 errors.
- **yarn** as package manager.
- **ESLint + Prettier** for code quality and style.


### State Management
- Custom **Signal Store** in `core/state/order.store.ts`.
- Selective access via computed signals.
- Memoization for performance.


### HTTP Layer
- **Interceptors**:
- `auth.interceptor.ts` → adds `Authorization` header.
- `request-id.interceptor.ts` → attaches unique `X-Request-Id`.
- `error.interceptor.ts` → global error handling + retry with exponential backoff on 5xx.


### Navigation
- Filters, search, sorting, and pagination state are reflected in the URL.
- Allows bookmarking/sharing filtered views.


### Optimistic Updates
- Actions (Processing, Ship, Cancel) update UI immediately.
- If API fails → rollback with error notification.


### Folder Structure
```
src/app
├── core/ # interceptors, services, state
├── models/ # typed models
├── features/ # feature components (orders-list, order-details)
├── shared/ # reusable UI components
```


## Screenshots


📸 **Orders List**
- Shows paginated/sortable/filterable list of orders.


📸 **Order Details**
- Displays customer info, items, total, and status timeline with action buttons.


📸 **Error Handling**
- Retry & rollback notification when API fails.


> Screenshots should be added after running the app and capturing key pages.
