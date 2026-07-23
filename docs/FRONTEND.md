# SkillBridge — Frontend Guide

## Tech Stack

- **Angular 22** — standalone components, zoneless change detection
- **Signals** — all reactive state management
- **Tailwind v4** — pure CSS variables (Tidepool design system)
- **Lazy loading** — all feature routes lazy-loaded
- **Functional guards** — `authGuard` as `CanActivateFn`
- **Functional interceptors** — `authInterceptor` as `HttpInterceptorFn`

## Routes

| Path | Component | Auth |
|------|-----------|------|
| `/` | `LandingPage` | No |
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `/onboarding` | `OnboardingPage` | Yes |
| `/dashboard` | `DashboardPage` | Yes |
| `/skills` | `BrowseSkillsPage` | Yes |
| `/skills/category/:slug` | `BrowseSkillsPage` | Yes |
| `/profile/:id` | `ProfilePublicPage` | Yes |
| `/profile/edit` | `ProfileEditPage` | Yes |
| `/exchanges/new/:skillId/:userId` | `ExchangeRequestPage` | Yes |
| `/exchanges/:id` | `ExchangeDetailPage` | Yes |
| `/exchanges/:id/sessions/new` | `SessionFormPage` | Yes |
| `/exchanges/:id/sessions/:sessionId/edit` | `SessionFormPage` | Yes |
| `/exchanges/:id/review` | `ReviewFormPage` | Yes |
| `/settings` | `SettingsPage` | Yes |
| `**` | `NotFoundPage` | No |

## Services

All services inject `ApiService` and expose signals for reactive state:

```typescript
// Pattern:
export class SkillService {
  private readonly skillsSignal = signal<Skill[]>([]);
  readonly skills = this.skillsSignal.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
```

### Services List
- `AuthService` — login, register, me, token management, currentUser signal
- `UserService` — profile CRUD
- `SkillService` — skill + category browsing and search
- `UserSkillService` — manage offered/wanted skills
- `ExchangeService` — exchange CRUD + status transitions
- `SessionService` — session CRUD
- `ReviewService` — reviews + ratings
- `MessageService` — exchange messages
- `AvailabilityService` — weekly availability
- `DashboardService` — dashboard stats + exchange lists
- `StatsService` — public landing stats
- `ThemeService` — dark mode toggle

## Shared Components

| Component | Description |
|-----------|-------------|
| `AvatarComponent` | User avatar with initials fallback |
| `SkillBadgeComponent` | Colored pill (offered=primary, wanted=secondary) |
| `StarRatingComponent` | 5-star rating (display/interactive) |
| `StatusBadgeComponent` | Color-coded status indicator |
| `ExchangeCardComponent` | Exchange summary with action buttons |
| `SessionCardComponent` | Session card with confirm/reschedule/cancel |
| `MessageBubbleComponent` | Single message (right-aligned sender, left-aligned receiver) |
| `MessageThreadComponent` | Message list + input |
| `SearchInputComponent` | Debounced search with icon |
| `ConfirmDialogComponent` | Modal confirmation dialog |
| `EmptyStateComponent` | Empty state with icon + message + CTA |
| `ErrorAlertComponent` | Error banner with retry button |
| `LoadingSkeletonComponent` | Skeleton loader (card/list/table variants) |
| `ToastService` | Notification toasts (success/error/info) |

## Design System: Tidepool

A warm, coastal palette inspired by tide pools. See `DESIGN_SYSTEM.md` for full token reference.

### Key Colors
- Primary: `#0B6E7A` (trust, depth)
- Secondary: `#E86A6A` (energy)
- Accent: `#E8B84B` (warmth)
- Surface: `#F5F3EE` (cards)
- Background: `#FAFAF9`
- Typography: Inter (headings + body)

## State Handling Pattern

Every page that loads data implements these states:
1. **Loading** — Skeleton placeholders while data fetches
2. **Error** — Alert banner with retry button
3. **Empty** — Friendly message with CTA
4. **Normal** — Real data rendered
