# Development Tasks

This document explains how three developers should divide work, avoid merge conflicts, and implement the next milestone.

The next milestone is:

```text
Login first, then learning map, then stage sessions.
```

The product direction is a Duolingo-style chart learning app:

```text
Chapter
  Stage
    Question[]
```

---

# Team Structure

The project is divided among three developers.

```text
Developer A: Auth / App Shell
Developer B: Curriculum / Domain
Developer C: Learning UI / Chart
```

Each developer owns a clear area.

Do not modify another developer's owned files without agreement.

---

# Developer A: Auth / App Shell

## Goal

Implement Supabase authentication and protect the main app shell.

Developer A owns the login-first milestone.

## Responsibilities

* Login page
* Signup page
* Logout
* Supabase client setup
* Supabase server and middleware setup
* Dashboard route protection
* Auth redirects
* Authenticated app shell

## Editable Files and Folders

```text
src/app/login/
src/app/signup/
src/app/dashboard/
src/components/auth/
src/lib/supabase/
src/middleware.ts
.env.example
```

## Read Only

```text
src/domain/
src/content/
src/components/learning/
src/components/chart/
src/app/api/
src/types/
```

## Requirements

* User can sign up.
* User can log in.
* User can log out.
* Unauthenticated users are redirected from `/dashboard` to `/login`.
* Authenticated users are redirected from `/login` and `/signup` to `/dashboard`.
* Auth logic remains isolated from learning and chart logic.

## Current A-Scope Tasks

Developer A should implement the following without touching Developer B files:

* Improve login form UX.
* Improve signup form UX.
* Connect logout button to Supabase Auth.
* Protect `/dashboard`.
* Redirect authenticated users from `/login` and `/signup` to `/dashboard`.
* Clean up the auth callback flow.

## Recommended A-Scope Files

Existing files:

```text
src/app/login/
src/app/signup/
src/app/dashboard/
src/app/auth/callback/
src/components/auth/
src/lib/supabase/
src/middleware.ts
```

Recommended additional component files:

```text
src/components/auth/AuthMessage.tsx
src/components/auth/AuthSubmitButton.tsx
src/components/auth/AuthRedirectLink.tsx
```

Optional utility file:

```text
src/lib/auth/redirects.ts
```

Use the optional utility only if redirect rules start repeating across pages, middleware, and callback handling.

## AuthForm Ownership Rule

Avoid keeping two competing implementations of `AuthForm`.

Preferred structure:

```text
src/components/auth/AuthForm.tsx    actual implementation
src/components/AuthForm.tsx         re-export only
```

---

# Developer B: Curriculum / Domain

## Goal

Define the learning model and keep business rules pure.

## Responsibilities

* `Chapter`, `Stage`, and `LearningMap` types
* Static curriculum data
* Stage status rules
* Question generation rules
* Answer grading
* Feedback generation
* Domain tests
* API contract documentation

## Editable Files and Folders

```text
src/types/
src/domain/
src/content/
API.md
ARCHITECTURE.md
TASKS.md
MVP.md
```

## Read Only

```text
src/components/
src/app/
src/server/
src/lib/supabase/
```

## Requirements

* Define `Chapter`.
* Define `Stage`.
* Define `StageStatus`.
* Define `LearningMap`.
* Keep the existing single-question flow working while the learning map is added.
* Add tests for curriculum and progress helpers.
* Domain code must not import React, Next.js, Supabase, HTTP, or browser APIs.

---

# Developer C: Learning UI / Chart

## Goal

Build the learning experience UI without owning authentication or domain rules.

## Responsibilities

* Learning map UI
* Chapter section UI
* Stage node UI
* Stage session page
* Candle chart interaction
* Question panel UI
* Feedback UI
* Visual states for locked, available, and completed stages

## Editable Files and Folders

```text
src/components/learning/
src/components/chart/
src/app/stage/
```

Developer C may edit `src/app/dashboard/page.tsx` only after coordinating with Developer A.

## Read Only

```text
src/domain/
src/types/
src/content/
src/lib/supabase/
src/app/api/
```

## Requirements

* Dashboard can display chapters and stages.
* Stage nodes show locked, available, and completed states.
* Available stages can be opened.
* Stage page can display placeholder questions before API integration is complete.
* UI must not calculate correct answers or generate questions.

## Current C-Scope Tasks

Developer C should implement the following without touching Developer B files:

* Improve `StageNode` visual states for `locked`, `available`, and `completed`.
* Build the stage page layout.
* Add placeholder UI for question progression.
* Add a progress indicator such as `1 / 3`.

## Recommended C-Scope Files

Existing files:

```text
src/components/learning/
src/components/chart/
src/app/stage/
```

Recommended additional component files:

```text
src/components/learning/StageStatusBadge.tsx
src/components/learning/StageProgress.tsx
src/components/learning/StageSessionShell.tsx
src/components/learning/StageCompletePanel.tsx
```

`StageStatusBadge` should be shared by `StageNode` and any future stage summary UI.

`StageProgress` should display question progress such as:

```text
1 / 3
```

`StageSessionShell` should own layout only.

It must not generate questions, grade answers, or calculate correct answers.

---

# Backend / API Ownership

Backend work should be assigned explicitly before editing API files.

For the 3-person plan:

* Developer B owns API contracts and domain behavior.
* Developer A owns auth-related server utilities.
* Developer C consumes APIs from the UI.
* One developer should be selected before changing `src/app/api/` or `src/server/`.

## Backend Responsibilities

* Upbit communication
* Learning map endpoint
* Stage endpoint
* Answer endpoint
* Progress endpoint
* Response generation
* Error handling

## Backend Editable Folders

```text
src/app/api/
src/server/
```

---

# Current API Dependencies

The A and C workstreams should not require new backend APIs.

## Developer A

Developer A should use Supabase Auth directly:

```ts
supabase.auth.signInWithPassword()
supabase.auth.signUp()
supabase.auth.signOut()
supabase.auth.getUser()
```

Required app route:

```text
GET /auth/callback
```

No custom login, signup, or logout API route is required for the current milestone.

## Developer C

Developer C should consume the existing learning APIs:

```text
GET /api/learning-map
GET /api/stages/:stageId
POST /api/answers
POST /api/progress/stage-complete
```

Optional future API:

```text
GET /api/progress
```

This is not required for the current milestone because `GET /api/learning-map` already returns stage status.

---

# Recommended Folder Ownership

```text
src/types/               Developer B
src/domain/              Developer B
src/content/             Developer B

src/lib/supabase/        Developer A
src/middleware.ts        Developer A
src/app/login/           Developer A
src/app/signup/          Developer A
src/app/dashboard/       Developer A owns the shell
src/components/auth/     Developer A

src/components/learning/ Developer C
src/components/chart/    Developer C
src/app/stage/           Developer C

src/app/api/             Assigned per task
src/server/              Assigned per task
```

---

# Branch Strategy

Use separate branches for each workstream.

```text
feature/auth-supabase
feature/curriculum-contracts
feature/learning-map-ui
feature/stage-session-ui
feature/learning-api
```

Recommended merge order:

1. `feature/curriculum-contracts`
2. `feature/auth-supabase`
3. `feature/learning-map-ui`
4. `feature/stage-session-ui`
5. `feature/learning-api`

If login is the immediate milestone, `feature/auth-supabase` may merge first.

In that case, Developer B must avoid breaking existing `Question` and API types.

---

# Login-First Task Breakdown

## Developer A

Implement:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/middleware.ts
src/middleware.ts
src/components/auth/AuthForm.tsx
src/components/auth/LogoutButton.tsx
```

## Developer B

Implement or prepare:

```text
src/types/curriculum.ts
src/types/learning.ts
src/domain/curriculum.ts
src/domain/progress.ts
src/content/curriculum.ts
```

## Developer C

Implement:

```text
src/components/learning/LearningMap.tsx
src/components/learning/ChapterSection.tsx
src/components/learning/StageNode.tsx
src/app/stage/[stageId]/page.tsx
```

---

# Integration Rules

The dependency direction is fixed.

```text
Frontend
  -
Backend
  -
Domain
```

Reverse dependencies are forbidden.

Examples:

* Domain cannot import React.
* Domain cannot import Next.js.
* Domain cannot import Supabase.
* Components cannot calculate the correct answer.
* Components cannot generate questions.
* Frontend must never call Upbit directly.

---

# Shared Contracts

All developers share the following files.

```text
src/types/
API.md
```

These files define project contracts.

Changing them requires agreement from every developer.

---

# Daily Workflow

1. Pull latest changes.
2. Implement only inside owned folders.
3. Run tests locally.
4. Run the build locally when touching app code.
5. Open a pull request.
6. Resolve conflicts immediately.

Recommended checks:

```text
npm test
npm run build
```

---

# MVP Checklist

## Auth / App Shell

* Login page
* Signup page
* Logout
* Protected dashboard
* Auth redirects

## Curriculum / Domain

* Chapter type
* Stage type
* Learning map type
* Static curriculum
* Stage status rules
* Existing candle question rules

## Learning UI

* Learning map
* Chapter sections
* Stage nodes
* Stage page
* Candle chart
* Question UI
* Feedback UI

## Backend

* Upbit connection
* Learning map API
* Stage API
* Answer API
* Progress API, when needed

---

# Definition of Done

The MVP is complete when the following flow works.

```text
User logs in
  -
Dashboard opens
  -
Learning map is displayed
  -
User opens a stage
  -
Stage questions are loaded
  -
BTC chart is displayed
  -
User selects a candle
  -
Answer is submitted
  -
Feedback is displayed
```

---

# Future Work

The following features are intentionally postponed.

* Large curriculum
* Database-backed curriculum management
* Virtual trading
* AI feedback
* Drawing tools
* XP
* Achievements
* Streaks
* Real trading
* Technical indicators

