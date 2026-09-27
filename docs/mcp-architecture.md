# The MCP Server — Architecture

One endpoint, `/api/mcp`, through which a person's own Claude works on the brands they are on —
and the door most of the platform's inputs come through. A brand manager's Claude extracts a
brand from a website in one call of many decisions; a client's Claude finds today's trends,
drafts pieces and exports how they performed. The brand model itself is
[brand-architecture.md](./brand-architecture.md).

It adds no domain. Every action is a second face on a command or query in `src/lib/server/`
that the site runs too.

## The stories it serves

| As | I want | So that |
| --- | --- | --- |
| Brand manager | to hand Claude a style guide or a website and have every decision in it recorded | onboarding a brand is one conversation, not a week of forms |
| Client | Claude to read my brand for the medium it is writing for | nothing it makes is off-brand |
| Client | Claude to find what is rising and say whether my brand would ride it | I stay current without living on social media |
| Client | Claude to draft pieces I approve on the site | nothing goes out I have not said yes to |
| Anyone on a brand | to record how content performed and have patterns proposed back to the brand | the brand learns |
| Anyone | to press Connect in Claude and arrive as myself | there is no token to copy |

## The shape: four tools, many actions

Claude sees four tools, the same four for everyone:

| Tool | What it does |
| --- | --- |
| `get_current_context` | who the person is, the brands they reach and their role on each, and the doctrine |
| `list_actions` | every action this person may run, one line each, optionally narrowed to an area |
| `describe_action` | one action's input schema and guidance |
| `perform_action` | run one action by name |

The actions live in `src/lib/server/mcp/actions/`, grouped by area:

| Area | Actions |
| --- | --- |
| brand | `list_brands`, `read_brand_catalogue`, `read_brand`, `resolve_brand`, `record_brand_decisions`, `adopt_brand_decision`, `retire_brand_decision`, `define_brand_trait`, `describe_brand`, `add_brand_member`, `take_on_brand` (staff) |
| trends | `record_trends`, `list_trends`, `set_trend_status` |
| content | `draft_content`, `list_content`, `read_content`, `send_content_for_approval`, `review_content`, `schedule_content`, `record_publication` |
| campaigns | `plan_campaign`, `list_campaigns`, `add_content_to_campaign`, `set_campaign_status` |
| performance | `record_performance`, `read_performance` |

The actions that take lots of input at once — `record_brand_decisions` (up to 100),
`record_trends` (50), `record_performance` (200) — check every item on its own and answer
item by item, so one bad value is refused with its reason and the rest are still stored.

## The gates

Every brand action goes through `brandAction` (`actions/brandAction.ts`), which runs before any
domain logic:

1. **Who.** The bearer token resolves to an account (`resolveMcpCaller`); a restricted account
   is refused. The server uses the service client, so the checks below — not row-level
   security — are what stand between a caller and a brand.
2. **Which brand.** `brandId` must be a brand the caller is on, or the caller must be staff.
3. **May they change it.** A write needs an owner, a manager or staff. Viewers read, and may
   review content (`isOpenToViewers`).
4. **Is the input sound.** Every value is read at the door — a decision against its trait's
   kind, its medium and its facet; a trend's score, medium and link; a storyboard's shots — and
   refused with a sentence rather than repaired. An id that names another brand's trend, piece
   or campaign is refused (`assertOnBrand`).

## Connecting

OAuth 2.1 with PKCE and dynamic client registration, carried over from Your Books Today:
`/.well-known/oauth-protected-resource`, `/.well-known/oauth-authorization-server`,
`/oauth/register`, `/oauth/authorize` (the consent page) and `/oauth/token`. An unauthorised
request to `/api/mcp` answers 401 with the resource metadata address, which is how Claude
finds the rest.
