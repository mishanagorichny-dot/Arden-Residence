# Arden: residential launch site (concept)

A fictional development in Dublin 18, made for a UX/UI case study. Static HTML/CSS/JS with no build step. Open `index.html`, or serve the folder.

## Design synthesis

**Competitor (UX layer)**: journey order (promise → idea → homes → location → living → trust → register), a persistent path to homes, location as its own chapter, payment and progress as trust signals before the form, one conversion point with a phone number always visible.

**Visual reference (UI layer)**: one confident hero composition, slow ping-pong ambient motion, a serif display face against a quiet sans, a panel anchored to the bottom of the hero, micro-labels and hairlines, numbered rows with an arrow nudge, 200 ms colour and position transitions.

**Arden (original)**: woodland concept ("where the city meets the woods"), a stone, moss and ink palette, Fraunces with Geist, light text over a dusk photo, a hero that drifts forward and back.

## Section decisions

| Section | Structure (competitor) | Treatment (visual ref) | Arden original |
|---|---|---|---|
| Hero | Name, place, promise, two CTAs | Bottom-anchored glass panel | Panel doubles as a quick filter into Homes by type |
| Idea | Pinned narrative | Large serif statement | Words light up as you scroll, with floating parallax images |
| Homes | Explore apartments | Numbered rows, hairlines | Type and bed filters, availability chips, drawer with floor plan and specs, "Register interest" pre-fills the form |
| Specification | n/a | Numbered interactive rows | Accordion rows swap a sticky image |
| Location | Location chapter | Restrained visual | Stylised Dublin 18 map; hovering a place lights its pin |
| Living | Amenities as lifestyle | Editorial whitespace | Asymmetric grid on desktop, snap carousel on mobile |
| Buying | Instalment plan and permit | Hairline lists | Build timeline with progress bar, five-step how-to-buy, Help to Buy note |
| Register | Single form at the end | Black pill CTA | Inline validation, pre-fill from the drawer, success state |

Global: the nav hides on scroll down and shows on scroll up, turning solid after the hero. A conversion dock appears after the hero and hides near the form. Full-screen menu on mobile. Respects `prefers-reduced-motion`.

## Site map

| Page | Role | Content |
|---|---|---|
| `index.html` Home | Tell the story, then route people to the right page | Hero, idea, facts, 3 featured homes, location times, 3 shared spaces, progress and buyer cards, register |
| `homes.html` | Decide | Type and bed filters (`?type=` deep link from the hero), home drawer with plan, specification |
| `location.html` | Reassure | Interactive Dublin 18 map, three ways into town |
| `living.html` | Desire | Six shared spaces, on-site management |
| `buying.html` | Trust | Build timeline, how to buy, FAQ |

Every page ends with a large "Next" link (a loop through Homes, Location, Living, Buying) and the same register form. `main.js` injects the nav, footer, register form, dock and drawer so all pages stay in sync.

## Home hero

The layout follows the visual reference: centred serif headline, one sentence, two CTAs, and a frosted panel on the bottom edge with three numbered rows that open the Homes page pre-filtered.

The motion uses the reference's boomerang idea on a still render (`assets/img/arden-hero.jpg`). A canvas draws a slow camera push and drift, plus a soft sunlight sweep across the sky, at 30 fps. It plays forward for 7 s, then backward, forever. It pauses when the hero is off screen or the tab is hidden, and it's skipped under reduced-motion. `main.js` also keeps the video version (`[data-boomerang]`: capture frames, then loop them on a canvas) for when a real clip is available.

All photos are saved locally in `assets/img/` (from Unsplash). `ARDEN-home.html` is the home page as one file with its pictures embedded. Rebuild it with `python3 .build-single.py`.
