create table if not exists messages (
  id bigserial primary key,
  project text not null,
  sender text not null,
  device text not null default 'unknown',
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_project_id on messages (project, id);

create table if not exists claims (
  id bigserial primary key,
  project text not null,
  path text not null,
  agent text not null,
  device text not null default 'unknown',
  note text not null default '',
  created_at timestamptz not null default now(),
  released_at timestamptz
);
create index if not exists claims_project_open on claims (project) where released_at is null;
