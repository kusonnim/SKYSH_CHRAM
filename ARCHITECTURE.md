# Project Architecture

This document defines the architecture of the project.

Its purpose is to separate responsibilities so that multiple developers can work simultaneously without conflicts.

---

# Architecture Overview

The project is divided into four layers.

```text
Frontend
  -
Backend API
  -
Domain Logic
  -
External Services
```

Each layer has a single responsibility.

---

# Product Model

The product should evolve from a single daily question into a Duolingo-style chart learning path.

The recommended hierarchy is:

```text
Course
  Chapter
    Stage
      Question[]
```

For the MVP expansion, the application may use the smaller version:

```text
Chapter
  Stage
    Question[]
```

Definitions:

* `Chapter` is a large learning topic, such as volume, candles, trends, or support and resistance.
* `Stage` is a small unit inside a chapter.
* `Question` is one task the user solves inside a stage.

Example:

```text
Chapter: Volume Reading
  Stage 1: Select the highest-volume candle
  Stage 2: Find a volume spike
  Stage 3: Compare price movement with volume
```

The first implementation should support only `select_candle` questions.

Future question types can be added later:

```text
select_range
compare_candles
select_direction
draw_line
```

---

# Frontend

Responsible for user interaction.

Responsibilities:

* Render pages
* Render charts
* Display the learning map
* Display stages
* Display questions
* Handle user interactions
* Display feedback

The frontend must not contain business logic.

Examples of forbidden logic:

* Determining the correct answer
* Generating questions
* Calculating indicators
* Calling Upbit directly

The frontend consumes API responses and renders UI.

---

# Backend API

Responsible for connecting every part of the application.

Responsibilities:

* Receive requests
* Call Upbit API
* Load curriculum data
* Generate questions
* Grade answers
* Return responses
* Handle progress endpoints when progress storage is added

The backend does not render UI.

---

# Domain Layer

The domain layer contains all business logic.

Everything inside this layer should be implemented as pure functions.

Examples:

* Normalize candle data
* Sort candles
* Find highest-volume candle
* Generate questions
* Grade answers
* Generate feedback templates
* Calculate stage status
* Determine next available stage

The domain layer must not depend on:

* React
* Next.js
* Supabase
* HTTP
* Browser APIs

This layer should be reusable and independently testable.

---

# External Services

The MVP uses two external services.

## Upbit Quotation API

Used for:

* Market information
* Candle data

Used only by the backend.

The frontend never calls Upbit directly.

## Supabase Authentication

Used for:

* Sign up
* Login
* Logout
* Session management

Authentication logic is isolated from learning logic.

---

# Folder Structure

Recommended structure:

```text
src/
  app/
    login/
    signup/
    dashboard/
    stage/
      [stageId]/
    api/
      learning-map/
      stages/
        [stageId]/
      answers/
      progress/
  components/
    auth/
    chart/
    learning/
  content/
    curriculum.ts
  domain/
    candle.ts
    question.ts
    grading.ts
    feedback.ts
    curriculum.ts
    progress.ts
  server/
    upbit.ts
    auth.ts
  types/
    api.ts
    auth.ts
    curriculum.ts
    learning.ts
  lib/
    mock-data.ts
    supabase/
      client.ts
      server.ts
      middleware.ts
```

---

# app/

Contains pages and API routes.

Examples:

```text
app/
  page.tsx
  login/
  signup/
  dashboard/
  stage/
  api/
```

`dashboard/page.tsx` should act as the authenticated learning map shell.

The actual learning map UI should live in `components/learning/` to avoid route-level merge conflicts.

---

# components/

Contains reusable UI components.

Recommended groups:

```text
components/
  auth/
    AuthForm
    LogoutButton
  chart/
    CandleChart
  learning/
    LearningMap
    ChapterSection
    StageNode
    QuestionPanel
    FeedbackBox
```

Components should never contain business logic.

---

# content/

Contains static learning content used before a database is introduced.

Examples:

```text
content/
  curriculum.ts
```

This folder may define chapters, stages, lesson metadata, and mock progress.

It should not fetch market data, read sessions, or contain React components.

---

# domain/

Contains the core learning logic.

Examples:

```text
candle.ts
question.ts
grading.ts
feedback.ts
curriculum.ts
progress.ts
```

Every function inside this folder should be deterministic and reusable.

---

# server/

Contains integrations with external services.

Examples:

```text
upbit.ts
auth.ts
```

Responsibilities:

* Fetch Upbit data
* Convert API responses
* Handle server-side operations
* Contain server-only auth helpers when needed

---

# types/

Contains shared TypeScript types.

Every layer imports types from here.

Examples:

```text
Candle
Question
AnswerResult
Chapter
Stage
LearningMap
StageStatus
```

No business logic should exist inside this folder.

---

# lib/

Contains application utilities.

Examples:

```text
lib/
  mock-data.ts
  supabase/
    client.ts
    server.ts
    middleware.ts
```

Utilities should be independent from business logic.

---

# Authentication Architecture

Authentication is handled by Supabase Auth.

The recommended files are:

```text
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
middleware.ts
components/auth/AuthForm.tsx
components/auth/LogoutButton.tsx
```

Rules:

* Unauthenticated users must be redirected away from protected pages such as `/dashboard`.
* Authenticated users should not remain on `/login` or `/signup`.
* Auth logic must remain isolated from learning and chart logic.
* Domain functions must never import Supabase.

---

# Recommended Route Structure

```text
app/
  page.tsx
  login/
    page.tsx
  signup/
    page.tsx
  dashboard/
    page.tsx
  stage/
    [stageId]/
      page.tsx
  api/
    learning-map/
      route.ts
    stages/
      [stageId]/
        route.ts
    answers/
      route.ts
    progress/
      route.ts
```

---

# Dependency Rules

The dependency direction is fixed.

```text
Frontend
  -
Backend
  -
Domain
```

The reverse direction is forbidden.

For example:

* Domain cannot import React.
* Domain cannot import Next.js.
* Domain cannot import Supabase.
* Components cannot calculate the correct answer.
* Components cannot generate questions.
* Frontend cannot call Upbit directly.

---

# Design Principles

## Single Responsibility

Every module should have one responsibility.

Bad:

```text
question.ts
  fetch candles
  calculate indicators
  render chart
```

Good:

```text
upbit.ts
  fetch candles

question.ts
  create question

CandleChart.tsx
  render chart
```

## Pure Domain Logic

Business logic should not depend on frameworks.

Good:

```ts
findMaxVolume(candles)
```

Bad:

```ts
useEffect(() => ...)
```

inside business logic.

## API First

The frontend and backend communicate only through predefined API contracts.

All developers should build against `API.md` and shared types.

