CREATE TABLE IF NOT EXISTS todos (
  id text PRIMARY KEY,
  title varchar(100) NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL
);
