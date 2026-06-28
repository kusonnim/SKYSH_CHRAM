# PROJECT.md

# Chart Learning

> Learn to read charts, not just trade them.

---

# Overview

Chart Learning is a web-based educational platform that teaches users how to read financial charts using real market data.

Unlike traditional investment apps, this project does **not** focus on recommending assets or maximizing profits.

Instead, the goal is to help users develop the ability to observe, analyze, and reason about charts on their own.

The service follows a Duolingo-style learning experience:

* Learn one concept at a time
* Practice immediately
* Apply the concept to a real chart
* Receive feedback
* Repeat

---

# Core Philosophy

Most investment applications answer the question:

> **"What should I buy?"**

Chart Learning answers a different question:

> **"Why did you make that decision?"**

The application evaluates the user's reasoning process rather than the financial outcome.

Success is measured by improvement in chart-reading skills, not by investment returns.

---

# Educational Principles

The application is designed around the following principles.

## Users should think first

The application should never immediately reveal the answer.

Instead of saying:

> "This is an uptrend."

It should encourage users to determine the trend themselves.

---

## Practice is more important than explanation

Reading long explanations is not enough.

Users should repeatedly perform actions such as:

* Selecting candles
* Finding trends
* Identifying high-volume candles
* Drawing support lines
* Drawing resistance lines
* Choosing possible entry points

Learning occurs through repetition.

---

## Use real market data

The application uses real market data from the Upbit Quotation API.

Charts are generated from actual OHLCV data rather than artificial examples.

This allows users to practice with realistic market situations.

---

## AI is a teacher, not an advisor

AI is responsible for:

* explaining concepts
* providing hints
* giving educational feedback
* helping users review their reasoning

AI must **never**:

* recommend buying or selling
* predict future prices
* recommend specific assets
* provide financial advice

---

# MVP Scope

The first MVP intentionally focuses on one simple learning experience.

Included:

* User authentication
* Display a real BTC daily chart using Upbit data
* Generate one learning question
* Allow the user to answer
* Evaluate the answer
* Display educational feedback

---

# Out of Scope

The following features are intentionally excluded from the MVP.

* Real trading
* Automatic trading
* Portfolio management
* Multiple lessons
* Multiple assets
* AI-generated educational content
* Drawing tools
* Progression system
* Review system
* Virtual trading

These features may be added in future versions.

---

# First Lesson

The first learning activity is intentionally simple.

Question:

> **Select the candle with the highest trading volume.**

The goal is not to test investment knowledge.

The goal is to teach users where trading volume is displayed and how to compare candles.

---

# Learning Flow

Every lesson follows the same structure.

1. Introduce one concept
2. Show a real chart
3. Ask the user to perform one task
4. Evaluate the answer
5. Provide educational feedback

The complexity increases gradually over time.

---

# Success Criteria

The MVP is considered successful if a user can:

1. Sign in
2. Open today's lesson
3. View a real BTC chart
4. Complete the first learning task
5. Receive feedback

If these five steps work correctly, the educational foundation of the application is complete.

---

# Long-Term Vision

Chart Learning aims to become a complete chart-reading education platform.

Future versions may include:

* Progressive learning paths
* Drawing exercises
* Multiple technical analysis concepts
* Review sessions
* Personalized learning
* Virtual trading
* AI-assisted educational feedback

However, the core philosophy will remain unchanged:

> Teach users **how to think**, not **what to buy**.
