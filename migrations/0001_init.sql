-- migrations/0001_init.sql

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  provider TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 구독 테이블
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  plan TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'monthly' | 'yearly'
  status TEXT NOT NULL DEFAULT 'active',
  toss_billing_key TEXT,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 글쓰기 기록 (기록 정원)
CREATE TABLE IF NOT EXISTS writings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  length INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 사운드 프리셋 (소리 정원)
CREATE TABLE IF NOT EXISTS sound_presets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  layers TEXT NOT NULL, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
