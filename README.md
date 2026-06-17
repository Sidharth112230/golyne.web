# Golyne — Admin Panel Setup

This adds a password-protected admin panel at `/admin` for adding, editing, and
deleting the services shown on your homepage and service pages — without
touching any code.

## What changed

- `index.html` and `service.html` — service cards/content now load live from
  `/api/services` instead of being hardcoded.
- `api/login.js` — checks the admin password and issues a session token.
- `api/services.js` — stores all service data in Vercel KV. `GET` is public
  (the live site needs it). `POST` / `PUT` / `DELETE` require a valid admin
  session token.
- `admin/index.html` — the admin panel itself.
- `package.json` — added the `@vercel/kv` dependency.

Icons were simplified from custom SVGs/images to emoji so every field is
plain text — no code or image uploads needed to add a new service.

## Setup steps (one-time)

### 1. Push these files to your GitHub repo
Replace your existing `index.html` and `service.html`, and add the new
`api/`, `admin/`, `package.json`, and this `README.md`. Push to the branch
your Vercel project deploys from. Vercel will start a deployment automatically
— it will fail at this point, that's expected, continue to step 2.

### 2. Add a Vercel KV database
In your Vercel dashboard:
- Open your project → **Storage** tab → **Create Database** → choose **KV**.
- Give it a name and create it.
- When asked which project(s) to connect it to, select this project, for all
  environments (Production, Preview, Development).

This automatically adds the environment variables your `api/services.js`
needs (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.) — you don't need to set
those manually.

### 3. Set your admin password
In your Vercel dashboard:
- **Settings** → **Environment Variables**.
- Add `ADMIN_PASSWORD` = a password of your choice.
- Add `SESSION_SECRET` = any other random string (used to sign login
  sessions — can be anything, just keep it private). If you skip this,
  `ADMIN_PASSWORD` is reused as the signing secret, which still works fine.
- Apply both to **Production** (and Preview/Development if you also test
  there).

### 4. Redeploy
Go to **Deployments** → click the **⋯** menu on the latest deployment →
**Redeploy**. This picks up the new environment variables and database
connection.

### 5. Log in
Visit `yourdomain.com/admin`, enter the password you set in step 3, and you're in.

The first time `/api/services` is called (e.g. when your homepage loads, or
when you open `/admin`), it automatically seeds the database with your
original 8 services, so nothing is lost.

## Using the admin panel

- **Add Service** — opens a form for all fields: name, tagline, icon (type
  any emoji), colors, pricing, the full service-page content (description,
  included items, process steps, results, FAQs).
- **Edit** — same form, pre-filled. The page ID (used in the URL, e.g.
  `service.html?service=website`) can't be changed after creation — delete
  and re-add if you need a different one.
- **Delete** — removes the service from both the homepage grid and stops its
  service page from resolving (visitors see a "Service Not Found" page).
- Changes are **live immediately** — no redeploy needed. Visitors browsing
  your site will see updates the next time they load a page.

## Notes & limits

- Anyone can read `/api/services` (this is intentional — it's the same data
  already shown publicly on your site). Only the write operations
  (add/edit/delete) require the admin password.
- Sessions last 12 hours, then you'll need to log in again.
- To change the password later, just update `ADMIN_PASSWORD` in Vercel and
  redeploy.
- Icons are emoji-only by design (so adding a service never requires
  touching code or uploading files). If you want custom image icons later,
  that's a bigger change involving file storage (e.g. Vercel Blob) — happy
  to help with that separately if you want it.
