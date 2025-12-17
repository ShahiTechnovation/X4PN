# Moving to Supabase

The current application relies on a standard PostgreSQL database. You can easily switch from the local Dockerized Postgres to Supabase (a managed Postgres provider) without changing code—configure the environment variables.

## Prerequisites
1.  A [Supabase](https://supabase.com/) account.
2.  A new Supabase Project.

## Steps

### 1. Get Connection String
1.  Go to your Supabase Project Dashboard.
2.  Navigate to **Settings** -> **Database**.
3.  Under **Connection arguments**, find the **URI** or **Connection String**.
4.  It will look like this: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
    *   **Note**: Use port `5432` (Session mode) or `6543` (Transaction Pooler). For this app, `5432` is usually fine, but `6543` is better if you deploy to serverless (like Vercel).

### 2. Update Environment Variables
Edit your `.env` file (or create one) in the root of the project:

```bash
# Comment out the local Docker URL
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/x4pn_vpn

# Add your Supabase URL
DATABASE_URL=postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:5432/postgres?sslmode=require
```
*Make sure to append `?sslmode=require` if it's not present.*

### 3. Push Database Schema
Once the `.env` is updated, run the schema push command to create tables in Supabase:

```bash
npm run db:push
```

### 4. Verify
Run the development server. It will now connect to Supabase instead of your local Docker container.

```bash
npm run dev
```

## Optional: Using Supabase Client SDK
If you want to use Supabase features like **Realtime Subscriptions** (replacing parts of our custom Socket.IO logic) or **Auth**, you would need to install the client:

```bash
npm install @supabase/supabase-js
```

But for simply hosting the database, the steps above are all you need!
