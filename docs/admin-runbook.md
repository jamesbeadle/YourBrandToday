# Admin runbook

The day-to-day of running Your Brand Today: who our staff are, who is on which brand, and
what to do when an account needs stopping.

## The first admin

`handle_new_user` (migration 0001) makes the account with the bootstrapped email an
administrator the moment it signs up. Every other admin is made in SQL by an existing one:
`update profiles set is_admin = true where email = '<email>';`

## Staff

`/admin` → **Make staff** (or **Remove staff**). Staff reach every brand, take on new ones and
put people on them. Admins are staff too.

## Taking on a client

1. On `/brands`, **Take on a brand** — or `take_on_brand` over MCP.
2. Ask the client to sign in once, so their account exists.
3. On the brand's overview, add them by email as **owner**. Add anyone else from the client as
   **manager** (can change the brand) or **viewer** (can see it and review content).
4. Capture the brand: open the brand kit, or hand a Claude connected to Your Brand Today their
   website and style guide and ask it to record the brand with `record_brand_decisions`.

## Stopping an account

`/admin` → **Restrict** stops an account signing in to the MCP server and reaching any brand;
**Unrestrict** reverses it. **Delete** removes the account and everything that cascades from it
— its brand memberships and connections. The brands, decisions and content it made stay,
with the author cleared. Administrators cannot be deleted.

## Connections

Every connected Claude is an OAuth token in `oauth_tokens`. To cut one off:
`update oauth_tokens set revoked_at = now() where account_id = '<uuid>';`
