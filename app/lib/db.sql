-- Drop existing tables
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (simplified for JWT-based auth)
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);



-- Events table (updated to use TEXT id for user_id)
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location VARCHAR(255),
  color VARCHAR(7) DEFAULT '#4285f4',
  is_all_day BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_user_time ON events(user_id, start_time, end_time);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_users_email ON users(email);

