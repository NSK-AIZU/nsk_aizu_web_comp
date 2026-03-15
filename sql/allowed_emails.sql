-- =============================================
-- 許可メールアドレス管理テーブル
-- Supabase SQL Editor で実行してください
-- =============================================

-- 1. テーブル作成
CREATE TABLE IF NOT EXISTS allowed_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,                    -- メモ用（誰のメールか）
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS（Row Level Security）を有効化
ALTER TABLE allowed_emails ENABLE ROW LEVEL SECURITY;

-- 3. 誰でも読み取れる（サインアップ時のチェック用）
CREATE POLICY "allowed_emails_select"
    ON allowed_emails FOR SELECT
    USING (true);

-- 4. 認証済みユーザーのみ追加・削除可能（管理用）
CREATE POLICY "allowed_emails_insert"
    ON allowed_emails FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "allowed_emails_delete"
    ON allowed_emails FOR DELETE
    TO authenticated
    USING (true);

-- 5. 許可するメールアドレスを登録（例）
-- ※ 必要に応じて追加・変更してください
INSERT INTO allowed_emails (email, name) VALUES
    ('learn5.tada@gmail.com', 'Tell'),
    ('nsk.aizu@gmail.com', 'NSK_AIZU')
ON CONFLICT (email) DO NOTHING;

-- 確認
SELECT * FROM allowed_emails;
