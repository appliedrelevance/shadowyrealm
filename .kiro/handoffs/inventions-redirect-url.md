# Handoff: allow Google sign-in on inventions.shadowyrealm.com

**Folded into `music-and-inventions-schema.md`, step 7, which also adds Music's address.**

Inventions (the site called Prior Art until 2026-11-23) moved from `priorart.shadowyrealm.com` to
`inventions.shadowyrealm.com` on 2026-11-23. The old address now redirects every GET there.

Google sign-in asks Supabase Auth to return to `window.location.origin` (`src/lib/auth.tsx`,
`signInWithOAuth` with `redirectTo`). Supabase sends the browser back only to an address on the
project's redirect allow list, and otherwise to its Site URL. Until the new address is on that list, a
Google sign-in on Inventions lands on the wrong site. Password sign-in does not use the list and is unaffected.

The allow list is the shared project's Auth configuration, which the monorepo owns. It is not in
`supabase/config.toml` (checked 2026-11-23), so it lives only in the cloud project's settings.

## Where

- **Project:** the cloud project `qgfmwstgkwyqqwyqroav`.
- **Setting:** Authentication → URL Configuration → Redirect URLs (Management API: `uri_allow_list` in
  `/v1/projects/qgfmwstgkwyqqwyqroav/config/auth`).
- **Session:** one rooted in `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance`, on `main`.

## Steps

1. Read the current list and keep it. Note whether `https://priorart.shadowyrealm.com/**` is on it.
2. Add `https://inventions.shadowyrealm.com/**`.
3. Leave `https://priorart.shadowyrealm.com/**` where it is: the old address still serves non-GET
   requests, and removing it gains nothing.

## What must not be done

- Do not change the Site URL. Every property on the project falls back to it.
- Do not replace the list: the Management API's `uri_allow_list` is one comma-separated string, and a
  PATCH with only the new address deletes every other property's entries. Send the old string with the
  new entry appended.

## How to check

On `https://inventions.shadowyrealm.com/login`, sign in with Google. The browser returns to
`https://inventions.shadowyrealm.com/`, signed in, with "Sign Out" in the menu.
