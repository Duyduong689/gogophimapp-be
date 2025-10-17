# new-be

Base NestJS backend.

## Prerequisites
- Node.js 18+
- pnpm (recommended) or npm/yarn

## Setup

```bash
# install deps (choose one)
pnpm install
# or
npm install
```

## Development

```bash
# run in watch mode
pnpm start:dev
# or
npm run start:dev
```

App listens on http://localhost:3000 by default.

## Production build

```bash
pnpm build && pnpm start
# or
npm run build && npm start
```

## Endpoints
- GET `/` → hello message
- GET `/health` → { "status": "ok" }

## Scripts
- `start:dev` – run Nest in watch mode
- `build` – compile TypeScript to `dist`
- `start` – run compiled app

