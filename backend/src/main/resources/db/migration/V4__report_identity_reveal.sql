ALTER TABLE reports
    ADD COLUMN identity_revealed_to_specialist BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN identity_revealed_at TIMESTAMP;
