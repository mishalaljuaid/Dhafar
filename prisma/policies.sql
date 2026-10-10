-- جدول السياسات واللوائح (PostgreSQL / Supabase)
-- يُنفَّذ مرة واحدة من: Supabase > SQL Editor
CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    pdf_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- منع الوصول للجدول عبر واجهة Supabase العامة (الموقع يتصل مباشرة ولا يتأثر)
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
