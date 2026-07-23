# SkillBridge API Reference

Base URL: `/api`
Auth: Bearer JWT token in `Authorization` header

---

## Auth

### POST /api/auth/register
**No auth required**
```
Body: { name: string, email: string, password: string }
Response 201: { token: string, user: User }
```

### POST /api/auth/login
**No auth required**
```
Body: { email: string, password: string }
Response 200: { token: string, user: User }
```

### GET /api/auth/me
**Auth required**
```
Response 200: { user: User }
```

---

## Users

### GET /api/users/:id
**Auth required** — Public profile
```
Response 200: User (with skills, rating aggregate)
```

### PATCH /api/users/me
**Auth required** — Update own profile
```
Body: { name?, bio?, location? }
Response 200: User
```

### DELETE /api/users/me
**Auth required** — Delete account (cascading)
```
Response 200: { message: string }
```

---

## Skills

### GET /api/skills
**Auth required**
```
Query: ?category=&search=&sort=&page=
Response 200: { skills: Skill[], total: number, page: number }
```

### GET /api/skills/categories
**Auth required**
```
Response 200: SkillCategory[]
```

### GET /api/skills/search
**Auth required**
```
Query: ?q=
Response 200: { skills: Skill[], users: User[] }
```

### GET /api/skills/:id
**Auth required**
```
Response 200: Skill (with teachers count)
```

---

## User Skills

### GET /api/users/me/skills
**Auth required**
```
Response 200: { offered: UserSkill[], wanted: UserSkill[] }
```

### POST /api/users/me/skills
**Auth required**
```
Body: { skillId: string, type: 'offering'|'seeking' }
Response 201: UserSkill
```

### DELETE /api/users/me/skills/:id
**Auth required**
```
Response 204: No Content
```

### GET /api/users/:id/skills
**Auth required** — Public skills view
```
Response 200: UserSkill[]
```

---

## Exchanges

### GET /api/exchanges
**Auth required**
```
Query: ?status=&page=
Response 200: { exchanges: Exchange[], total: number }
```

### POST /api/exchanges
**Auth required**
```
Body: { skillId: string, receiverId: string, message: string }
Response 201: Exchange
```

### GET /api/exchanges/:id
**Auth required**
```
Response 200: Exchange (with sessions, messages)
```

### PATCH /api/exchanges/:id/accept
**Auth required** — Receiver accepts
```
Response 200: Exchange (status → 'active')
```

### PATCH /api/exchanges/:id/decline
**Auth required** — Receiver declines
```
Body: { reason?: string }
Response 200: Exchange (status → 'declined')
```

### PATCH /api/exchanges/:id/cancel
**Auth required** — Either party cancels
```
Body: { reason?: string }
Response 200: Exchange (status → 'cancelled')
```

### PATCH /api/exchanges/:id/complete
**Auth required** — Mark exchange complete
```
Response 200: Exchange (status → 'completed')
```

---

## Sessions

### GET /api/exchanges/:exchangeId/sessions
**Auth required**
```
Response 200: Session[]
```

### POST /api/exchanges/:exchangeId/sessions
**Auth required**
```
Body: { date: string, time: string, duration: number, location?: string }
Response 201: Session
```

### PATCH /api/sessions/:id/confirm
**Auth required**
```
Response 200: Session (status → 'confirmed')
```

### PATCH /api/sessions/:id
**Auth required** — Edit session
```
Body: { date?, time?, duration?, location? }
Response 200: Session
```

### PATCH /api/sessions/:id/complete
**Auth required**
```
Response 200: Session (status → 'completed')
```

### DELETE /api/sessions/:id
**Auth required**
```
Response 204: No Content
```

---

## Reviews

### GET /api/users/:id/reviews
**Auth required**
```
Response 200: Review[]
```

### POST /api/exchanges/:exchangeId/review
**Auth required**
```
Body: { rating: number (1-5), text?: string (max 500) }
Response 201: Review
```

---

## Messages

### GET /api/exchanges/:exchangeId/messages
**Auth required**
```
Response 200: Message[]
```

### POST /api/exchanges/:exchangeId/messages
**Auth required**
```
Body: { text: string }
Response 201: Message
```

---

## Availability

### GET /api/users/me/availability
**Auth required**
```
Response 200: AvailabilitySlot[]
```

### PUT /api/users/me/availability
**Auth required**
```
Body: { slots: [{ dayOfWeek: number, startTime: string, endTime: string }] }
Response 200: AvailabilitySlot[]
```

### GET /api/users/:id/availability
**Auth required** — Public availability
```
Response 200: AvailabilitySlot[]
```

---

## Dashboard

### GET /api/dashboard/stats
**Auth required**
```
Response 200: { active: number, pending: number, completed: number, avgRating: number }
```

### GET /api/dashboard/exchanges
**Auth required**
```
Query: ?status=
Response 200: Exchange[]
```

---

## Public Stats (Landing)

### GET /api/stats/public
**No auth required**
```
Response 200: { members: number, skills: number, exchanges: number, satisfaction: number }
```
