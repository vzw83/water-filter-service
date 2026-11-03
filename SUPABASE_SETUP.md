# Supabase setup for reviews and the owner admin

Clients do not create accounts. They can submit a name, a 1–10 rating, a comment, and an optional photo. Reviews remain pending until an admin approves them.

## 1. Create the Supabase project

Create a project at [supabase.com](https://supabase.com/). In **Project Settings → API**, copy the Project URL and the public publishable key (or legacy `anon` key). These values are safe to expose when the database policies below are applied. Never put a `service_role` or secret key in the website.

## 2. Create the database, photo bucket, and visit statistics

Open **SQL Editor** in the Supabase dashboard and run both files from `supabase/migrations/` in filename order:

1. `20261103000000_reviews_and_admin.sql`
2. `20261103001000_site_visits.sql`

The second migration adds the visit counter and admin-only statistics function. It counts one visit per browser tab session and does not store IP addresses.

## 3. Configure local development

Copy `.env.example` to `.env.local`, replace both example values with your project values, then restart `npm run dev`.

Open `/reviews/admin`, choose **Создать аккаунт владельца**, and register using your email and a strong password. Confirm the email if Supabase asks you to.

## 4. Grant the first admin account

In the SQL Editor, run this query after replacing the address with the email used during registration:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = lower('owner@example.com')
on conflict do nothing;
```

Sign in at `/reviews/admin`. Only accounts listed in `public.admin_users` can read pending reviews or moderate them. Registration by itself never grants admin access.

After the owner account is ready, turn off public sign-ups in **Authentication → Settings** if you do not need to create more accounts. Client reviews do not use Supabase Auth.

## 5. Configure GitHub Pages

Add repository Actions secrets named `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, using the same Project URL and public key. The GitHub Pages workflow reads these during the static build. Add the production website URL to Supabase Auth's allowed redirect URLs so email confirmation can return to `/reviews/admin`.

The public key is included in the site bundle by design. Security comes from Row Level Security policies in the SQL migration, not from hiding that key.
