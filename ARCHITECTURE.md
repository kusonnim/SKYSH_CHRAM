# ARCHITECTURE.md

# Project Architecture

This document defines the overall architecture of the project.

Its purpose is to clearly separate responsibilities so that multiple developers can work simultaneously without conflicts.

---

# Architecture Overview

The project is divided into four independent layers.

```text
Frontend
        │
        ▼
Backend API
        │
        ▼
Domain Logic
        │
        ▼
External Services
```

Each layer has a single responsibility.

---

# Frontend

Responsible for user interaction.

Responsibilities:

* Render pages
* Render charts
* Display lessons
* Display questions
* Handle user interactions
* Display feedback

The frontend **must not** contain business logic.

Examples of forbidden logic:

* Determining the correct answer
* Generating questions
* Calculating indicators
* Calling Upbit directly

The frontend only consumes API responses.

---

# Backend API

Responsible for connecting every part of the application.

Responsibilities:

* Receive requests
* Call Upbit API
* Generate questions
* Grade answers
* Return responses

The backend does not render UI.

---

# Domain Layer

The domain layer contains all business logic.

Everything inside this layer should be implemented as pure functions.

Examples:

* Normalize candle data
* Sort candles
* Find highest volume candle
* Generate question
* Grade answer
* Generate feedback template

The domain layer should not depend on:

* React
* Next.js
* Supabase
* HTTP
* Browser APIs

This layer should be reusable and independently testable.

---

# External Services

The MVP uses only two external services.

## Upbit Quotation API

Used for:

* Market information
* Candle data

Used only by the backend.

The frontend never calls Upbit directly.

---

## Supabase Authentication

Used only for:

* Sign up
* Login
* Session management

Authentication logic is isolated from learning logic.

---

# Folder Structure

```text
src/
│
├── app/
│
├── components/
│
├── domain/
│
├── server/
│
├── types/
│
└── lib/
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
    api/
```

---

# components/

Contains reusable UI components.

Examples:

```text
AuthForm
CandleChart
QuestionPanel
FeedbackBox
```

Components should never contain business logic.

---

# domain/

Contains the core learning logic.

Examples:

```text
candle.ts
question.ts
grading.ts
feedback.ts
```

Every function inside this folder should be deterministic and reusable.

---

# server/

Contains integrations with external services.

Examples:

```text
upbit.ts
```

Responsibilities:

* Fetch Upbit data
* Convert API responses
* Handle server-side operations

---

# types/

Contains shared TypeScript types.

Every layer imports types from here.

Examples:

```text
Candle

Question

AnswerResult
```

No business logic should exist inside this folder.

---

# lib/

Contains application utilities.

Examples:

```text
supabase.ts
```

Utilities should be independent from business logic.

---

# Dependency Rules

The dependency direction is fixed.

```text
Frontend
    │
    ▼
Backend
    │
    ▼
Domain
```

The reverse direction is forbidden.

For example:

* Domain cannot import React.
* Domain cannot import Next.js.
* Components cannot calculate the correct answer.
* Components cannot generate questions.

---

# Design Principles

## Single Responsibility

Every module should have one responsibility.

Example:

Bad:

```text
question.ts

- fetch candles
- calculate indicators
- render chart
```

Good:

```text
upbit.ts
→ fetch candles

question.ts
→ create question

CandleChart.tsx
→ render chart
```

---

## Pure Domain Logic

Business logic should not depend on frameworks.

Example:

Good:

```ts
findMaxVolume(candles)
```

Bad:

```ts
useEffect(() => ...)
```

inside business logic.

---

## API First

The frontend and backend communicate only through predefined API contracts.

Both teams should develop independently using the agreed request and response formats.

---

# MVP Architecture

```text
User

↓

Frontend

↓

Backend API

↓

Domain Logic

↓

Upbit API

↓

Response

↓

Frontend
```

All educational decisions originate from the Domain layer.

The frontend is responsible only for presenting the results.
