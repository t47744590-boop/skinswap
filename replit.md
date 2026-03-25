# Workspace

## Overview

SkinSwap — a multi-game P2P skin trading platform supporting CS2, TF2, and Roblox. Players can list skins and trade them directly skin-for-skin with no money involved. Steam OpenID login, a marketplace, and a trade offer system.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS v4
- **Auth**: Steam OpenID 2.0 (no API key required), `express-session` + `connect-pg-simple`

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (auth, listings, trades)
│   └── cs2-trade/          # React + Vite frontend (dark theme, orange accent)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

- **Multi-game support** — CS2, TF2, and Roblox skins all in one marketplace
- **Skin-for-skin only** — no money/prices; trades are item-for-item
- **Dark gamer UI** — dark gray backgrounds, orange (#f97316) accent
- **Steam OpenID login** — free, no API key needed; session stored in PostgreSQL
- **Marketplace** — browse active listings, filter by game/wear/search
- **Listing detail** — view skin details, offer a specific skin in exchange
- **Create listing** — authenticated users list skins (game, itemType, name, optional wear/float/image)
- **Trade system** — sellers can accept/decline offers; accepting marks listing as traded
- **User profile** — view own listings and trade history

## Database Schema

- `users` — steamId (PK), displayName, avatarUrl
- `listings` — id, userId, game (CS2/TF2/Roblox), skinName, itemType, wear (optional), float (optional), imageUrl, status (active/traded/cancelled)
- `trades` — id, listingId, buyerId, sellerId, offeredSkinName, offeredItemType, offeredGame, offeredImageUrl, message, status (pending/accepted/declined)
- `user_sessions` — auto-created by connect-pg-simple for session storage

## Auth Flow

1. User clicks "Login with Steam" → redirected to `/api/auth/steam`
2. Server initiates Steam OpenID with return URL
3. Steam redirects to `/api/auth/steam/return` with verification params
4. Server verifies assertion, creates/fetches user in DB, sets session cookie
5. Frontend calls `/api/auth/me` to get current user state

## API Routes

All routes are under `/api`:

- `GET /healthz` — health check
- `GET /auth/me` — current user or null
- `GET /auth/steam` — initiate Steam login
- `GET /auth/steam/return` — Steam OpenID callback
- `POST /auth/logout` — clear session
- `GET /listings` — list active listings (filter: game, itemType, wear, search)
- `POST /listings` — create listing (auth required)
- `GET /listings/:id` — listing detail with trades
- `DELETE /listings/:id` — cancel own listing (auth required)
- `GET /users/:steamId/listings` — user's active listings
- `GET /users/:steamId/trades` — user's trade history (auth required, own only)
- `POST /trades` — create skin-for-skin trade offer (auth required)
- `POST /trades/:id/accept` — accept trade offer (seller only)
- `POST /trades/:id/decline` — decline trade offer (seller only)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Development

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/cs2-trade run dev` — run the frontend
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push schema changes to database
