# Clerk + Convex Auth Setup

The submission error `Uncaught ConvexError: UNAUTHENTICATED` means the
Clerk → Convex JWT pipeline is not wired up. Every authenticated Convex
mutation (e.g. `surveys:submitSurvey`) checks
`ctx.auth.getUserIdentity()` and throws this error when the JWT is
missing or invalid.

Two things must be configured on the Convex side, and one on the Clerk
side. They all need to match exactly.

---

## 1. Clerk — create the `convex` JWT template

1. Open the Clerk dashboard: https://dashboard.clerk.com
2. Select this application (`rested-phoenix-52` — the publishable key
   `pk_test_cmVzdGVkLXBob2VuaXgtNTIuY2xlcmsuYWNjb3VudHMuZGV2JA`
   decodes to that Frontend API host).
3. Go to **JWT Templates** in the left sidebar.
4. Click **+ New template**.
5. Pick the **Convex** template (Clerk ships one) **or** name your
   template `convex` exactly (this name MUST match
   `applicationID: "convex"` in `convex/auth.config.ts`).
6. Save. The default claims are fine.

If you skip this step, every Clerk session will be a generic session
JWT that Convex does not know how to validate, and the user will see
`UNAUTHENTICATED` on every mutation.

---

## 2. Convex — set `CLERK_JWT_ISSUER_DOMAIN`

The domain must be the full https URL of your Clerk Frontend API. You
can get it by:

- Decoding the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  (`pk_test_…` is base64-encoded; the second half is the domain), or
- Copying it from the Clerk dashboard
  **API Keys → Show JWT public key → Issuer**.

For this project, the issuer is:

```
https://rested-phoenix-52.clerk.accounts.dev
```

To set it on Convex:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://rested-phoenix-52.clerk.accounts.dev
```

(or use the Convex dashboard → your project → Settings → Environment
Variables).

The fallback in `convex/auth.config.ts` is the same value, so the env
var is mainly a safety net in case the Clerk instance is ever moved.

---

## 3. Re-deploy the Convex functions

After Clerk template + Convex env are in place, push the latest code:

```bash
npx convex deploy
```

If you are not the project owner, ask the owner to add you to the team
`madhav-jadav` in the Convex dashboard, or share the
`CONVEX_DEPLOY_KEY` so CI can deploy for you.

---

## 4. Verify

After deploying, open the live site in an incognito window:

1. Sign in with Clerk.
2. Open browser devtools → console.
3. You should see:
   ```
   [Convex] Client connected to: https://watchful-wombat-507.convex.cloud
   ```
4. Visit `/survey`, fill the form, click **Submit Survey**.
5. The toast should say **✅ Survey Saved**, not **❌ Submission Failed**.

You can also verify the Convex side directly with the new diagnostic
query (after re-deploy):

```bash
curl -X POST https://watchful-wombat-507.convex.cloud/api/query \
  -H "Content-Type: application/json" \
  -d '{"path":"users:whoami","args":[{}],"format":"json"}'
```

Without a JWT in the `Authorization` header this returns:

```json
{ "status": "success", "value": { "authenticated": false, "identity": null } }
```

That is the expected response. With a valid Clerk JWT, it would return
`{ "authenticated": true, "identity": { "subject": "user_…", … } }`.

---

## What `whoami` is for

`convex/users.ts` now exports a public `whoami` query. Use it from the
client to check whether the auth pipeline is healthy before performing
real mutations. It returns a stable object so it cannot crash the
caller.

---

## Quick checklist

- [ ] Clerk JWT template `convex` exists
- [ ] `CLERK_JWT_ISSUER_DOMAIN` set in Convex deployment env
- [ ] `npx convex deploy` succeeded after the latest code changes
- [ ] Browser console shows the right Convex URL
- [ ] `users:whoami` returns `{ authenticated: true, … }` from a logged-in browser session
- [ ] `/survey` submission succeeds end-to-end
