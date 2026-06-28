# MVP.md

# MVP Scope

This document defines the exact scope of the first MVP.

The purpose of the MVP is **not** to build the complete product.

The purpose is to validate the core learning experience with the smallest possible implementation.

---

# MVP Goal

A user can:

1. Sign up or log in.
2. Open today's lesson.
3. View a real BTC daily chart.
4. Solve one chart-reading problem.
5. Receive educational feedback.

If this flow works correctly, the MVP is considered successful.

---

# Core User Flow

```text
Landing Page

↓

Login

↓

Dashboard

↓

Load Today's Question

↓

Display BTC Daily Chart

↓

User Selects a Candle

↓

Submit Answer

↓

Receive Feedback
```

---

# Included Features

## Authentication

* User sign up
* User login
* User logout
* Protected dashboard page

---

## Real Market Data

Use the Upbit Quotation API.

Use only:

* KRW-BTC
* Daily candles

The application must display real market data.

---

## Learning Content

Only one lesson exists.

Lesson:

> Select the candle with the highest trading volume.

The question is generated automatically from the latest BTC daily candles.

---

## Question Type

Only one question type is supported.

```text
select_candle
```

The user clicks exactly one candle.

---

## Answer Evaluation

The server compares:

```text
Selected Candle Index

↓

Correct Candle Index
```

The server returns:

* Correct
* Incorrect
* Feedback

---

## Feedback

Feedback is template-based.

Example:

Correct

> Great job! You correctly identified the highest-volume candle.

Incorrect

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

---

## Backend

* Next.js API Routes

---

## Authentication

* Supabase Auth

---

## External API

* Upbit Quotation API

---

# Out of Scope

The following features are intentionally excluded.

## Learning

* Multiple lessons
* Multiple chapters
* Technical indicators
* Trend lines
* Support and resistance
* Drawing tools

---

## AI

* AI explanations
* AI grading
* AI feedback
* Personalized learning

---

## Trading

* Real trading
* Virtual trading
* Portfolio
* Investment history

---

## Progress

* User level
* XP
* Achievements
* Streaks
* Daily missions

---

## Database

No application database is required.

Only Supabase Authentication is used.

Question generation is performed in memory.

---

# Success Criteria

The MVP is successful if every item below works.

## Authentication

* User can sign up.
* User can log in.
* User can log out.

---

## Chart

* BTC daily candles load successfully.
* Candles are rendered correctly.

---

## Lesson

* Today's question is displayed.
* User can select one candle.
* User can submit an answer.

---

## Evaluation

* Correct answers are detected.
* Incorrect answers are detected.
* Feedback is displayed.

---

# Non-Goals

The MVP is **not** intended to prove:

* Investment performance
* AI quality
* Educational effectiveness
* Scalability

It only proves that the core interaction is feasible.

---

# Future Expansion

After the MVP is complete, future versions may include:

## Learning

* Multiple lessons
* Progressive curriculum
* Technical analysis concepts
* Drawing exercises
* Review sessions

---

## AI

* Educational explanations
* Personalized hints
* Adaptive difficulty
* Review assistant

---

## Trading

* Virtual trading
* Investment journal
* Reflection system
* Risk management training

---

## Platform

* Database
* User progress
* Statistics
* Daily learning
* Multiple assets
* Multiple timeframes

---

# MVP Principle

When making implementation decisions, always prefer the simpler solution.

If a feature is not required for the MVP goal, do not implement it.

The MVP exists to validate the learning experience—not to build the final product.
