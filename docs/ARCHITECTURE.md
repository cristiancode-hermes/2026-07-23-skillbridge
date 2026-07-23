# SkillBridge — Architecture Overview

## Project: Community Skill Exchange Platform

SkillBridge connects community members to exchange skills. Users create profiles, list skills they can teach or want to learn, browse the community, send exchange requests, schedule sessions, and build reputation through ratings.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22 (standalone, zoneless, signals) |
| Backend | NestJS 11 (SWC, TypeORM 1.1.0) |
| Database | SQLite via better-sqlite3 (dev) / Neon Postgres (prod) |
| Auth | JWT (Passport + bcryptjs) |
| CSS | Tailwind v4 + custom Tidepool design system |
| Build | npm workspaces monorepo |

## Monorepo Structure

```
skillbridge/
├── apps/
│   ├── api/          # NestJS backend
│   │   └── src/
│   │       ├── auth/           # JWT auth module
│   │       ├── users/          # User CRUD
│   │       ├── skills/         # Skill + Category CRUD
│   │       ├── user-skills/    # User-Skill join management
│   │       ├── exchanges/      # Exchange lifecycle (state machine)
│   │       ├── sessions/       # Session scheduling
│   │       ├── reviews/        # Rating + review system
│   │       ├── messages/       # Exchange message threads
│   │       ├── availability/   # Weekly availability slots
│   │       ├── dashboard/      # Aggregated dashboard data
│   │       ├── stats/          # Public landing stats
│   │       └── seed/           # Demo data seeder
│   └── web/          # Angular frontend
│       └── src/app/
│           ├── services/       # HTTP + state services (signals)
│           ├── guards/         # Auth route guard
│           ├── interceptors/   # JWT auth interceptor
│           ├── shared/         # Reusable components
│           ├── layouts/        # App shell layouts
│           ├── models/         # TypeScript interfaces
│           └── pages/          # Feature pages (lazy loaded)
└── docs/             # Documentation
```

## Data Model (9 entities)

```
User ──1:N── UserSkill ──N:1── Skill ──N:1── SkillCategory
 │
 ├──1:N── Exchange (as sender/receiver)
 ├──1:N── Session (as participant)
 ├──1:N── Review (as reviewer/target)
 ├──1:N── Message (as sender)
 └──1:N── AvailabilitySlot
```

## Exchange State Machine

```
pending ──accept──→ active
pending ──decline──→ declined
active  ──complete→ completed
active  ──cancel──→ cancelled
pending ──cancel──→ cancelled
```

## Key Design Decisions

1. **Signals** — All frontend state uses Angular signals with `inject()` DI
2. **Zoneless** — `provideExperimentalZonelessChangeDetection()` for perf
3. **TypeORM object syntax** — `.find({ relations: { user: true } })` not arrays
4. **Pure CSS variables** — Tidepool design system uses `var(--color-*)` not Tailwind utilities
5. **Lazy routes** — All feature pages are lazy-loaded via `loadComponent`
6. **SQLite for dev** — Synchronized schema, Neon-ready SQL
