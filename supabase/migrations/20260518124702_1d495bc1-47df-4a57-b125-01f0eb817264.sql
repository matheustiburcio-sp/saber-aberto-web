
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_slug text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (user_id, program_slug)
);

alter table public.enrollments enable row level security;

create policy "Users view own enrollments"
  on public.enrollments for select
  to authenticated using (auth.uid() = user_id);

create policy "Users create own enrollments"
  on public.enrollments for insert
  to authenticated with check (auth.uid() = user_id);

create policy "Users delete own enrollments"
  on public.enrollments for delete
  to authenticated using (auth.uid() = user_id);
