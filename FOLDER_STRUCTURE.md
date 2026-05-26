# Folder Structure

```text
.
├── server/
│   └── index.js
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── useThemeSync.ts
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── constants/
│   ├── features/
│   │   ├── coins/
│   │   └── dashboard/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   └── utils/
├── index.html
├── package.json
├── render.yaml
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## `server`

Express runtime for local development and Render production. It owns CoinGecko proxying, cache policy, sanitization, and security headers.

## `src/app`

App-level routing and browser document/theme synchronization.

## `src/components`

Reusable UI pieces that are not tied to a specific product feature.

- `common`: buttons, skeletons, metric tiles, status pills, error boundary
- `layout`: navigation shell and global search

## `src/features`

Feature modules keep product behavior close to the UI that uses it.

- `coins`: market types, hooks, table, chart
- `dashboard`: overview panels, trending strip, movers

## `src/services`

Network layer. Components and hooks call service functions instead of constructing URLs themselves.

## `src/store`

Cross-route UI state. This project uses Zustand for a tiny persistent store.

## `src/utils`

Pure helpers for formatting, sanitization, and safe URL handling.
