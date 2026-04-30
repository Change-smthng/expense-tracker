CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    idempotency_key VARCHAR NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_expenses_user_id ON expenses (user_id);
CREATE INDEX IF NOT EXISTS ix_expenses_category ON expenses (category);
CREATE INDEX IF NOT EXISTS ix_expenses_date ON expenses (date);
CREATE INDEX IF NOT EXISTS ix_expenses_idempotency_key ON expenses (idempotency_key);
