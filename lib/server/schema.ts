// PostgreSQL tables for the email module. Also published as db/schema.sql for database admins.
// Every statement is idempotent, so it runs safely on each server start.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS email_configuration (
  key               text PRIMARY KEY DEFAULT 'default',
  provider          text NOT NULL DEFAULT 'microsoft365',
  host              text NOT NULL DEFAULT 'smtp.office365.com',
  port              integer NOT NULL DEFAULT 587,
  security          text NOT NULL DEFAULT 'STARTTLS',
  auth_type         text NOT NULL DEFAULT 'oauth2',
  username          text NOT NULL DEFAULT '',
  sender_email      text NOT NULL DEFAULT '',
  sender_name       text NOT NULL DEFAULT 'Hawyia Premium',
  notify_emails     text[] NOT NULL DEFAULT '{}',
  enabled           boolean NOT NULL DEFAULT true,
  tenant_id         text NOT NULL DEFAULT '',
  client_id         text NOT NULL DEFAULT '',
  object_id         text NOT NULL DEFAULT '',
  client_secret_enc jsonb,
  secret_updated_at timestamptz,
  last_test         jsonb,
  updated_by        text NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_templates (
  id          bigserial PRIMARY KEY,
  key         text NOT NULL UNIQUE,
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  subject     text NOT NULL,
  html        text NOT NULL,
  text        text NOT NULL DEFAULT '',
  variables   text[] NOT NULL DEFAULT '{}',
  enabled     boolean NOT NULL DEFAULT true,
  system      boolean NOT NULL DEFAULT false,
  updated_by  text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id            bigserial PRIMARY KEY,
  recipients    text[] NOT NULL,
  subject       text NOT NULL DEFAULT '',
  template_key  text NOT NULL DEFAULT '',
  status        text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  error         text NOT NULL DEFAULT '',
  attempts      integer NOT NULL DEFAULT 0,
  next_retry_at timestamptz,
  message_id    text NOT NULL DEFAULT '',
  source        text NOT NULL DEFAULT '',
  sent_at       timestamptz,
  message       jsonb,          -- what was sent (reply-to, html, text, attachments), never credentials
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_logs_created_at_idx ON email_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS email_logs_status_idx ON email_logs (status);
CREATE INDEX IF NOT EXISTS email_logs_retry_idx ON email_logs (next_retry_at) WHERE status = 'failed';

CREATE TABLE IF NOT EXISTS audit_logs (
  id         bigserial PRIMARY KEY,
  actor      text NOT NULL,
  action     text NOT NULL,
  target     text NOT NULL DEFAULT '',
  fields     text[] NOT NULL DEFAULT '{}',   -- names of what changed, never secret values
  ip         text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  key        text PRIMARY KEY,
  count      integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limits_expires_at_idx ON rate_limits (expires_at);
`;
