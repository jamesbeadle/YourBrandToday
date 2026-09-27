# Your Brand Today (YBT)

Your whole brand, run for you — down to the border widths.

We take on a client, learn their brand, and the platform does the rest: it watches what is
trending in their market today, turns it into short-form video made in their voice and their
look, publishes it to their social channels, and runs the marketing and ad campaigns that
put it in front of the right people. Then it reads the results and does better tomorrow.

## The idea

A brand is not a logo. It is a thousand small decisions made the same way every time — the
typeface, the colour of a caption, the radius on a card, the width of a border, the words a
brand would never say. Most small businesses cannot hold all of that in their head while
also keeping up with a feed that changes every day.

Your Brand Today holds it for them. The brand is captured once as a **brand kit** — a single
source of truth for every visual and verbal decision — and every piece of content the
platform makes is built from it. Nothing is off-brand because nothing is made outside the kit.

## How it works

1. **Onboard the brand.** A client comes on board and we capture their brand kit: logo,
   palette, typography, spacing, radii, border widths, motion, tone of voice, audience,
   products and the things they never say. The kit is stored as design tokens, not a PDF.
2. **Watch the trends.** The platform searches what is rising today across the client's
   platforms and market — sounds, formats, hooks, hashtags, topics — and scores each trend
   for fit with the brand and its audience.
3. **Make the video.** For the trends worth riding, it writes the script and the hook,
   storyboards the shots, and renders short-form video in the brand kit — captions, colours,
   type and end cards all drawn from the tokens.
4. **Approve and publish.** The client sees a content calendar of drafts, approves or asks
   for changes, and approved posts go out on schedule to each connected channel.
5. **Run the campaigns.** Posts that perform become paid ads. The platform sets up
   campaigns against a budget the client controls, targets the audience in the kit, and
   moves spend towards what works.
6. **Learn.** Views, watch time, engagement, clicks and conversions come back in, and they
   feed the next round of trend scoring and creative.

## User stories

- As a **client**, I want my brand captured once, so that everything made for me looks and
  sounds like me without my having to check it.
- As a **client**, I want videos built on what is trending today, so that my brand stays
  relevant without my living on social media.
- As a **client**, I want to approve content before it goes out, so that nothing is posted
  in my name that I would not have posted myself.
- As a **client**, I want to set an ad budget and see where it went, so that I only pay for
  what earns its keep.
- As a **client**, I want one report of what worked and what did not, so that I understand
  my brand's performance without reading five dashboards.
- As a **brand manager** on our team, I want every client's calendar, drafts and campaigns
  in one place, so that I can run many brands without dropping any of them.
- As an **admin**, I want to take on, pause and offboard clients and manage staff accounts,
  so that the platform reflects who we actually work for.

## Site map

| Route | What it is |
| --- | --- |
| `/` | The public site — what we do, how it works, and how to get in touch |
| `/contact` | Enquiry form; enquiries become leads |
| `/dashboard` | A client's home: this week's content, campaigns and results at a glance |
| `/brand` | The brand kit — tokens, assets, tone of voice and audience |
| `/trends` | What is rising today, scored for fit with the brand |
| `/content` | The content calendar — drafts, approvals, scheduled and published posts |
| `/content/[id]` | One video: script, storyboard, render, captions, comments and approval |
| `/campaigns` | Paid campaigns, budgets and spend |
| `/reports` | Performance across channels and campaigns |
| `/channels` | Connected social and ad accounts |
| `/clients` | Staff only — the client register and each brand's lifecycle |
| `/admin` | Admin only — accounts, roles and the site model |
| `/account` | Sign-in details and display name |
| `/api/mcp` | The MCP server — the same platform, reachable from a client's own assistant |

## The brand kit

The brand kit is the heart of the product. Every client's kit is a set of named tokens —
the same idea as the `@theme` block in `src/app.css`, but per brand:

- **Colour** — primary, secondary, accent, surface, ink, and the rules for contrast.
- **Type** — display and body faces, weights, sizes and line heights.
- **Shape** — radii, border widths, spacing scale, shadows.
- **Motion** — transitions, caption animation, pacing and cut rhythm.
- **Assets** — logos, marks, product shots, music and sound beds the brand is licensed for.
- **Voice** — tone, vocabulary, words to use, words to avoid, and example posts.
- **Audience** — who the brand is for, where they are, and what they respond to.

Video templates read tokens, never literals, so changing a brand's border width changes it
in every render from then on.

## Status

New project. This README is the plan; the code follows it story by story.

## Running locally

```bash
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable API key |
| `SUPABASE_SECRET_KEY` | Supabase secret key — used by the MCP server and background jobs |
| `ANTHROPIC_API_KEY` | Claude API key — trend scoring, scripts, storyboards and captions |
| `RESEND_API_KEY` / `EMAIL_FROM` | Resend API key and sender address for transactional email |
| `ENQUIRY_NOTIFICATION_EMAIL` | Where website enquiries from `/contact` are sent |

Keys for trend sources, video rendering, and each social and ad platform are added as each
integration is built, and listed here when they are.

`migrations/` holds the schema; apply a migration by hand to the live database and label the
pull request `migration-reviewed`.

## Stack

SvelteKit, Svelte 5, Tailwind CSS 4, TypeScript, Supabase (Auth + Postgres + Storage),
Claude API, Vitest.

The layout matches its sister projects,
[Your Business Today](https://github.com/jamesbeadle/yourbusinesstoday) and
[Your Books Today](https://github.com/jamesbeadle/yourbookstoday):

```
src/
  app.css            Tailwind @theme tokens
  hooks.server.ts    Supabase session on every request
  lib/
    client/          Browser-side state (.svelte.ts)
    components/      Components grouped by area (site/, home/, brand/, content/ …)
    server/          Commands and queries grouped by area (auth/, brand/, trends/ …)
  routes/            Pages, one folder per view in the site map
migrations/          Numbered SQL migrations
docs/                Architecture notes and runbooks
```

## Conventions

All code follows the conventions in [CLAUDE.md](./CLAUDE.md) — code reads as prose, every
feature traces to a user story, the backend speaks in commands and queries, and no file runs
past 100 lines. Read it before changing anything.
