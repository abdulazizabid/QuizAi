# QuizGen AI

> Turn study materials into personalized practice examinations.

[![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-2563eb)](#technology-stack)
[![Status](https://img.shields.io/badge/status-frontend%20prototype-f59e0b)](#project-status)
[![License](https://img.shields.io/badge/license-not%20specified-lightgrey)](#license)

QuizGen AI is a student-focused web application for creating customized practice exams from PDF notes and lecture slides. Students choose the number of multiple-choice and short-answer questions, set an exam duration, complete a timed assessment, review their answers, and track performance over time.

This repository currently contains the responsive frontend prototype. It demonstrates the complete user journey with browser-side sample data while the proposed FastAPI, LangChain, AI, and MySQL services are still under development.

## Project proposal

The formal proposal describes the motivation, background study, planned features, architecture, and technology choices for QuizGen AI.

> **Proposal link:** To be added when the public project proposal URL is available.

## Why QuizGen AI?

Students often revise from lengthy notes but lack practice questions tailored to the exact material they are studying. Existing tools may generate generic quizzes or support only MCQs. QuizGen AI is designed as one unified workflow for document-based question generation, timed exams, short-answer evaluation, source-based feedback, and long-term progress tracking.

## Current prototype features

- Responsive landing page with product overview and guided workflow
- Sign-up and sign-in interfaces with basic client-side validation
- Dashboard with summary cards and recent-exam data
- Drag-and-drop study-material selection
- Configurable MCQ count, short-question count, and exam duration
- Timed examination interface with automatic submission
- Previous/next controls and direct question navigation
- Answered-question indicators
- Automatic MCQ scoring and temporary length-based short-answer scoring
- Detailed result review with answers, explanations, and sample references
- Browser-persisted examination history
- Profile statistics, progress chart, and exam-history table

## Project status

QuizGen AI is an **in-progress frontend prototype**, not yet a production-ready AI application.

| Area                                  | Current state                                   |
| ------------------------------------- | ----------------------------------------------- |
| Interface and navigation              | Implemented                                     |
| Exam configuration and timer          | Implemented in the browser                      |
| Question data                         | Static sample question pools                    |
| MCQ evaluation                        | Implemented in the browser                      |
| Short-answer evaluation               | Temporary answer-length check                   |
| Exam history                          | Stored in `localStorage`                        |
| Active exam and result                | Stored in `sessionStorage`                      |
| Authentication                        | UI flow only; no user session or JWT yet        |
| File processing                       | File selection only; files are not uploaded yet |
| AI generation and source references   | Planned                                         |
| FastAPI, LangChain, and MySQL backend | Planned                                         |

## Application workflow

1. Create an account or sign in through the prototype authentication screens.
2. Open **Create Exam** and select a PDF or slide deck.
3. Choose the desired number of MCQs and short-answer questions.
4. Set the examination duration and review the generated summary.
5. Start the timed exam, answer questions, and submit—or allow the timer to submit automatically.
6. Review the score, correct answers, explanations, and sample source references.
7. Visit the profile page to view saved results and progress.

> The selected file name and exam settings drive the current demo, but the file contents are not read. Questions and references come from static sample data until backend integration is complete.

## System overview

QuizGen AI follows a simple multi-page frontend architecture. Each HTML page has a focused responsibility, page-specific styling, and a JavaScript module that manages its interactions. The browser currently acts as both the presentation layer and temporary data store.

```text
Study material + exam settings
              │
              ▼
      Create Exam page
              │
              │ sessionStorage: examConfig
              ▼
        Timed Exam page
              │
              │ sessionStorage: examResult
              ▼
        Result Review page
              │
              │ localStorage: quizgenHistory
              ▼
       Profile / Progress page
```

When the backend is implemented, file processing, question generation, evaluation, authentication, and permanent storage will move out of the browser and into the FastAPI application.

## Pages and responsibilities

| Page                     | Responsibility                                                             |
| ------------------------ | -------------------------------------------------------------------------- |
| `index.html`             | Introduces the product, its benefits, and the four-step workflow           |
| `pages/signup.html`      | Collects registration details and checks password confirmation             |
| `pages/signin.html`      | Provides the prototype login flow                                          |
| `pages/dashboard.html`   | Shows overview statistics, recent exams, and navigation shortcuts          |
| `pages/create-exam.html` | Accepts a local file selection and examination settings                    |
| `pages/exam.html`        | Renders questions, records answers, manages navigation, and runs the timer |
| `pages/result.html`      | Displays the score and a question-by-question review                       |
| `pages/profile.html`     | Shows profile information, aggregate statistics, progress, and history     |

## Exam behavior and scoring

The current demo builds an exam by repeating entries from small MCQ and short-answer sample pools until the requested question counts are reached.

- **MCQs:** an answer is correct only when it exactly matches the stored correct option.
- **Short answers:** the temporary prototype considers an answer correct when it contains at least 10 characters. This is only a UI demonstration and is not a meaningful academic evaluation.
- **Score:** `(correct answers / total questions) × 100`, rounded to the nearest integer.
- **Timer:** the duration is converted to seconds in the browser. Reaching zero triggers automatic submission.
- **Unanswered questions:** empty answers are marked incorrect.
- **Result review:** each entry displays the submitted answer, expected answer, explanation, and sample source location.

The production version should perform authoritative scoring on the server so users cannot alter answer keys or results through browser developer tools.

## Technology stack

### Current frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Web Storage API (`localStorage` and `sessionStorage`)

The frontend has no package-manager dependencies, frameworks, or build step.

### Proposed backend

- Python
- FastAPI
- LangChain
- MySQL
- An AI model for document understanding, question generation, and answer evaluation

## Getting started

### Prerequisites

You only need a modern web browser. A local static server is recommended so every page behaves consistently.

### Run locally

```bash
git clone https://github.com/abdulazizabid/QuizAi.git
cd QuizAi
python -m http.server 5500
```

Then visit [http://localhost:5500](http://localhost:5500).

If Python is unavailable, you can use any static server, such as the VS Code **Live Server** extension. Opening `index.html` directly also works for most of the current prototype.

### Try the complete demo flow

1. Open the landing page and select **Get Started**.
2. Enter sample registration details; no data is sent to a server.
3. Sign in with any values accepted by the browser's form validation.
4. From the dashboard, create a new exam and choose any local file.
5. Configure at least one question and start the exam.
6. Submit the exam and inspect the result and profile pages.

## Project structure

```text
QuizAi/
├── index.html                  # Landing page
├── pages/
│   ├── signup.html            # Registration interface
│   ├── signin.html            # Login interface
│   ├── dashboard.html         # Student overview
│   ├── create-exam.html       # Upload and exam configuration
│   ├── exam.html              # Timed examination interface
│   ├── result.html            # Score and answer review
│   └── profile.html           # Profile, statistics, and history
└── assets/
    ├── css/                   # Shared and page-specific styles
    └── js/
        ├── api.js             # Planned API configuration
        ├── auth.js            # Prototype authentication flow
        ├── create-exam.js     # File selection and configuration
        ├── exam.js            # Questions, timer, and scoring
        ├── result.js          # Result rendering and persistence
        ├── dashboard.js       # Dashboard sample data
        ├── profile.js         # History, statistics, and chart
        └── main.js            # Landing-page interactions
```

## Browser storage

The prototype uses these browser-storage keys:

| Key              | Storage          | Purpose                                           |
| ---------------- | ---------------- | ------------------------------------------------- |
| `examConfig`     | `sessionStorage` | Selected file name, question counts, and duration |
| `examResult`     | `sessionStorage` | Most recently submitted exam and question review  |
| `quizgenHistory` | `localStorage`   | Exam summaries displayed on the profile page      |

To reset the demo, clear the site's local and session storage in your browser's developer tools.

### Data limitations

- Data is specific to the current browser and device.
- `sessionStorage` is normally cleared when the browsing session ends.
- `localStorage` remains until it is explicitly cleared.
- Browser storage is not encrypted and must not contain passwords, access tokens, or sensitive uploaded content.
- The dashboard currently uses its own static sample dataset; saved result history appears on the profile page.

## Planned API

The frontend reserves `http://localhost:8000` as the backend base URL and anticipates endpoints similar to:

```text
POST /auth/register
POST /auth/login
GET  /users/me
POST /materials/upload
POST /exams/generate
GET  /exams/history
GET  /users/progress
```

These routes document the intended integration and are not implemented in this repository yet.

## Proposed backend architecture

The intended production request flow is:

1. The frontend authenticates a user and receives a secure session or short-lived access token.
2. A study document is uploaded to FastAPI using `multipart/form-data`.
3. The backend validates the file type and size, stores it safely, and extracts its text.
4. Extracted content is divided into manageable sections while preserving page or slide metadata.
5. LangChain coordinates prompts and model calls for topic selection and question generation.
6. Generated questions are validated for format, source support, duplication, and requested counts.
7. The exam is stored in MySQL and returned without exposing protected answer keys.
8. Submitted answers are evaluated on the server.
9. Results, explanations, source references, and progress statistics are stored and returned to the student.

### Suggested data entities

| Entity   | Example responsibilities                                             |
| -------- | -------------------------------------------------------------------- |
| User     | Identity, credentials, profile, and account timestamps               |
| Material | File metadata, owner, storage location, and processing status        |
| Exam     | Configuration, duration, generation status, and associated material  |
| Question | Type, prompt, options, answer key, explanation, and source reference |
| Attempt  | Start time, submission time, score, and auto-submission status       |
| Answer   | Student response, awarded result, and evaluator feedback             |

### Suggested environment variables

Backend secrets and deployment-specific configuration should be provided through environment variables and excluded from version control.

```env
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:3306/quizgen
AI_API_KEY=replace_with_your_key
JWT_SECRET=replace_with_a_long_random_value
ALLOWED_ORIGINS=http://localhost:5500
MAX_UPLOAD_SIZE_MB=20
```

The exact names may change when the backend is introduced. Commit a safe `.env.example`, but never commit a populated `.env` file.

## Backend integration notes

The frontend API base URL is currently declared in `assets/js/api.js`:

```js
const API_BASE_URL = "http://localhost:8000";
```

During integration, centralize network calls in that module and handle these states consistently:

- Loading and disabled controls while requests are running
- Invalid credentials and expired sessions
- Unsupported, empty, encrypted, or oversized documents
- Document-processing and AI-generation failures
- Slow generation with progress or polling feedback
- Network interruptions and safe retry behavior
- Backend validation messages
- Empty history and progress datasets

Avoid trusting question counts, scores, ownership IDs, file extensions, or answer correctness values supplied by the client.

## Security and privacy considerations

Because students may upload private course material, the production implementation should include:

- Server-side MIME-type, extension, and file-signature validation
- Strict upload-size and page-count limits
- Malware scanning and isolated document processing
- Per-user authorization for every material, exam, attempt, and result
- Password hashing with a modern password-hashing algorithm
- Short-lived authentication tokens or secure, HTTP-only session cookies
- Rate limiting for authentication, uploads, and AI generation
- Parameterized database access and validated request schemas
- Restricted CORS configuration and HTTPS in production
- Clear document-retention and deletion policies
- Logging that excludes passwords, document text, tokens, and AI keys
- Protection against prompt injection embedded in uploaded documents

## Accessibility goals

The interface should remain usable with a keyboard, screen reader, and zoomed display. Before production release, verify:

- Every form control has an associated accessible label.
- Focus indicators remain visible throughout keyboard navigation.
- Status and validation messages are announced appropriately.
- Timer changes do not overwhelm assistive technology.
- Color is not the only indicator for answered or correct questions.
- Text and interactive controls meet WCAG contrast requirements.
- Confirmation dialogs and result content have a logical focus order.

## Testing guide

There is no automated test suite yet. Use this manual checklist when changing the frontend:

### Authentication screens

- Confirm mismatched sign-up passwords show an error.
- Confirm matching passwords lead to the sign-in page.
- Confirm sign-in leads to the dashboard.

### Exam creation

- Confirm both file-picker and drag-and-drop selection display the file name.
- Confirm submission is blocked when no file is selected.
- Confirm submission is blocked when the total question count is zero.
- Confirm the summary updates as counts and duration change.

### Examination

- Confirm requested MCQ and short-answer counts are rendered.
- Confirm answers remain selected while navigating between questions.
- Confirm answered-state indicators update correctly.
- Confirm previous and next buttons are disabled at the boundaries.
- Confirm manual submission asks for confirmation.
- Confirm the timer submits automatically at zero.

### Results and profile

- Confirm scores and answer-review cards match the submitted answers.
- Confirm unsafe answer text is rendered as text, not executable HTML.
- Confirm a completed result is saved only once in history.
- Confirm profile totals, average, best score, chart, and table update.
- Confirm clearing browser storage resets persisted demo history.

Future automated coverage should include unit tests for scoring and state handling, API integration tests, accessibility checks, and an end-to-end test of the complete student workflow.

## Deployment

The current frontend can be hosted on any static-site platform, including GitHub Pages, Netlify, Cloudflare Pages, or an Nginx server.

For a GitHub Pages deployment from the `main` branch:

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and the `/ (root)` directory.
5. Save and wait for GitHub to publish the site URL.

Once the backend is connected, update `API_BASE_URL` for the deployed API, allow only the frontend's origin through CORS, enable HTTPS, and keep all secrets on the server.

## Roadmap

- [ ] Build FastAPI authentication and JWT-based sessions
- [ ] Store users, materials, exams, answers, and results in MySQL
- [ ] Parse uploaded PDF and slide content securely
- [ ] Generate non-repetitive MCQs and short questions from major topics
- [ ] Evaluate short answers with AI instead of a length heuristic
- [ ] Return concise explanations with accurate page or slide references
- [ ] Replace dashboard placeholder data with the authenticated user's data
- [ ] Add upload limits, file validation, error states, and accessibility testing
- [ ] Add automated frontend and backend tests
- [ ] Deploy the frontend, API, database, and AI integration
