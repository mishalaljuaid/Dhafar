-- جدول أعضاء المجلس التنفيذي (PostgreSQL / Supabase)
-- يُنفَّذ مرة واحدة من: Supabase > SQL Editor
CREATE TABLE IF NOT EXISTS executive_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    image TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE executive_members ENABLE ROW LEVEL SECURITY;
