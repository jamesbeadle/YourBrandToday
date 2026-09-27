# The brand, abstracted

A brand is not its colours. A brand is the set of decisions it makes the same way every time —
the accent colour, the width of a border, how fast a caption arrives, the word it greets people
with, whether it ever stitches a competitor, what it asks a viewer to do at the end of a video.
Your Brand Today stores every one of those as the same kind of thing, so that a colour and a
habit are held, inherited, resolved, checked and changed by the same machinery.

## The seven facets

Every decision belongs to one facet:

| Facet | What it decides | Example traits |
| --- | --- | --- |
| **Look** | How the brand appears | `look.colour.accent`, `look.shape.borderWidth`, `look.type.displayFamily` |
| **Motion** | How it moves | `motion.timing.cutRhythm`, `motion.easing.standard`, `motion.caption.entrance` |
| **Sound** | How it sounds | `sound.music.genre`, `sound.voiceover.character`, `sound.signature` |
| **Voice** | How it speaks | `voice.tone`, `voice.wordsToUse`, `voice.wordsToAvoid`, `voice.greeting` |
| **Behaviour** | What the brand *does* | `behaviour.reply`, `behaviour.stitch`, `behaviour.goLive` |
| **Response** | What it asks its audience to *do* | `response.follow`, `response.save`, `response.purchase` |
| **Audience** | Who it is for | `audience.description`, `audience.ageRange`, `audience.motivations` |

Behaviour and Response are the two halves of *actions*: the actions a brand undertakes, and the
actions it invites its audience to undertake. Each action in the catalogue
(`src/lib/brand/actions/`) becomes a trait in one of the two facets, and its value is an
**action rule** — a stance (`always`, `often`, `sometimes`, `never`) and the guidance for how.
So "we reply to every comment within the hour, warmly, never with a link" and "never duet a
competitor" are decisions exactly like "the accent is `#ff5a36`".

## Traits and their kinds

A **trait** is one named decision a brand can make: a dotted key, a facet, a label, a purpose
(what it is for) and a **kind**, which says what shape its value takes and how an input is
checked before it is stored:

`colour` · `length` · `duration` · `easing` · `fontFamily` · `fontWeight` · `number` · `ratio` ·
`phrase` · `phraseList` · `choice` · `actionRule`

The built-in catalogue lives in `src/lib/brand/traits/`. A brand can define its own traits (a
seasonal colour, a mascot's catchphrase) in any facet, with any kind; they are held per brand
and join the catalogue for that brand only.

A value can **refer** to another trait with braces — `look.colour.captionBackground` set to
`{look.colour.accent}` — so a brand states a decision once and every trait that should follow
it does. References are resolved after the cascade, and a loop is reported, not followed.

## Mediums, and why they form a tree

A **medium** is where content lives. Mediums are a tree, addressed by dotted paths:

```
all
├── video ─── video.short ─── video.short.tiktok · video.short.reels · video.short.shorts
│         └── video.long ──── video.long.youtube
├── image ─── image.post ──── image.post.instagram · image.post.linkedin
│         ├── image.story
│         └── image.carousel
├── text ──── text.post ───── text.post.x · text.post.linkedin
│         └── text.email
├── audio ─── audio.podcast
└── web ───── web.site · web.landing
```

Each medium says which **facets it can express** (a still image has no motion; an email has no
sound) and which **actions it offers** (TikTok offers stitch and duet; email offers reply and
click-through; no one can stitch an email). A child inherits both from its parent unless it
says otherwise — it may replace them, or add actions of its own.

## Decisions and the cascade

A **decision** is a brand choosing a value for a trait *at a medium*:

> Brand · trait · medium · value · rationale · source · status

Decisions made at `all` hold everywhere. A decision made lower down overrides it for that
branch only — the border is `2px` everywhere, but `0px` on `video.short`; the tone is "warm and
plain" everywhere, but "playful" on `video.short.tiktok`. That is the cascade, and **resolving**
the brand for a medium is:

1. Keep only the traits whose facet the medium can express, and — for Behaviour and Response —
   whose action the medium offers.
2. For each trait, take the adopted decision whose medium is the medium itself or its nearest
   ancestor. Deeper wins.
3. Resolve references.
4. What is left undecided is a **gap** — the questions still to ask the client.

The result, a **resolved brand**, is a flat list of trait → value with where each value came
from. Nothing downstream reads decisions directly; everything reads a resolved brand.

A decision has a **status**. `adopted` decisions resolve. `proposed` ones wait — this is where
the platform's own learning lands ("replies with a question get twice the comments; make
`behaviour.reply` `always`?"), and where a client's own Claude can suggest changes for the
owner to accept. `retired` decisions are kept for the record. A decision's **source** says who
made it: `onboarding`, `staff`, `client`, `mcp` or `learned`.

## Projections

A resolved brand is turned into what each maker needs by a **projection**:

- **CSS variables** — every Look and Motion trait as a custom property, which is how the brand
  kit page previews a brand in its own colours, type, radii and border widths, and how a video
  template is styled.
- **The brand brief** — every Voice, Behaviour, Response and Audience trait written as
  plain-English guidance, which is what a Claude reads before it writes a script, a caption or a
  reply for that medium.

A new maker — a renderer, an email builder — is a new projection, not a change to the model.

## Everything else hangs off the brand

- **Trends** are observations of what is rising, each for a medium, with a fit score and why.
  They come in through the MCP server, from the client's own Claude or ours, which is where the
  searching happens.
- **Content** is one piece for one medium: the hook, the script, the storyboard, the caption and
  the audience action it invites (a Response trait). When it is drafted it takes a **snapshot** of
  the resolved brand, so an approved piece never changes because a decision changed later. It
  moves `idea → drafted → awaiting approval → approved → scheduled → published`, and the client
  approves or asks for changes.
- **Campaigns** spend a budget behind content towards an **objective**, and the objective is an
  audience action — follow, click through, purchase — so campaigns speak the same vocabulary as
  the brand.
- **Performance readings** come back per piece and per campaign; they feed the reports and the
  proposals the platform makes about the brand.

## Where inputs arrive

Most inputs arrive through `/api/mcp`, from the client's Claude or a brand manager's: the brand
extracted from a website or a style guide in one call of many decisions, trends found on the
web, drafted scripts, performance readings exported from each platform. Every input is checked
against its trait's kind, its medium and its facet at the door, and refused with a sentence
saying why rather than repaired. The site shows the same brand, lets the client approve, and
lets a manager decide anything by hand.
