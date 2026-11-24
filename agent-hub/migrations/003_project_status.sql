create table if not exists project_status (
  project text primary key,
  status text not null default 'in_progress',
  summary text not null default '',
  updated_by text not null default '',
  updated_at timestamptz not null default now()
);
