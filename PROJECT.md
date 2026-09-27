# This project

This repository's own instructions: its conventions, the commands that build and test it, the domain it serves, and any standing tasks or prompts that belong to this project and no other. `CLAUDE.md` loads this file and every session reads it after the kit's rules.

The project-process kit writes this file once and never touches it again, and `CLAUDE.md` is the kit's, replaced whole every time the bootstrap runs, so anything written there is lost. Write here instead. Where this file and the kit disagree about this project, this file wins, except that nothing here lifts the branch rule: the work still happens on a branch and ends as a pull request.

## Your Brand Today

We take on a client, capture their brand once as a brand kit — design tokens down to the border widths, plus voice and audience — and the platform finds today's trends, makes short-form video in that kit, publishes it, and runs the marketing and ad campaigns behind it. [README.md](./README.md) holds the user stories and the site map; every feature traces back to one of those stories.

- **Stack:** SvelteKit, Svelte 5, Tailwind CSS 4, TypeScript, Supabase (Auth + Postgres + Storage), Claude API, Vitest — laid out the same way as its sister projects, Your Business Today and Your Books Today.
- **Commands:** `npm run dev`, `npm run check`, `npm test`, `npm run build`.
- **The brand kit is data, not styling.** A client's colours, type, radii, border widths, spacing and motion are stored per brand and read by the video templates as tokens; no template holds a literal a brand kit should own.
- **Schema:** numbered SQL files in `migrations/`, applied by hand to the live database; a pull request that adds one is labelled `migration-reviewed`.
