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