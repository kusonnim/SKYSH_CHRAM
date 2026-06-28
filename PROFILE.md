# Profile Page Specification

This document outlines the design, API contracts, and file structure for the Profile Page in the Chart Learning application.

---

## Overview

The Profile Page allows authenticated users to view their account information, update their profile details (such as nickname), and track their learning progress and statistics.

---

## User Information Management Options

We can manage user profile data in one of two ways:

### Option A: Supabase Auth Metadata (Recommended for MVP)
* **Description**: Store profile fields (e.g., `nickname`) directly in Supabase Auth's `user_metadata`.
* **Pros**: No additional database tables or API routes required. Fast setup.
* **Cons**: Limited query capabilities (cannot easily query or search users by nickname on the backend).

### Option B: Database `profiles` Table (Recommended for Production)
* **Description**: Create a `profiles` table in Supabase Database linked to `auth.users` via a foreign key.
* **Pros**: Relational queries, easy metadata expansion, ability to enforce unique nicknames.
* **Cons**: Requires database schema setup, triggers, and custom API routes.

---

## API Specifications

### 1. Authentication & Basic Profile (Supabase Auth)
The frontend communicates directly with Supabase Auth. No custom backend routes are needed.

* **Get Current User Info**
  ```ts
  const { data: { user } } = await supabase.auth.getUser();
  // Returns user.email, user.created_at, user.user_metadata
  ```

* **Update Profile Metadata (Option A)**
  ```ts
  const { data, error } = await supabase.auth.updateUser({
    data: { nickname: "NewNickname" }
  });
  ```

### 2. Custom Profile API (Option B - If using Database Table)
If we choose Option B, we will implement a custom API route.

* **GET `/api/profile`**
  * **Description**: Retrieves the profile record for the authenticated user.
  * **Response**:
    ```json
    {
      "success": true,
      "data": {
        "id": "user-uuid",
        "nickname": "ChartMaster",
        "avatarUrl": "/avatars/default.png",
        "updatedAt": "2026-06-28T16:00:00Z"
      }
    }
    ```

* **PATCH `/api/profile`**
  * **Description**: Updates the profile record.
  * **Request**:
    ```json
    {
      "nickname": "NewNickname",
      "avatarUrl": "/avatars/new.png"
    }
    ```
  * **Response**:
    ```json
    {
      "success": true,
      "data": {
        "id": "user-uuid",
        "nickname": "NewNickname",
        "avatarUrl": "/avatars/new.png",
        "updatedAt": "2026-06-28T16:01:00Z"
      }
    }
    ```

### 3. Learning Progress & Stats (Existing & Extension)
* **GET `/api/learning-map`**
  * Used to calculate overall progress (e.g., completed stages vs. total stages).
* **GET `/api/progress` (Optional)**
  * Returns detailed user progress if needed for advanced statistics.

---

## File Structure

The following files will be created or modified to implement this feature.

### 🆕 New Files

#### 1. Page
* **`src/app/profile/page.tsx`**
  * The main profile page. Fetches user data on the server or client, and coordinates sub-components.

#### 2. Components
* **`src/components/profile/ProfileCard.tsx`**
  * Displays user avatar, nickname, email, and member join date.
* **`src/components/profile/ProfileEditForm.tsx`**
  * Form containing input fields for editing the nickname, with validation and saving states.
* **`src/components/profile/LearningStats.tsx`**
  * Displays visual metrics of the user's progress (e.g., "Completed: 3 / 10 Stages", "Success Rate: 85%").

#### 3. API (Only for Option B)
* **`src/app/api/profile/route.ts`**
  * Next.js API route to handle database-backed profile CRUD operations.

---

## 🛠️ Modified Files

* **`src/middleware.ts`**
  * Add `/profile` to the list of protected routes to ensure only authenticated users can access it.
* **`src/app/dashboard/layout.tsx` (or Header component)**
  * Add a navigation link or user dropdown menu pointing to `/profile`.

---

## User Flow

```text
[Dashboard / Header]
       │
       ▼ (Click Profile Link)
[src/app/profile/page.tsx]
       │
       ├─► Render [ProfileCard.tsx] (Displays Email, Nickname, Join Date)
       ├─► Render [LearningStats.tsx] (Fetches progress & shows statistics)
       │
       └─► (Click Edit Profile)
             ▼
       [ProfileEditForm.tsx] (Input new nickname -> Submit -> Call API -> Update UI)
```
