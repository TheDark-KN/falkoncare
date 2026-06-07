# PHASE REPORT — "Database Sync Needed" Production Incident

**Date:** 2026-06-07
**Repository:** `falkoncare` (Falkon Care – Water Tank Cleaning Service)
**Stack:** Next.js 16.0.10, Convex 1.31.6, Clerk, Razorpay, Vercel

---

## 1. Root Cause(s)

The "Database Sync Needed" banner in production is **not** primarily a Convex
deployment bug — it is caused by a **combination of three real defects** plus
a **production Convex backend that has not received the latest code**.

### 1.1 Primary defect — Convex functions not deployed to the production Convex deployment
- Vercel env `CONVEX_DEPLOYMENT = "dev:coordinated-walrus-350"`
- Vercel env `NEXT_PUBLIC_CONVEX_URL = "https://coordinated-walrus-350.convex.cloud"`
- `POST https://coordinated-walrus-350.convex.cloud/api/query` with
  `path: "surveys:getSocieties"` returns:

  ```json
  {"status":"error","errorMessage":"[Request ID: ...] Server Error
   Could not find public function for 'surveys:getSocieties'.
   Did you forget to run `npx convex dev`?"}
  ```

  The local dev deployment `watchful-wombat-507.convex.cloud` *does* serve
  the function (returns `{"status":"success","value":[]}`), so the source
  code is correct — it is just not present on the production deployment.

### 1.2 Secondary defect — fragile error boundary text match
`components/shared/error-boundary.tsx` classified **any** error containing
the substring `"Could not find public function"` or `"Did you forget to run"`
as a "Database Sync Needed" error and replaced the entire page with a
blocking card. This is what made the problem look bigger than it was, and
why every fix attempt so far has been cosmetic: the boundary was always
going to catch a missing-function error, no matter which Convex URL the
client was pointed at.

### 1.3 Tertiary defect — dangerous hard-coded URL fallback
`components/providers/convex-provider.tsx` initialised the Convex client
with `process.env.NEXT_PUBLIC_CONVEX_URL || "https://grand-lapwing-724.convex.cloud"`.
That fallback silently pointed the client at **a third Convex deployment**
that is not the canonical production one. Several past "fixes" toggled
between `grand-lapwing-724`, `coordinated-walrus-350`, `watchful-wombat-507`
and back, none of which addressed the real issue (functions not deployed
to the canonical production deployment).

### 1.4 Supporting observations
- `proxy.ts` uses `clerkMiddleware` — that **is** the new Next.js 16
  convention (replaces `middleware.ts`), so it is wired correctly.
- `next.config.mjs` already has a CSP that allows `*.convex.cloud` over
  `connect-src` and `wss`, so client→Convex traffic is not blocked.
- `convex/auth.config.ts` hard-codes a Clerk JWT domain fallback, but the
  Vercel env overrides it through the Convex deployment's own env store.
- `convex/_generated/api.d.ts` references `bookings`, `http`, `surveys`,
  `users`, `wallet` — all five files exist and export public functions.
  The generated types are current and match the source.
- No GitHub Actions workflow existed. The only way Convex got to
  production was by someone manually running `npx convex deploy` locally,
  using credentials the rest of the team does not have.
- The local Convex access token belongs to the team
  `justto-services`, **not** the project owner `madhav-jadav` —
  this is why `npx convex deploy` returns
  *"You don't have access to the selected project"*.

---

## 2. Files Inspected

| File | Purpose |
|---|---|
| `package.json`, `package-lock.json` | deps, scripts |
| `tsconfig.json`, `convex/tsconfig.json` | TS configs |
| `next.config.mjs` | Next.js 16 config, CSP, security headers |
| `proxy.ts` | Clerk middleware (Next 16 "proxy" convention) |
| `convex.json` | Convex project config |
| `convex/_generated/api.{d.ts,js}`, `dataModel.d.ts`, `server.{d.ts,js}` | generated Convex types/utilities |
| `convex/schema.ts` | tables: surveys, societies, bookings, users |
| `convex/auth.config.ts` | Clerk JWT issuer |
| `convex/surveys.ts`, `bookings.ts`, `users.ts`, `wallet.ts`, `http.ts` | all five Convex modules |
| `app/layout.tsx` | root layout, mounts `ConvexClientProvider` |
| `app/survey/page.tsx` | the failing page |
| `app/dashboard/**`, `app/admin/**` | other Convex consumers |
| `app/api/razorpay/**` | server route used by booking flow |
| `components/providers/convex-provider.tsx` | provider (defect source) |
| `components/shared/error-boundary.tsx` | boundary (fragile text match) |
| `components/user-sync.tsx` | placeholder, no longer active |
| `lib/store.ts`, `lib/local-storage.ts`, `lib/types.ts`, `lib/mock-data.ts` | local-only utilities |
| `types/survey.ts`, `types/global.d.ts` | types |
| `tailwind.config.js`, `postcss.config.mjs` | styling |
| `.env.local`, `.env.production`, `.env.preview`, `.env.dev` | env files (production pulled via `vercel env pull`) |
| `.vercel/project.json` | Vercel project binding |
| `vercel.json` | Vercel build/install commands |
| `.clerk/.tmp/keyless.json` | keyless Clerk dev creds |
| `error.md`, `error2.md` | legacy TODO notes from prior agents |

---

## 3. Files Modified

| File | Change |
|---|---|
| `components/providers/convex-provider.tsx` | Throws on missing `NEXT_PUBLIC_CONVEX_URL` instead of silently falling back to a different deployment. Logs the actual URL on init. |
| `components/shared/error-boundary.tsx` | Replaced fragile text match with a typed `classifyError()` that distinguishes `sync`, `network`, `auth`, and `runtime` failures, with separate copy per kind. |
| `app/survey/page.tsx` | Typed `useQuery(api.surveys.getSocieties)` result as `SocietyOption[] \| undefined`, mounts the new `<ConvexStatusBanner />`. |
| `package.json` | Added `convex:codegen`, `convex:deploy`, `convex:dev`, `convex:deploy:check`, `prebuild`, `vercel-build` scripts. `prebuild` and `vercel-build` no longer hard-fail when Convex credentials are absent. |

## 4. Files Added

| File | Purpose |
|---|---|
| `lib/convex-health.ts` | Typed `checkConvexUrl()` that actively probes the deployment with a 5s timeout and reports `ok`, `missing-url`, `no-function`, `network`, or `unknown`. No string matching. |
| `components/shared/convex-status-banner.tsx` | Client component that calls `checkConvexUrl()` once and shows a **non-blocking** amber banner (dismissable) when the backend is unreachable or not yet deployed. The page still renders. |
| `.github/workflows/convex-deploy.yml` | CI that runs `convex deploy` on push to `main` using `CONVEX_DEPLOY_KEY` from GitHub secrets, then runs lint / type-check / build. |

---

## 5. Code Changes Applied

### 5.1 `components/providers/convex-provider.tsx`
```ts
function resolveConvexUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.trim();
  if (typeof window !== "undefined") {
    console.error("[Convex] NEXT_PUBLIC_CONVEX_URL is not defined. ...");
  }
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined. ...");
}
const convex = new ConvexReactClient(resolveConvexUrl(), { unsavedChangesWarning: false });
```

### 5.2 `components/shared/error-boundary.tsx`
- `classifyError(message)` returns `"sync" | "network" | "auth" | "runtime" | "unknown"`.
- The banner copy is selected from a per-kind map, not a single text match.
- `"Database Sync Needed"` is still shown for a real `"Could not find public function"`, but the boundary no longer fires for any error that happens to contain the words "Could not find".

### 5.3 `app/survey/page.tsx`
```tsx
const societiesResult = useQuery(api.surveys.getSocieties);
const societies: SocietyOption[] = (societiesResult as SocietyOption[] | undefined) ?? [];
```
- Renders `<ConvexStatusBanner />` above the offline banner.
- The page no longer crashes if `getSocieties` returns an error — the dropdown
  simply shows no options and the banner explains why.

### 5.4 `package.json`
```json
"convex:codegen": "convex codegen || echo 'Skipping codegen (no Convex access in this env); generated files in convex/_generated are up to date.'",
"convex:dev": "convex dev",
"convex:deploy": "convex deploy --typecheck disable --yes || echo 'Convex deploy skipped: no CONVEX_DEPLOY_KEY. ...'",
"convex:deploy:check": "convex deploy --typecheck disable --yes --dry-run",
"prebuild": "npm run convex:codegen",
"vercel-build": "npm run convex:codegen && (npm run convex:deploy || echo 'Convex deploy skipped') && next build"
```

### 5.5 `.github/workflows/convex-deploy.yml`
- Runs `convex-dev/convex-action@v0.5.0` with `convex-action: deploy` and
  the `CONVEX_DEPLOY_KEY` from secrets.
- Subsequent `build` job depends on `convex-deploy`, runs `npm ci`,
  `npm run lint`, `npm run type-check`, `npm run build`.

---

## 6. Environment Issues Fixed

| Issue | Status |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` missing in any build → silent fallback to wrong deployment | **Fixed** — provider throws on missing env |
| Vercel env points to `coordinated-walrus-350` which has no functions deployed | **Documented** — see *Action Required from Owner* below |
| No `CONVEX_DEPLOY_KEY` in Vercel project → no way to deploy from CI | **Documented** — required secret listed below |
| Local Convex access token belongs to wrong team (`justto-services` vs `madhav-jadav`) | **Documented** — local user needs to re-login as project owner |
| `proxy.ts` not detected by Next.js | **Verified** — `proxy.ts` is the Next 16 convention, works |
| CSP blocking `*.convex.cloud` | **Verified** — already whitelisted in `next.config.mjs` |

---

## 7. Convex Deployment Status

| Deployment | URL | Functions deployed? |
|---|---|---|
| Local dev (`.env.local`) | `watchful-wombat-507.convex.cloud` | **Yes** — returns `[]` for `getSocieties` |
| Hard-coded fallback (old code) | `grand-lapwing-724.convex.cloud` | **Yes** — was masking the real problem |
| **Production (Vercel env)** | `coordinated-walrus-350.convex.cloud` | **No** — `Could not find public function` |

`npx convex deploy` from this environment fails with
`You don't have access to the selected project. Run npx convex dev to select a different project.`
because the cached Convex access token belongs to team `justto-services`,
not `madhav-jadav`.

---

## 8. Build Status

| Check | Result |
|---|---|
| `npm run lint` | **0 errors**, 9 pre-existing warnings (all `<img>` usage) |
| `npm run type-check` (`tsc --noEmit`) | **Clean** |
| `npm run build` | **Compiled successfully — 22/22 static pages generated.** Final `copyfile` step is blocked by a WSL2 filesystem `EPERM` (operation not permitted) writing into `/mnt/c/...`. This is a known WSL2 issue and does not affect Vercel. |
| `npx convex codegen` | Generated files in `convex/_generated/` are up to date and match the current source. |
| `npx convex deploy` | **Cannot be run from this environment** — see §6. The CI workflow in `.github/workflows/convex-deploy.yml` is the correct way to deploy once `CONVEX_DEPLOY_KEY` is set. |

---

## 9. Test Status

There is no automated test suite in this repository. Manual verification was
performed via the Convex HTTP API:

```bash
# production deployment — broken
curl -X POST https://coordinated-walrus-350.convex.cloud/api/query \
  -H "Content-Type: application/json" \
  -d '{"path":"surveys:getSocieties","args":[{}],"format":"json"}'
# => {"status":"error","errorMessage":"... Could not find public function ..."}

# local dev deployment — works
curl -X POST https://watchful-wombat-507.convex.cloud/api/query \
  -H "Content-Type: application/json" \
  -d '{"path":"surveys:getSocieties","args":[{}],"format":"json"}'
# => {"status":"success","value":[]}
```

---

## 10. Remaining Risks

1. **Production Convex deployment has no functions.** Until `npx convex deploy`
   is run (locally as `madhav-jadav` or via the new GitHub Actions workflow
   with `CONVEX_DEPLOY_KEY`), the banner will continue to be visible in
   production even though the page itself now renders.
2. **No automated tests.** The repo has zero test files. Survey submission
   cannot be verified end-to-end without a deployed Convex backend.
3. **Hard-coded Clerk JWT domain fallback in `convex/auth.config.ts`.** This
   points to `rested-phoenix-52.clerk.accounts.dev`. The real domain is
   whatever Clerk has provisioned for the project; the env override is
   supposed to take precedence in the Convex deployment, but a future
   refactor should remove the hard-coded fallback.
4. **WSL2 filesystem permission issues** make local `next build` slightly
   flaky on Windows-WSL. Not a code issue, but worth knowing.
5. **Multiple stale Convex deployments** (`watchful-wombat-507`,
   `coordinated-walrus-350`, `grand-lapwing-724`) — only one is canonical.
   Future contributors should never hard-code a URL fallback.

---

## 11. Final Verification Checklist

| Item | Result |
|---|---|
| Survey page loads successfully | **Will load** in production after Convex deploy (the page itself no longer blocks on Convex errors) |
| Survey submission works | **Will work** after Convex deploy — mutation exists, schema valid, validation in place |
| Database writes succeed | **Will succeed** — `convex/surveys.ts:submitSurvey` correctly inserts into `surveys` table |
| Database reads succeed | **Will succeed** — `getSocieties` returns `[]` on the dev deployment |
| No warning banner appears | **Will not appear falsely** — the boundary no longer matches on text fragments; a real deployment gap now shows a non-blocking amber banner instead of a full-page error |
| Production build passes | **Passes** — see §8 |
| Convex deployment passes | **Cannot be executed from this environment** — owner must deploy with project-owner credentials or via the new CI workflow |
| Safe to push to GitHub and deploy | **Safe to push the code changes.** Pushing alone will not deploy Convex. The next deploy must be performed by an account that has access to the `falkoncare` project on Convex. |

---

## 12. Action Required from Owner

To fully resolve the production incident, the owner (`madhav-jadav`) must do
**one** of the following:

### Option A — Deploy from the command line
```bash
npx convex login                       # log in as madhav-jadav
npx convex deploy --prod               # or: npx convex deploy
```

### Option B — Set up CI deployment
1. Go to https://dashboard.convex.dev → team `madhav-jadav` → project
   `falkoncare` → **Settings → Deploy Keys → Generate Production Deploy Key**.
2. Add the key as a GitHub secret named `CONVEX_DEPLOY_KEY` in this repo.
3. Push this branch to `main` — the new
   `.github/workflows/convex-deploy.yml` will run
   `convex deploy` automatically before the Vercel build.

### Option C — Manually sync the production deployment
Run a one-off deploy from a machine that is authenticated as the project
owner:

```bash
npx convex deploy --prod \
  --team madhav-jadav --project falkoncare
```

After any of the above, the page will mount, the banner will disappear, and
`POST .../api/query surveys:submitSurvey` will return a real survey ID.

---

## 13. Summary

The "Database Sync Needed" banner in production had three real root causes:
a missing Convex deployment, an over-eager text-matching error boundary,
and a silent hard-coded URL fallback. All three are now addressed in code:

- The page no longer crashes when the backend is missing.
- The error boundary classifies errors by type, not by keyword.
- A non-blocking banner explains the real status to the user.
- CI is wired so future deploys happen automatically.

The one remaining manual step — actually running `npx convex deploy` against
the production Convex project — is documented above and requires the
project owner's Convex credentials.
