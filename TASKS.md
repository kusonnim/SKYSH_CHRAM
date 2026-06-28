# TASKS.md

# Development Tasks

This document defines how the project is divided among team members.

The goal is to allow every developer to work simultaneously with minimal merge conflicts.

---

# Development Strategy

The project is divided into three independent areas.

```text
Frontend

Backend

Domain
```

Each team owns its own area.

No team should implement another team's responsibilities.

---

# Frontend Team

## Goal

Build the complete user interface.

The frontend should work even before the backend is finished by using mock data.

---

## Responsibilities

* Landing page
* Login page
* Signup page
* Dashboard
* Chart rendering
* Question panel
* Feedback panel
* User interactions

---

## Editable Folders

```text
src/app/

src/components/
```

---

## Read Only

```text
src/domain/

src/server/

src/app/api/

src/types/
```

---

## API Dependency

Frontend only communicates through HTTP requests.

Allowed endpoints:

```text
GET /api/questions/today

POST /api/answers
```

The frontend must never call Upbit directly.

---

## Temporary Development

Until the backend is complete, use mock data.

Example:

```ts
const mockQuestion = ...
```

The UI should later work without modification by replacing the mock with an API request.

---

# Backend Team

## Goal

Implement every HTTP endpoint.

The backend should be testable using Postman or Thunder Client without any frontend.

---

## Responsibilities

* Upbit communication
* API routes
* Question endpoint
* Answer endpoint
* Response generation

---

## Editable Folders

```text
src/app/api/

src/server/
```

---

## Read Only

```text
src/components/

src/app/

src/domain/

src/types/
```

---

## Responsibilities

Implement:

```text
GET /api/questions/today

POST /api/answers
```

The backend should use functions from the Domain layer instead of implementing business logic directly.

---

# Domain Team

## Goal

Implement every business rule.

The Domain layer contains the educational logic of the application.

---

## Responsibilities

* Candle normalization
* Candle sorting
* Question generation
* Answer grading
* Feedback template generation

---

## Editable Folders

```text
src/domain/

src/types/
```

---

## Read Only

```text
src/components/

src/app/

src/server/
```

---

## Rules

Every function must be:

* Pure
* Deterministic
* Independently testable

The Domain layer must not import:

* React
* Next.js
* Supabase
* Browser APIs

---

# Integration Rules

The following dependency direction must be respected.

```text
Frontend

↓

Backend

↓

Domain
```

Reverse dependencies are forbidden.

---

# Shared Contracts

All teams share the following files.

```text
src/types/

API.md
```

These files define the project contracts.

Changing them requires agreement from every team.

---

# Merge Rules

Each team should avoid modifying another team's files.

Preferred ownership:

```text
Frontend

↓

app/

components/
```

```text
Backend

↓

app/api/

server/
```

```text
Domain

↓

domain/

types/
```

---

# Daily Integration

Recommended workflow:

1. Pull latest changes.
2. Implement only inside owned folders.
3. Test locally.
4. Open Pull Request.
5. Resolve conflicts immediately.

---

# MVP Checklist

## Frontend

* Landing page
* Login page
* Dashboard
* Candle chart
* Question UI
* Feedback UI

---

## Backend

* Upbit connection
* Question API
* Answer API

---

## Domain

* Normalize candles
* Find highest-volume candle
* Generate question
* Grade answer
* Generate feedback

---

# Definition of Done

The MVP is complete when the following flow works.

```text
User logs in

↓

Dashboard opens

↓

Today's question is loaded

↓

BTC chart is displayed

↓

User selects a candle

↓

Answer is submitted

↓

Feedback is displayed
```

---

# Future Work

The following features are intentionally postponed.

* Database
* Virtual trading
* AI feedback
* Drawing tools
* Multiple lessons
* Progress tracking
* Review system
* Real trading
* Technical indicators

These features will be added after the MVP is stable.
