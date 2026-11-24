alter table messages add column if not exists kind text not null default 'agent';
