# API Specification

This document defines shared contracts between the frontend and backend.

These interfaces should remain stable during development.

If an API changes, every developer must be notified before implementation.

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

## Chapter

```ts
export type Chapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  stages: Stage[];
};
```

---

## Stage

```ts
export type StageStatus = "locked" | "available" | "completed";

export type Stage = {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  order: number;
  status: StageStatus;
  questionCount: number;
};
```

---

## LearningMap

```ts
export type LearningMap = {
  chapters: Chapter[];
};
```

During early development, stage progress may be mocked.

When Supabase progress storage is introduced, `status` must be calculated per user.

---

## Question

```ts
export type Question = {
  id: string;
  type: "select_candle";

  stageId?: string;

  market: string;
  timeframe: string;

  prompt: string;

  candles: Candle[];

  answer?: {
    correctIndex: number;
  };
};
```

During MVP, `answer` may be returned for faster development.

It should be removed from client-facing responses in later versions.

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

Authentication is handled by Supabase.

No custom authentication endpoints are required for basic auth.

Frontend uses:

```ts
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.signOut()
```

Protected pages:

```text
/dashboard
/stage/:stageId
```

Unauthenticated users should be redirected to `/login`.

Authenticated users should be redirected away from `/login` and `/signup`.

## Auth Dependencies

Developer A should use Supabase Auth methods directly:

```ts
supabase.auth.signInWithPassword()
supabase.auth.signUp()
supabase.auth.signOut()
supabase.auth.getUser()
```

No custom login, signup, or logout API route is required for the current milestone.

---

# Auth Callback Route

## GET /auth/callback

Handles Supabase auth redirects after email confirmation or OAuth-style callback flows.

Responsibilities:

* Exchange the incoming code for a session when required.
* Refresh the server-side session cookies.
* Redirect the user to `/dashboard` when successful.
* Redirect to `/login` or an error-safe route when unsuccessful.

This is an application route, not a JSON API endpoint.

---

# Learning Map API

## GET /api/learning-map

Returns the chapter and stage map for the current user.

During early development, this endpoint may return static curriculum data with mock progress.

Response:

```json
{
  "success": true,
  "data": {
    "chapters": [
      {
        "id": "volume",
        "title": "Volume Reading",
        "description": "Learn how to compare trading volume on real candles.",
        "order": 1,
        "stages": [
          {
            "id": "volume-highest-candle",
            "chapterId": "volume",
            "title": "Find the highest volume",
            "description": "Select the candle with the highest trading volume.",
            "order": 1,
            "status": "available",
            "questionCount": 3
          }
        ]
      }
    ]
  }
}
```

---

# Stage API

## GET /api/stages/:stageId

Returns the questions for a stage.

The first implementation may generate multiple `select_candle` questions from the same candle dataset.

Response:

```json
{
  "success": true,
  "data": {
    "stage": {
      "id": "volume-highest-candle",
      "chapterId": "volume",
      "title": "Find the highest volume",
      "description": "Select the candle with the highest trading volume.",
      "order": 1,
      "status": "available",
      "questionCount": 3
    },
    "questions": []
  }
}
```

---

# Question API

## GET /api/questions/today

Returns today's learning question.

This endpoint exists for the single-question MVP.

When the learning map is introduced, prefer:

```text
GET /api/learning-map
GET /api/stages/:stageId
POST /api/answers
```

Response:

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

During MVP, the client may send `correctCandleIndex`.

After stage progress is introduced, the server should own the answer and grade by `questionId`.

Request:

```json
{
  "questionId": "today-volume-max",
  "selectedCandleIndex": 31,
  "correctCandleIndex": 42
}
```

Response:

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

# Progress API

## POST /api/progress/stage-complete

Marks a stage as complete for the authenticated user.

This endpoint can be postponed until progress persistence is required.

Request:

```json
{
  "stageId": "volume-highest-candle"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "stageId": "volume-highest-candle",
    "status": "completed",
    "nextStageId": "volume-lowest-candle"
  }
}
```

---

# Optional Progress API

## GET /api/progress

Returns the current user's persisted progress.

This endpoint is optional and should not be implemented until progress persistence is required.

For the current milestone, `GET /api/learning-map` already includes stage status.

Future response:

```json
{
  "success": true,
  "data": {
    "completedStageIds": ["volume-highest-candle"],
    "availableStageIds": ["volume-spike"]
  }
}
```

---

# Upbit Internal API

The frontend never communicates directly with Upbit.

Instead, the backend provides internal access to candle data.

## GET /api/upbit/candles

Query:

```text
market=KRW-BTC
timeframe=day
count=100
```

Response:

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

## AuthMessage

```ts
type AuthMessageProps = {
  type: "error" | "success" | "info";
  message: string;
}
```

---

## AuthSubmitButton

```ts
type AuthSubmitButtonProps = {
  loading: boolean;
  children: React.ReactNode;
}
```

---

## AuthRedirectLink

```ts
type AuthRedirectLinkProps = {
  mode: "login" | "signup";
}
```

---

## LearningMap

```ts
type LearningMapProps = {
  chapters: Chapter[];
  onSelectStage: (stageId: string) => void;
}
```

---

## ChapterSection

```ts
type ChapterSectionProps = {
  chapter: Chapter;
  onSelectStage: (stageId: string) => void;
}
```

---

## StageNode

```ts
type StageNodeProps = {
  stage: Stage;
  onSelect: (stageId: string) => void;
}
```

---

## StageStatusBadge

```ts
type StageStatusBadgeProps = {
  status: StageStatus;
}
```

---

## StageProgress

```ts
type StageProgressProps = {
  current: number;
  total: number;
}
```

---

## StageSessionShell

```ts
type StageSessionShellProps = {
  stage: Stage;
  currentQuestionIndex: number;
  totalQuestions: number;
  children: React.ReactNode;
}
```

---

## StageCompletePanel

```ts
type StageCompletePanelProps = {
  stage: Stage;
  onContinue: () => void;
}
```

---

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

Input:

```ts
unknown[]
```

Output:

```ts
Candle[]
```

---

## sortCandlesOldestFirst()

Input:

```ts
Candle[]
```

Output:

```ts
Candle[]
```

---

## findMaxVolumeCandleIndex()

Input:

```ts
Candle[]
```

Output:

```ts
number
```

---

## createMaxVolumeQuestion()

Input:

```ts
Candle[]
```

Output:

```ts
Question
```

---

## gradeSelectCandleAnswer()

Input:

```ts
selectedIndex
correctIndex
```

Output:

```ts
{
  isCorrect: boolean;
  score: number;
  mistakeCode: string | null;
}
```

---

## createBasicFeedback()

Input:

```ts
isCorrect
mistakeCode
```

Output:

```ts
string
```

---

# Learning Workflow

```text
Frontend
  -
GET /api/learning-map
  -
User selects stage
  -
GET /api/stages/:stageId
  -
Question[]
  -
User solves questions
  -
POST /api/answers
  -
AnswerResult
  -
Display feedback and update progress
```

Current frontend API dependencies:

```text
Auth:
  Supabase Auth methods
  GET /auth/callback

Learning:
  GET /api/learning-map
  GET /api/stages/:stageId
  POST /api/answers
  POST /api/progress/stage-complete
```

---

# Version Policy

During the MVP, API contracts should remain stable.

If changes are required:

1. Update this document.
2. Notify all developers.
3. Implement the changes after agreement.

No implementation should modify an API contract without updating this document first.

