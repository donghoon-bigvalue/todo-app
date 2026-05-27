CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  login_id varchar(30) NOT NULL UNIQUE,
  nickname varchar(30) NOT NULL,
  email varchar(254) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE todos ADD COLUMN IF NOT EXISTS user_id text;
--> statement-breakpoint
ALTER TABLE todos
  ADD CONSTRAINT todos_user_id_users_id_fk
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  revoked_at timestamp,
  created_at timestamp NOT NULL,
  expires_at timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS email_verifications (
  id text PRIMARY KEY,
  email varchar(254) NOT NULL,
  code varchar(6) NOT NULL,
  purpose varchar(32) NOT NULL,
  used_at timestamp,
  created_at timestamp NOT NULL,
  expires_at timestamp NOT NULL
);
