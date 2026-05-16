-- supabase/migrations/initial_schema.sql

-- Custom Enums
CREATE TYPE source_type AS ENUM ('rss', 'scrape', 'twitter', 'facebook', 'reddit');
CREATE TYPE news_category AS ENUM ('TCG', 'Figures', 'Watches', 'general');
CREATE TYPE alert_type AS ENUM ('email', 'push', 'both');
CREATE TYPE scrape_status AS ENUM ('success', 'error', 'skipped');

-- Table: news_items
CREATE TABLE news_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary_short TEXT,
    summary_full TEXT,
    content_raw TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_type source_type NOT NULL,
    category news_category NOT NULL,
    sub_category TEXT,
    hype_score INT2 DEFAULT 0 CHECK (hype_score >= 0 AND hype_score <= 10),
    engagement_count INT4 DEFAULT 0,
    image_url TEXT,
    thumbnail_url TEXT,
    is_drop_alert BOOLEAN DEFAULT FALSE,
    is_restock BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    affiliate_links JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT '{}'::text[],
    processing_status TEXT DEFAULT 'pending_ai',
    published_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for fast sorting by hype and published date
CREATE INDEX idx_news_items_hype ON news_items(hype_score DESC);
CREATE INDEX idx_news_items_published ON news_items(published_at DESC);
CREATE INDEX idx_news_items_category ON news_items(category);

-- Enable RLS
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Add read policy for anon users
CREATE POLICY "Public profiles are viewable by everyone."
ON news_items FOR SELECT
USING ( true );
