create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text not null,
  model text,
  system text,
  use_case text,
  version text,
  file_path text not null,
  power_level smallint not null default 50,
  classification_tier smallint not null default 3,
  acknowledgment_question text not null default 'Have you read and understood this document?',
  published_at date not null default current_date
);

create table read_receipts (
  document_id uuid references documents(id) on delete cascade,
  reader_name text not null,
  has_read boolean not null default false,
  responded_at date,
  primary key (document_id, reader_name)
);

alter table documents enable row level security;
alter table read_receipts enable row level security;

-- Permissive policies for now (no login yet). Tighten these once
-- Discord auth is wired up, so only real org members can insert/update.
create policy "anyone can read documents" on documents for select using (true);
create policy "anyone can insert documents" on documents for insert with check (true);

create policy "anyone can read receipts" on read_receipts for select using (true);
create policy "anyone can insert receipts" on read_receipts for insert with check (true);
create policy "anyone can update receipts" on read_receipts for update using (true);

create policy "anyone can upload to documents bucket" on storage.objects
  for insert with check (bucket_id = 'documents');

create policy "anyone can read documents bucket" on storage.objects
  for select using (bucket_id = 'documents');
