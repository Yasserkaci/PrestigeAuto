# Supabase Setup

This project uses [Supabase](https://supabase.com) for the cars database, image storage, and admin authentication. Follow these steps once per project.

---

## 1. Create your project

1. Go to [supabase.com](https://supabase.com), create a new project.
2. Once provisioned, open **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Create a `.env.local` file at the project root (copy from `.env.example`):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

> Restart `npm run dev` after editing env files.

---

## 2. Create the `cars` table

Open **SQL Editor** in the Supabase dashboard and run:

```sql
create table public.cars (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text not null,
  image_path  text not null,
  created_at  timestamptz not null default now()
);

-- Index for sorting by newest
create index cars_created_at_idx on public.cars (created_at desc);
```

---

## 3. Enable Row Level Security (RLS)

```sql
alter table public.cars enable row level security;

-- Anyone (including unauthenticated visitors) can read the fleet
create policy "Public read"
  on public.cars
  for select
  to anon, authenticated
  using (true);

-- Only authenticated admins can write
create policy "Authenticated insert"
  on public.cars
  for insert
  to authenticated
  with check (true);

create policy "Authenticated update"
  on public.cars
  for update
  to authenticated
  using (true);

create policy "Authenticated delete"
  on public.cars
  for delete
  to authenticated
  using (true);
```

---

## 4. Create the Storage bucket

1. Go to **Storage → New bucket**.
2. Name it exactly `cars` (must match `CARS_BUCKET` in [src/lib/supabase.js](src/lib/supabase.js)).
3. Toggle **Public bucket** ON (so the homepage slider can show images without signed URLs).

Then add storage policies in the SQL editor:

```sql
-- Public can view files
create policy "Public read storage"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'cars');

-- Authenticated can upload
create policy "Authenticated upload storage"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'cars');

-- Authenticated can delete
create policy "Authenticated delete storage"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'cars');
```

---

## 5. Create your admin user

1. Go to **Authentication → Users → Add user → Create new user**.
2. Set an email + password. Toggle **Auto Confirm User** ON so you don't need to verify by email.
3. (Optional) Disable open sign-ups: **Authentication → Providers → Email** → turn off **Enable sign-ups**. This locks the system to only the admin user(s) you create manually in the dashboard.

You can now sign in at `/login` with that email + password.

---

## 6. Verify

| Check                                                  | Where                        |
| ------------------------------------------------------ | ---------------------------- |
| Homepage `#cars` section loads (empty state OK)        | `/`                          |
| `/login` accepts your admin credentials                | `/login`                     |
| `/admin` redirects to `/login` when signed out         | `/admin` (incognito tab)     |
| Uploading a car creates a row + a file in the `cars` bucket | Admin form → Inventory grid |
| Deleting a car removes the row and the storage object  | Admin grid → Delete button   |
| The new car appears in the homepage slider             | `/#cars`                     |

---

## Troubleshooting

- **"new row violates row-level security policy"** when uploading → you forgot to add the storage policies in step 4, or you're not signed in.
- **Image fails to load on the homepage** → the bucket isn't public. Toggle "Public bucket" in Storage settings.
- **Sign-in works locally but the admin page redirects back to login** → check that the env vars are loaded (`console.log(import.meta.env.VITE_SUPABASE_URL)` in the browser). Vite only exposes vars prefixed with `VITE_`.
