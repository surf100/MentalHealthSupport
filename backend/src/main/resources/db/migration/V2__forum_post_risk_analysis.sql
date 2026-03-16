ALTER TABLE forum_posts
    ADD COLUMN sentiment_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN risk_score INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    ADD COLUMN moderation_status VARCHAR(40) NOT NULL DEFAULT 'PENDING_ANALYSIS',
    ADD COLUMN flagged_for_review BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN risk_summary VARCHAR(500),
    ADD COLUMN moderation_notes VARCHAR(1000),
    ADD COLUMN analyzed_at TIMESTAMP,
    ADD COLUMN reviewed_at TIMESTAMP,
    ADD COLUMN specialist_referred_at TIMESTAMP;

CREATE INDEX idx_forum_posts_flagged_risk
    ON forum_posts (flagged_for_review, risk_score, created_at);
