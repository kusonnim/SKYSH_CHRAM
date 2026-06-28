# API.md

# API Specification

This document defines every shared contract between the Frontend and Backend.

These interfaces **must remain stable** during development.

If an API changes, every team must be notified before implementation.

---

# General Rules

## Response Format

Every successful response follows:

```ts
{
  success: true,
  data: ...
}
```

Every failed response follows:

```ts
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

---

# Shared Types

## Candle

```ts
export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};
```

---

## Question

```ts
export type Question = {
  id: string;
  type: "select_candle";

  market: string;
  timeframe: string;

  prompt: string;

  candles: Candle[];

  answer?: {
    correctIndex: number;
  };
};
```

> During MVP, `answer` may be returned for faster development.
>
> It should be removed in later versions.

---

## SubmitAnswerRequest

```ts
export type SubmitAnswerRequest = {
  questionId: string;
  selectedCandleIndex: number;

  // Temporary MVP field
  correctCandleIndex: number;
};
```

---

## AnswerResult

```ts
export type AnswerResult = {
  isCorrect: boolean;
  score: number;
  feedback: string;
};
```

---

# Authentication

Authentication is handled entirely by Supabase.

No custom authentication endpoints are required.

Frontend uses:

```ts
supabase.auth.signUp()

supabase.auth.signInWithPassword()

supabase.auth.signOut()
```

---

# Question API

## GET /api/questions/today

Returns today's learning question.

Response

```json
{
  "success": true,
  "data": {
    "id": "today-volume-max",

    "type": "select_candle",

    "market": "KRW-BTC",

    "timeframe": "day",

    "prompt": "Select the candle with the highest trading volume.",

    "candles": [],

    "answer": {
      "correctIndex": 42
    }
  }
}
```

---

# Answer API

## POST /api/answers

Grades the user's answer.

Request

```json
{
  "questionId": "today-volume-max",

  "selectedCandleIndex": 31,

  "correctCandleIndex": 42
}
```

Response

```json
{
  "success": true,

  "data": {
    "isCorrect": false,

    "score": 0,

    "feedback": "The selected candle is not the highest-volume candle. Compare the volume bars again."
  }
}
```

---

# Upbit Internal API

The frontend never communicates directly with Upbit.

Instead, the backend provides an internal endpoint.

## GET /api/upbit/candles

Query

```text
market=KRW-BTC

timeframe=day

count=100
```

Response

```json
{
  "success": true,

  "data": {
    "market": "KRW-BTC",

    "timeframe": "day",

    "candles": []
  }
}
```

---

# Component Contracts

## CandleChart

```ts
type CandleChartProps = {

  candles: Candle[];

  selectedIndex: number | null;

  onSelectCandle: (index: number) => void;

}
```

---

## QuestionPanel

```ts
type QuestionPanelProps = {

  prompt: string;

  selectedIndex: number | null;

  onSubmit: () => void;

}
```

---

## FeedbackBox

```ts
type FeedbackBoxProps = {

  result: AnswerResult | null;

}
```

---

# Domain Function Contracts

## normalizeUpbitCandles()

Input

```ts
unknown[]
```

Output

```ts
Candle[]
```

---

## sortCandlesOldestFirst()

Input

```ts
Candle[]
```

Output

```ts
Candle[]
```

---

## findMaxVolumeCandleIndex()

Input

```ts
Candle[]
```

Output

```ts
number
```

---

## createMaxVolumeQuestion()

Input

```ts
Candle[]
```

Output

```ts
Question
```

---

## gradeSelectCandleAnswer()

Input

```ts
selectedIndex

correctIndex
```

Output

```ts
{
  isCorrect: boolean;

  score: number;

  mistakeCode: string | null;
}
```

---

## createBasicFeedback()

Input

```ts
isCorrect

mistakeCode
```

Output

```ts
string
```

---

# MVP Workflow

```text
Frontend

↓

GET /api/questions/today

↓

Question

↓

User selects candle

↓

POST /api/answers

↓

AnswerResult

↓

Display feedback
```

---

# Version Policy

During the MVP, API contracts should remain unchanged.

If changes are required:

1. Update this document.
2. Notify all team members.
3. Implement the changes after agreement.

No implementation should modify an API contract without updating this document first.
