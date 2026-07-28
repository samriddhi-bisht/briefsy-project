-- Briefsy database schema
-- Run once against a fresh database: psql -U <user> -d briefsy_db -f schema.sql
-- (or it runs automatically via `npm run seed`, see src/seed/seed.js)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    domain_interest VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    source VARCHAR(100),
    category VARCHAR(50),
    url TEXT UNIQUE,
    image_url TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS povs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    pov_type VARCHAR(30) NOT NULL DEFAULT 'personal'
        CHECK (pov_type IN ('supporting', 'critical', 'neutral', 'personal')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_povs_article ON povs(article_id);

CREATE TABLE IF NOT EXISTS pov_votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pov_id INTEGER NOT NULL REFERENCES povs(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, pov_id)
);

CREATE TABLE IF NOT EXISTS fetch_logs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_fetched INTEGER DEFAULT 0,
    inserted_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
