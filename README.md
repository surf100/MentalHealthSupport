# SafeSpace — Bullying Reporting & Mental Health Support Platform

A full-stack web platform where students can anonymously report bullying, access mental health resources, participate in a support forum, and receive help from moderators.

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Recharts |
| Backend  | Java 17, Spring Boot 3.5, Spring Security, JWT  |
| Database | PostgreSQL 17                                   |
| Build    | Maven, pnpm                                     |

---

## Prerequisites

Make sure you have the following installed before running the project.

### Backend requirements

| Tool         | Version  | Download                                      |
|--------------|----------|-----------------------------------------------|
| Java JDK     | 17+      | https://adoptium.net                          |
| Maven        | 3.9+     | https://maven.apache.org/download.cgi         |
| PostgreSQL   | 15+      | https://www.postgresql.org/download           |

Verify installations:
```bash
java -version
mvn -version
psql --version
```

### Frontend requirements

| Tool  | Version | Download                        |
|-------|---------|---------------------------------|
| Node  | 24+     | https://nodejs.org              |
| pnpm  | latest  | https://pnpm.io/installation    |

Verify installations:
```bash
node --version
pnpm --version
```

Install pnpm if you don't have it:
```bash
npm install -g pnpm
```

---

## Database Setup

### 1. Start PostgreSQL and open psql or pgAdmin

### 2. Create the database

```sql
CREATE DATABASE mental_health_platform;
```

### 3. Create all tables

Connect to the database and run the following SQL:

```sql
\c mental_health_platform
```

```sql
-- Users
CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    nickname      VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'USER',
    status        VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMP    NOT NULL,
    updated_at    TIMESTAMP    NOT NULL
);

-- Profiles
CREATE TABLE profiles (
    id                     BIGSERIAL PRIMARY KEY,
    user_id                BIGINT       NOT NULL UNIQUE REFERENCES users(id),
    display_name           VARCHAR(255),
    bio                    TEXT,
    avatar_url             VARCHAR(255),
    privacy_mode_enabled   BOOLEAN      NOT NULL DEFAULT FALSE,
    notifications_enabled  BOOLEAN      NOT NULL DEFAULT TRUE,
    theme_preference       VARCHAR(50)  NOT NULL DEFAULT 'light',
    language_preference    VARCHAR(50)  NOT NULL DEFAULT 'en',
    created_at             TIMESTAMP    NOT NULL,
    updated_at             TIMESTAMP    NOT NULL
);

-- Reports
CREATE TABLE reports (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT        NOT NULL REFERENCES users(id),
    title        VARCHAR(255)  NOT NULL,
    description  VARCHAR(5000) NOT NULL,
    category     VARCHAR(50)   NOT NULL,
    status       VARCHAR(50)   NOT NULL DEFAULT 'SUBMITTED',
    is_anonymous BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP     NOT NULL,
    updated_at   TIMESTAMP     NOT NULL
);

-- Report status history (timeline)
CREATE TABLE report_status_history (
    id          BIGSERIAL PRIMARY KEY,
    report_id   BIGINT        NOT NULL REFERENCES reports(id),
    status      VARCHAR(50)   NOT NULL,
    title       VARCHAR(255)  NOT NULL,
    description VARCHAR(1000) NOT NULL,
    occurred_at TIMESTAMP     NOT NULL
);

-- Notifications
CREATE TABLE notifications (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id),
    title      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    type       VARCHAR(50)  NOT NULL,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL
);

-- Forum posts
CREATE TABLE forum_posts (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT       NOT NULL REFERENCES users(id),
    title        VARCHAR(255) NOT NULL,
    content      TEXT         NOT NULL,
    category     VARCHAR(100) NOT NULL,
    is_anonymous BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL
);

-- Forum comments
CREATE TABLE forum_comments (
    id           BIGSERIAL PRIMARY KEY,
    post_id      BIGINT    NOT NULL REFERENCES forum_posts(id),
    user_id      BIGINT    NOT NULL REFERENCES users(id),
    content      TEXT      NOT NULL,
    is_anonymous BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL,
    updated_at   TIMESTAMP NOT NULL
);

-- Forum post likes
CREATE TABLE forum_post_likes (
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT    NOT NULL REFERENCES forum_posts(id),
    user_id    BIGINT    NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    UNIQUE (post_id, user_id)
);

-- Audit log
CREATE TABLE audit_log (
    id          BIGSERIAL PRIMARY KEY,
    actor_id    BIGINT        NOT NULL REFERENCES users(id),
    action      VARCHAR(50)   NOT NULL,
    target      VARCHAR(255)  NOT NULL,
    details     VARCHAR(1000) NOT NULL,
    occurred_at TIMESTAMP     NOT NULL
);
```

### 4. Create an admin user (optional but recommended for testing)

```sql
-- Password is: admin123 (bcrypt hash)
INSERT INTO users (email, nickname, password_hash, role, status, created_at, updated_at)
VALUES (
    'admin@safespace.app',
    'Admin',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'ADMIN',
    'ACTIVE',
    NOW(),
    NOW()
);
```

---

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/safespace.git
cd safespace
```

### 2. Configure the database connection

Open `backend/src/main/resources/application.yaml` and set your credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mental_health_platform
    username: postgres        # your PostgreSQL username
    password: 1234            # your PostgreSQL password
```

> **Important:** `ddl-auto: validate` means Hibernate will NOT create tables automatically.
> You must run the SQL from the Database Setup section above first.

### 2.1 Configure local MentalBERT moderation

This project now expects a local model service for forum risk analysis.

The backend calls a local HTTP service at:

```bash
MENTALBERT_SERVICE_URL=http://localhost:8001
```

The included Python service in `ml-service/` loads a real Hugging Face sequence-classification
checkpoint locally. By default it uses:

```bash
MENTALBERT_MODEL_ID=slimshady07/Mental_BERT
```

You can also point `MENTALBERT_MODEL_ID` to a local filesystem path if you already downloaded
the model and want fully offline startup.

### 2.2 Start the MentalBERT service

Open a separate terminal:

```bash
cd ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001
```

Then start the Spring backend normally. New forum posts will be sent to the local MentalBERT
service in the background and flagged for moderator review when the model returns high risk.

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start at **http://localhost:8080**

To verify, open: http://localhost:8080/api/auth/me (should return 401 — that means it's running)

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
pnpm install
```

### 2. Run the frontend

```bash
pnpm dev
```

The frontend will start at **http://localhost:5173**

---

## Running the Full Project

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

Then open **http://localhost:5173** in your browser.

---

## Environment Overview

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:8080      |
| Database | localhost:5432             |

---

## Project Structure

```
safespace/
├── backend/                          # Spring Boot application
│   └── src/main/java/com/mentalhealth/platform/
│       ├── auth/                     # Authentication (sign-in, sign-up, JWT)
│       ├── user/                     # User entity, roles, status
│       ├── profile/                  # User profiles
│       ├── dashboard/                # Dashboard stats
│       ├── notification/             # Notifications
│       ├── report/                   # Anonymous reports + timeline
│       ├── forum/                    # Forum posts, comments, likes
│       ├── admin/                    # Admin panel, audit log, analytics
│       ├── achievement/              # Gamification achievements
│       ├── security/                 # JWT filter, UserDetailsService
│       └── common/                   # Exceptions, error responses
│
└── frontend/                         # React + Vite application
    └── src/app/
        ├── pages/                    # All page components
        ├── components/               # Header, Footer, route guards
        ├── api/                      # API layer (fetch calls)
        ├── auth/                     # Auth context, useAuth hook
        └── lib/                      # Token storage utilities
```

---

## Key Features

- **Anonymous Reports** — students submit bullying/harassment reports anonymously
- **Support Forum** — community posts with comments, likes, and categories
- **Knowledge Base** — mental health articles and crisis resources
- **Achievements** — gamification badges earned through platform activity
- **Notifications** — system notifications with read/unread state
- **Admin Panel** — user management, ban/unban, role assignment, audit log
- **Analytics Dashboard** — report trends, category breakdown, platform stats
- **JWT Authentication** — secure login with Bearer token

---

## Notes

- JWT secret and expiration are configured in `application.yaml`
- All `/api/admin/**` endpoints require `ADMIN` role
- All `/api/**` protected endpoints require a valid Bearer token
- The frontend stores the token in `localStorage`
