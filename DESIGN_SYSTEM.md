# The Collector's Pulse — Design System

**"Luxe-but-Vivid"** — a bold, vibrant editorial system with luxury polish.

The visual language is synthesized from four reference brands:

| Reference | What we borrowed |
|---|---|
| **Audemars Piguet** | Cinematic dark stage, generous whitespace, refined editorial serif, subtle precision motion |
| **One Piece TCG** | Dramatic depth, bold red, immersive full-bleed art framing |
| **Pokémon** | Electric, cheerful category color and energetic micro-motion |
| **Bandai Namco** | Warm "ember" gradient glow (red → orange → gold) |

The result: a premium dark stage (the *vault*) lit by vivid, saturated accents — so the product reads as expensive **and** energetic, not muted.

---

## Color

All tokens live as CSS custom properties in `app/globals.css`. Reference them with `var(--token)` — never hardcode hex in components.

### Surfaces (dark stage)
| Token | Value | Use |
|---|---|---|
| `--obsidian` | `#07070D` | Page base |
| `--vault` | `#101019` | Cards, panels |
| `--chamber` | `#181826` | Raised panels |
| `--chamber-2` | `#20202F` | Hover / elevated |

### Signature accents
| Token | Value | Use |
|---|---|---|
| `--gold` / `--gold-bright` | `#D8B65A` / `#F2D679` | Primary luxury accent |
| `--crimson` | `#E23B2E` | Live / drop alerts (electric red) |
| `--ember` | `#F2762E` | Warm hero glow |
| `--flame` | `#F7BE33` | Gradient terminus |
| `--ivory` / `--mist` / `--mist-dim` | `#F6F1E9` / `#9D9DB4` / `#6E6E85` | Text hierarchy |
| `--border-color` / `--border-bright` | `#26263A` / `#34344E` | Dividers, card edges |

### Category accents (vivid)
| Category | Token | Value |
|---|---|---|
| TCG | `--accent-tcg` | `#2E8BFF` (electric blue) |
| Figures | `--accent-figures` | `#C24BF5` (vivid violet) |
| Watches | `--accent-watches` | `#E8C96A` (champagne gold) |
| Restock | `--accent-restock` | `#16D6A0` (mint) |

Each has a matching `*-soft` translucent fill for badges/backgrounds.

### Signature gradients
- `--grad-ember` — `#E23B2E → #F2762E → #F7BE33` (the brand's hero gradient)
- `--grad-gold` — champagne metallic
- `--grad-tcg` / `--grad-figures` / `--grad-watches` — per-category
- `--grad-aurora` — multi-stop radial mesh used behind hero & section glows

---

## Typography

Four voices create the "premium-but-bold" tension:

| Font | Token | Role |
|---|---|---|
| **Cormorant Garamond** | `--font-cormorant` | Editorial headlines & hero (luxury serif, often italic) |
| **Space Grotesk** | `--font-display` | Punchy display, eyebrows, labels, stats (the "vibrant" voice) |
| **Inter** | `--font-inter` | Body copy, UI |
| **Space Mono** | (fallback in `--font-space`) | Monospace data accents |

Headlines use `clamp()` for fluid scaling. Eyebrow labels are uppercase, `letter-spacing: 0.15–0.2em`, in Space Grotesk.

---

## Spacing, radii, motion

- **Spacing:** `--space-xs` (4px) → `--space-3xl` (96px) on a consistent scale.
- **Radii:** `--radius-sm` (6) / `md` (10) / `lg` (18) / `xl` (28) / `pill`.
- **Motion:** easing `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; all decorative motion respects `prefers-reduced-motion`.

### Utility classes (in globals.css)
- `.text-gradient-ember` / `.text-gradient-gold` — animated/static gradient text
- `.grad-border` — 1px gradient hairline border wrapper
- `.story-card` + `.card-sheen` — lift, glow, and light-sweep on hover
- `.realm-card` / `.realm-glow` — category portal hover
- `.nav-link` — ember underline grow
- `.drop-cap` — editorial gradient drop-cap for article body
- `.collector-image` — cinematic image treatment (brightens + zooms on hover)
- Animations: `.animate-fade-up`, `.animate-aurora`, `.animate-pulse-glow`, `.animate-float`, `.animate-ticker-scroll`, `.animate-pulse-dot`

### Premium touches
- A fixed film-grain noise overlay (`body::after`, opacity ~0.035) adds depth.
- Custom gold-hover scrollbar.
- Cards carry a per-category `--card-accent` / `--card-glow` so hover states glow in the story's category color.

---

## Principles
1. **Dark stage, vivid light.** The background stays deep and quiet; color comes from accents, gradients, and imagery.
2. **Two-voice type.** Serif for editorial gravitas, grotesk for energy. Never let one dominate.
3. **Motion is precision, not noise.** Subtle, eased, purposeful — and always reduced-motion safe.
4. **Category is color.** TCG = blue, Figures = violet, Watches = gold. Carried consistently across badges, borders, hover glows, and gradients.
