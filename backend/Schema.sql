-- Enable UUID gen if you don't already have it
-- Consolidated schema for OnBoarding-panel
-- Enables gen_random_uuid() via pgcrypto. Creating extensions requires appropriate DB privileges.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (required by auth flow)
CREATE TABLE IF NOT EXISTS public.users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text        NOT NULL,
  email          text        NOT NULL,
  password_hash  text        NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Ensure email uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS users_email_uidx ON public.users (email);


-- Refresh tokens table (FK to users)
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash  text        NOT NULL,
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  revoked     boolean     NOT NULL DEFAULT false
);

-- Indexes for refresh tokens
CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_token_hash_uidx ON public.refresh_tokens (token_hash);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON public.refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_expires_at_idx ON public.refresh_tokens (expires_at);


-- Community table
CREATE TABLE IF NOT EXISTS public.community (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          varchar(500)      NOT NULL,
  category      varchar(100)      NOT NULL,
  sub_category  text              NOT NULL,
  description   varchar(1000)     NOT NULL,
  contact       varchar(100)      NOT NULL,
  email         varchar(255)      NOT NULL,
  address       text              NOT NULL,
  in_charge     text              NOT NULL,
  social_links  json              NOT NULL,
  logo          varchar(255),
  image         varchar(255),
  created_at    timestamptz       NOT NULL DEFAULT now()
);

-- Helpful indexes for community
CREATE INDEX IF NOT EXISTS community_category_idx ON public.community (category);
CREATE INDEX IF NOT EXISTS community_created_at_idx ON public.community (created_at DESC);


-- Events table (aligned with backend Model/Controller)
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name varchar(255) NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  cost varchar(50) NOT NULL,
  event_image varchar(255) NOT NULL,
  location varchar(255) NOT NULL,
  contact jsonb NOT NULL,
  category varchar(100) NOT NULL,
  sub_category varchar(100) NOT NULL,
  social_links jsonb,
  status varchar(20) NOT NULL DEFAULT 'upcoming',
  created_at timestamptz NOT NULL DEFAULT now(),
  priority boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for events
CREATE INDEX IF NOT EXISTS events_category_idx ON public.events (category);
CREATE INDEX IF NOT EXISTS events_status_idx ON public.events (status);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON public.events (created_at DESC);
