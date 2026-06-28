# MVP Scope

This document defines the scope of the first MVP.

The purpose of the MVP is not to build the complete product.

The purpose is to validate the core learning experience with the smallest useful implementation.

---

# MVP Goal

A user can:

1. Sign up or log in.
2. Open the dashboard.
3. See a simple learning map.
4. Open a stage.
5. View a real BTC daily chart.
6. Solve one or more chart-reading questions.
7. Receive educational feedback.

If this flow works correctly, the MVP is considered successful.

---

# Core User Flow

```text
Landing Page
  -
Login
  -
Dashboard
  -
Learning Map
  -
Select Stage
  -
Load Stage Questions
  -
Display BTC Daily Chart
  -
User Selects a Candle
  -
Submit Answer
  -
Receive Feedback
```

---

# Included Features

## Authentication

* User sign up
* User login
* User logout
* Protected dashboard page
* Redirects for authenticated and unauthenticated users

## Real Market Data

Use the Upbit Quotation API.

Use only:

* KRW-BTC
* Daily candles

The application must display real market data.

## Learning Content

The target MVP structure should support a small Duolingo-style learning path:

```text
Chapter
  Stage
    Question[]
```

Initial chapter:

```text
Volume Reading
```

Initial stage:

```text
Find the highest-volume candle
```

Initial question:

> Select the candle with the highest trading volume.

The question is generated automatically from the latest BTC daily candles.

## Question Type

Only one question type is supported at first.

```text
select_candle
```

The user clicks exactly one candle.

## Learning Map

The MVP should show a simple learning map after login.

The first version may use static curriculum data.

Requirements:

* Show chapters.
* Show stages inside each chapter.
* Show whether a stage is locked, available, or completed.
* Allow the user to open an available stage.
* Keep the visual structure ready for more stages later.

Progress may be mocked until Supabase progress storage is introduced.

## Answer Evaluation

The server compares:

```text
Selected Candle Index
  -
Correct Candle Index
```

The server returns:

* Correct
* Incorrect
* Feedback

During early MVP development, `correctCandleIndex` may be sent by the client.

Later, the server should own the answer and grade by `questionId`.

## Feedback

Feedback is template-based.

Correct:

> Great job! You correctly identified the highest-volume candle.

Incorrect:

> That candle is not the highest-volume candle. Compare the volume bars again.

No AI-generated feedback is included in the MVP.

---

# Technical Scope

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* TradingView Lightweight Charts

## Backend

* Next.js API Routes

## Authentication

* Supabase Auth

## External API

* Upbit Quotation API

---

# Login-First Implementation Plan

The next implementation milestone is authentication.

Implement authentication before advanced curriculum or progress storage.

Recommended order:

1. Configure Supabase clients.
2. Implement login and signup forms.
3. Add logout.
4. Protect `/dashboard`.
5. Redirect authenticated users away from `/login` and `/signup`.
6. Add the learning map shell to `/dashboard`.
7. Add stage pages after the dashboard shell is stable.

The learning map may use static or mock data while authentication is being completed.

---

# Out of Scope

The following features are intentionally excluded from the MVP.

## Learning

* Large curriculum
* Technical indicators
* Trend lines
* Support and resistance
* Drawing tools

## AI

* AI explanations
* AI grading
* AI feedback
* Personalized learning

## Trading

* Real trading
* Virtual trading
* Portfolio
* Investment history

## Progress

* User level
* XP
* Achievements
* Streaks
* Daily missions

Basic stage status is allowed in the MVP.

Advanced gamification is out of scope.

## Database

No application database is required for the first learning-map version.

Only Supabase Authentication is required.

Question generation can be performed in memory.

Progress may be mocked until persistence is needed.

---

# Success Criteria

## Authentication

* User can sign up.
* User can log in.
* User can log out.
* Unauthenticated users cannot access the dashboard.

## Learning Map

* User can see the first chapter.
* User can see at least one available stage.
* User can open a stage from the dashboard.

## Chart

* BTC daily candles load successfully.
* Candles are rendered correctly.

## Lesson

* Stage questions are displayed.
* User can select one candle.
* User can submit an answer.

## Evaluation

* Correct answers are detected.
* Incorrect answers are detected.
* Feedback is displayed.

---

# Non-Goals

The MVP is not intended to prove:

* Investment performance
* AI quality
* Educational effectiveness
* Scalability

It only proves that the core interaction is feasible.

---

# Future Expansion

After the MVP is complete, future versions may include:

## Learning

* Multiple chapters
* Progressive curriculum
* Technical analysis concepts
* Drawing exercises
* Review sessions

## AI

* Educational explanations
* Personalized hints
* Adaptive difficulty
* Review assistant

## Trading

* Virtual trading
* Investment journal
* Reflection system
* Risk management training

## Platform

* Database-backed progress
* User statistics
* Daily learning
* Multiple assets
* Multiple timeframes

---

# MVP Principle

When making implementation decisions, always prefer the simpler solution.

If a feature is not required for the MVP goal, do not implement it.

The MVP exists to validate the learning experience, not to build the final product.

