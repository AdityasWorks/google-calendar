-- Drop existing tables
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Simple users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Insert default user
INSERT INTO users (email, name) VALUES 
('user@example.com', 'Default User')
ON CONFLICT (email) DO NOTHING;
