# The Consistent Academy — Design System Reference

> **Last Audited**: July 2026 — Full sweep of every file in /src, index.html, tailwind.config.ts, and index.css.
> **Status**: Authoritative source of truth. All values are directly pulled from the live codebase.

---

## Design Philosophy

This design system is built on **Neumorphism (Soft UI)** — surfaces that appear physically extruded from or carved into a continuous material plane. There are no flat cards floating above a background. Everything is molded from the same material.

**Two isolated design worlds:**

1. **Light Mode — Cool-Clay Neumorphic** (`#E0E5EC` base surface): The main public-facing site.
2. **Dark Mode — CC Club Warm Clay** (`#252436` base surface): The CC Club portal, scoped entirely under `.cc-club-scope`.

---

## Part I — Main Site (Light Mode)

### Fonts

Loaded in `index.html` via Google Fonts (both declared with `display=block`):

```html
<link href="https://fonts.googleapis.com/css2?family=Erica+One&family=Fredoka:wght@100;200;300;400;500;600;700&display=block" rel="stylesheet" />
```

| Font | Weights | Where Used |
|---|---|---|
| **Erica One** | 400 (single weight) | Hero section massive display heading only — `"The Consistent Academy"` in `Index.tsx`. Applied via inline `style={{ fontFamily: '"Erica One", cursive' }}` |
| **Fredoka** | 100–700 | Body of entire site — overrides `font-sans` via `body { font-family: 'Fredoka', sans-serif }` in `index.css`. Also explicitly set in `EnrollNowButton` and `CCButton` |

Also declared in `tailwind.config.ts` (available via utility class, not active on body by default):

| Class | Font | Weights |
|---|---|---|
| `font-display` | Plus Jakarta Sans | 500, 600, 700 |
| `font-sans` | DM Sans | 400, 500, 700 |

> **Live reality**: The active body font is **Fredoka**. `Plus Jakarta Sans` and `DM Sans` exist in Tailwind config but the body `font-family: 'Fredoka'` in `index.css` overrides `font-sans`. **Erica One** is the exclusive typeface for the hero headline — it is never used anywhere else in the codebase. These are the three fonts that define the visual identity.

**Hero Heading Typography** (Erica One, `Index.tsx` lines 128–184):
- `"The"` — `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`, color `text-neo-fg`, word-split GSAP animation
- `"Consistent"` — `text-[4rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem]`, color `#9738F9` (brand violet), char-split GSAP animation, `leading-none py-2`
- `"Academy"` — `text-5xl sm:text-6xl md:text-7xl lg:text-8xl`, color `text-neo-fg`, char-split GSAP animation
- All three stacked in a flex column with `leading-[1.0] tracking-tight`

**Section Label Pattern** (AnimatedText):
```
text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3
```

**Section Heading Pattern** (AnimatedHeading):
```
text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight
```

---

### Color Palette

#### CSS Custom Properties (HSL via `hsl(var(...))`)

| Token | HSL Value | Hex Approx. | Role |
|---|---|---|---|
| `--background` | `250 30% 96%` | `#EFEFF7` | Page body canvas |
| `--foreground` | `262 30% 15%` | `#221A36` | Primary text |
| `--card` | `250 25% 97%` | `#F2F1F8` | Card surface (shadcn) |
| `--primary` | `262 83% 58%` | `#7C3AED` | Brand violet — CTA, focus rings |
| `--primary-light` | `262 83% 75%` | `#A78BFA` | Gradient light terminus |
| `--primary-dark` | `262 83% 45%` | `#5B21B6` | Pressed/darker variant |
| `--secondary` | `262 20% 92%` | `#E6E3F0` | Secondary surfaces |
| `--muted` | `262 18% 90%` | `#E2DFEE` | Muted surfaces |
| `--muted-foreground` | `262 15% 45%` | `#6B637A` | Secondary/caption text |
| `--accent` | `280 70% 65%` | `#B06FE0` | Accent highlights |
| `--border` | `262 20% 86%` | `#D5D0E8` | Default borders (Tailwind only) |
| `--ring` | `262 83% 58%` | `#7C3AED` | Focus ring |
| `--radius` | `1.25rem` | `20px` | shadcn base radius token |

#### Neumorphic Hard Hex Tokens (`neo.*` in Tailwind config)

Used directly in neumorphic classes — not CSS vars.

| Tailwind class | Hex | Role |
|---|---|---|
| `bg-neo-base` / `text-neo-base` | `#E0E5EC` | **THE neumorphic surface** — all light-mode molded elements |
| `text-neo-fg` | `#3D4852` | Primary text on neo surfaces (7.5:1 AAA) |
| `text-neo-muted` | `#6B7280` | Secondary text (4.6:1 AA) |
| `text-neo-accent-deep` | `#391B49` | Russian Violet — deepest text on light |
| `text-neo-accent-mid` | `#795690` | Dark Lavender — secondary buttons |
| `text-neo-accent` | `#9C37FC` | Lavender — primary CTA + focus rings |
| `text-neo-accent-light` | `#C29CE4` | Bright Lavender — gradient ends, hover highlights |
| `text-neo-accent-soft` | `#999ECF` | Ceil — decorative muted tints |
| `text-neo-success` | `#38B2AC` | Teal — success states |
| `text-neo-placeholder` | `#A0AEC0` | Input placeholders only |

#### Hero Brand Colors (inline in `Index.tsx`)

| Where | Color | Value |
|---|---|---|
| `"Consistent"` word | Brand Violet | `#9738F9` |
| Course gradient | Purple-Teal | `linear-gradient(135deg, #6C63FF, #38B2AC)` |
| FlowingMenu background | Porcelain | `#E0E5EC` |
| FlowingMenu marquee bg | Deep Purple | `#5c25b3` |
| FlowingMenu text | Obsidian Purple | `#250060e7` |

---

### Border Radius

| Token | Value | Used For |
|---|---|---|
| `rounded-neo-card` | `32px` | Containers, prominent cards |
| `rounded-neo-btn` | `16px` | Buttons, inputs, chips |
| `rounded-neo-inner` | `12px` | Inner elements, tags |
| `rounded-full` | `9999px` | Icon wells, avatar circles, pill badges |
| `rounded-[3rem]` / `rounded-[48px]` | `48px` | SectionWrapper raised/purple variant |

---

### Neumorphic Shadow System (Light Mode)

**Surface**: `#E0E5EC`
**Light source**: top-left
**Shadow colors**: white highlight top-left, cool-grey shadow bottom-right

#### Tailwind Shadow Tokens (in `tailwind.config.ts` boxShadow)

```
shadow-neo-flat:       9px  9px  16px rgb(163 177 198 / 0.6),  -9px  -9px  16px rgba(255,255,255,0.5)
shadow-neo-lifted:     12px 12px 20px rgb(163 177 198 / 0.7),  -12px -12px 20px rgba(255,255,255,0.6)
shadow-neo-flat-sm:    5px  5px  10px rgb(163 177 198 / 0.6),  -5px  -5px  10px rgba(255,255,255,0.5)
shadow-neo-flat-xs:    3px  3px  6px  rgb(163 177 198 / 0.5),  -3px  -3px  6px  rgba(255,255,255,0.4)
shadow-neo-inset:      inset 6px  6px  10px rgb(163 177 198 / 0.6), inset -6px  -6px  10px rgba(255,255,255,0.5)
shadow-neo-inset-deep: inset 10px 10px 20px rgb(163 177 198 / 0.7), inset -10px -10px 20px rgba(255,255,255,0.6)
shadow-neo-inset-sm:   inset 3px  3px  6px  rgb(163 177 198 / 0.6), inset -3px  -3px  6px  rgba(255,255,255,0.5)
shadow-neo-focus:      0 0 0 2px #E0E5EC, 0 0 0 4px #9570C6
```

#### CSS Variable Shadow Tokens (in `index.css`, backing `.neu-*` classes)

```css
--neu-shadow-sm:       6px 6px 12px hsl(0 0% 82% / 0.4),   -6px  -6px  12px hsl(0 0% 100% / 0.9)
--neu-shadow:          10px 10px 20px hsl(0 0% 82% / 0.45), -10px -10px 20px hsl(0 0% 100% / 0.9)
--neu-shadow-lg:       15px 15px 30px hsl(0 0% 82% / 0.5),  -15px -15px 30px hsl(0 0% 100% / 0.95)
--neu-shadow-xl:       20px 20px 60px hsl(0 0% 80% / 0.5),  -20px -20px 60px hsl(0 0% 100% / 1)
--neu-shadow-2xl:      30px 30px 80px hsl(0 0% 78% / 0.55), -30px -30px 80px hsl(0 0% 100% / 1)
--neu-shadow-inset-sm: inset 4px  4px  8px  hsl(0 0% 82% / 0.4),  inset -4px  -4px  8px  hsl(0 0% 100% / 0.7)
--neu-shadow-inset:    inset 8px  8px  16px hsl(0 0% 82% / 0.45), inset -8px  -8px  16px hsl(0 0% 100% / 0.75)
--neu-shadow-inset-lg: inset 12px 12px 24px hsl(0 0% 82% / 0.5),  inset -12px -12px 24px hsl(0 0% 100% / 0.8)
--glow-purple:         0 0 30px hsl(262 83% 58% / 0.4)
--glow-purple-lg:      0 0 50px hsl(262 83% 58% / 0.5)
```

#### CSS Utility Classes

```css
.neo-surface      -> bg: #E0E5EC + shadow-neo-flat (raised from surface)
.neo-surface-sm   -> bg: #E0E5EC + shadow-neo-flat-sm
.neo-inset        -> bg: #E0E5EC + shadow-neo-inset (carved into surface)
.neo-inset-sm     -> bg: #E0E5EC + shadow-neo-inset-sm
.neo-accent-surface -> violet gradient bg + shadow-neo-flat

.neu-raised       -> gradient bg + --neu-shadow, 400ms transition
.neu-raised-sm/lg/xl/2xl -> gradient + sized shadow
.neu-pressed/sm/lg -> hsl(background) + inset shadow

.neu-hover-lift   -> :hover -> --neu-shadow-lg + translateY(-2px)
.neu-hover-glow   -> :hover -> --neu-shadow-lg + --glow-purple
.neu-active-press -> :active -> --neu-shadow-inset + translateY(0)
```

---

### Gradients

```css
--gradient-neu-raised:         linear-gradient(145deg, hsl(250 25% 99%), hsl(250 25% 94%))
--gradient-neu-raised-reverse: linear-gradient(145deg, hsl(250 25% 94%), hsl(250 25% 99%))
--gradient-purple-soft:        linear-gradient(145deg, hsl(262 40% 98%), hsl(262 30% 96%))
--gradient-primary:            linear-gradient(135deg, hsl(262 83% 58%), hsl(280 70% 60%))
--gradient-primary-soft:       linear-gradient(135deg, hsl(262 60% 92%), hsl(280 50% 90%))
--gradient-purple-glow:        radial-gradient(circle at center, hsl(262 83% 75% / 0.15), transparent 70%)
--gradient-accent-glow:        radial-gradient(ellipse at 50% 50%, hsl(280 70% 65% / 0.12), transparent 65%)
```

Body background: `linear-gradient(180deg, hsl(250 30% 96%), hsl(260 25% 97%))`

**Text gradient utility**: `.text-gradient` clips `--gradient-primary` as background.

---

### Component Patterns (Light Mode)

#### NeumorphicButton (`components/ui/neumorphic-button.tsx`)

Framer Motion powered. Three variants:

| Variant | Base Classes | Effect |
|---|---|---|
| `primary` | `neo-accent-surface text-white rounded-neo-btn` | Violet gradient, extruded |
| `secondary` | `neo-surface text-neo-fg rounded-neo-btn` | Grey extruded |
| `ghost` | `bg-transparent text-neo-muted rounded-neo-btn` | Gains `neo-surface-sm` on hover |

Sizes: `sm` = `h-9 px-5 text-sm`, `md` = `h-11 px-7 text-base`, `lg` = `h-12 px-10 text-lg`

Motion config:
- `whileHover`: `scale: 1.02, y: -2`, spring `stiffness: 400, damping: 20`
- `whileTap`: `scale: 0.98, y: 0.5`, spring `stiffness: 600, damping: 25`
- Focus: `shadow-neo-focus` (double-ring via box-shadow)

#### EnrollNowButton (`components/ui/EnrollNowButton.tsx`)

A highly animated styled-components button. The hero CTA — "Join Today / Join Now".

- **Font**: Fredoka, 23px, 600 weight
- **Palette**: CSS vars `--purple-100` (#ffe7ff) through `--purple-500` (#5e2b83) — hyper-purple gradient
- **Shape**: `border-radius: 18px`, `width: 220px, height: 80px` (scaled to 80% = 176×64px)
- **Resting shadow** (neumorphic outer): `6px 6px 14px rgba(45,15,66,0.7), -6px -6px 14px rgba(239,182,255,0.25)`
- **Resting inner**: `inset 3px 3px 6px rgba(0,0,0,0.25), inset -3px -3px 6px rgba(255,255,255,0.2)`
- **Hover shadow** (elevated): `9px 9px 20px rgba(45,15,66,0.85), -9px -9px 20px rgba(239,182,255,0.35)`
- **Hover transform**: wrap `translate(2px, -2px)`, spin animation activates
- **Active shadow** (compressed): `2px 2px 5px rgba(45,15,66,0.8), -2px -2px 5px rgba(239,182,255,0.2)`
- **Active inner** (deeper press): `inset 5px 5px 10px rgba(0,0,0,0.4), inset -5px -5px 10px rgba(255,255,255,0.1)`
- **Text animation**: chars slide up/down on hover using GSAP `charAppear`/`charDisappear` keyframes, staggered per character index

#### CCButton (`components/ui/CCButton.tsx`)

The circular portal button — bottom-right of hero. Navigates to `/club` with a full-screen iris wipe.

- **Shape**: `border-radius: 50%` — perfect circle, 144px diameter inner disc
- **Background**: radial-gradient black base + linear-gradient `#181924 → #9d4edd → #c77dff → #5a189a → #181924`
- **Outer ring**: blur spinning stripe overlay (`rgba(255,255,255,0.8), #db92e8`) — activates on hover
- **Ambient float**: `hover-float` keyframe — `translateY(-4px)` every 2.5s while idle
- **Hover**: stops float, `translateY(-2px)`, text-wrapper slides up revealing "C.C. Club" again in `#db92e8`
- **Click splash**: `clip-path: circle(0 at cx cy)` → `circle(150vmax at cx cy)` — fills entire screen with `#252436` (CC Club dark clay) in 600ms, then navigates
- **Font**: Fredoka, 24px, 600 weight, color `#E0E5EC`

#### NeumorphicCard (`components/ui/neumorphic-card.tsx`)

- Resting: `neo-surface rounded-neo-card p-8`
- Hover (when `hover=true`): `shadow-neo-lifted -translate-y-0.5`
- Pressed (when `pressed=true`): `neo-inset bg-neo-base`
- Entrance: `opacity:0 y:30` → `opacity:1 y:0`, `0.6s, ease [0.25,0.46,0.45,0.94]`

#### SectionWrapper (`components/ui/section-wrapper.tsx`)

- All sections: `py-16 md:py-14`, entrance `opacity:0 y:20` → `opacity:1 y:0`, `0.8s ease [0.25,0.46,0.45,0.94]`
- `raised` variant: `rounded-[3rem] shadow-neu-lg bg-gradient-to-br from-card to-secondary/10 p-8 md:p-12 mx-4 md:mx-8`
- `purple` variant: `bg-section-purple rounded-[3rem] p-8 md:p-12 mx-4 md:mx-8`

#### AnimatedHeading

`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight`, entrance `opacity:0 y:40` → `opacity:1 y:0`, `0.8s`

#### AnimatedText

Custom element tag (default `p`), entrance `opacity:0 y:30` → `opacity:1 y:0`, `0.6s`

#### Social Icon Wells (Index.tsx hero)

```
.neo-inset-sm rounded-full w-10 h-10
  -> on hover: group-hover:neo-flat
Tooltip: neo-surface-sm rounded-full
```

#### Glass Surfaces

```css
.glass       -> backdrop-blur-md + hsl(250 25% 97% / 0.8) + --neu-shadow-sm
.glass-strong -> backdrop-blur-lg + hsl(250 25% 97% / 0.9) + --neu-shadow
```

#### Footer

- Background: `bg-gradient-to-b from-card via-primary/5 to-primary/10`
- Decorative: `h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent` hairline top border
- Blob accents: `bg-primary/10 rounded-full blur-3xl` positioned at corners
- Social icons: `rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 shadow-neu-sm`
- Layout: 3-column grid `gap-12`, `py-16`
- Bottom divider: `border-t border-primary/20`

---

### Navigation (Navbar)

- Entry animation: Framer Motion `y: -100` → `y: 0`, `duration: 0.6, ease [0.25,0.46,0.45,0.94]`
- Scrolled (>20px): `neo-surface rounded-neo-card` — neumorphic extruded pill
- Not scrolled: transparent, no shadow
- Active nav item: `neo-inset text-neo-accent`
- Inactive nav: `text-neo-muted hover:text-neo-fg hover:neo-surface-sm active:neo-inset-sm`
- Mobile menu: `bg-neo-base/80 backdrop-blur-md`, panel `neo-surface rounded-neo-card`, staggered item entry `delay: index * 0.05`

---

### Page Loader (`components/PageLoader.tsx`)

GSAP timeline-driven entrance — 4 phases:

1. **Contraction** (0–1.85s): 4 concentric circles collapse from full-screen rects to circles using `back.inOut(1.2)` spring. Layer colors: `#3C096C → #5A189A → #7B2CBF → #9C37FC`
2. **Logo injection** (1.4s): Innermost circle goes transparent, logo fades in
3. **Coalesce** (2.0–2.8s): Outer rings collapse to logo size and fade out
4. **Iris wipe** (3.0–4.0s): Logo scales to `scale(60)` covering entire viewport, container dissolves

---

### Animations (Main Site)

#### Tailwind keyframes (in `tailwind.config.ts`)

| Class | Duration | Behavior |
|---|---|---|
| `animate-fade-in` | 0.6s | `opacity 0→1, translateY(20px→0)` |
| `animate-fade-in-up` | 0.8s | `opacity 0→1, translateY(40px→0)` |
| `animate-scale-in` | 0.5s | `opacity 0→1, scale(0.95→1)` |
| `animate-slide-in-right` | 0.6s | `translateX(50px→0)` |
| `animate-slide-in-left` | 0.6s | `translateX(-50px→0)` |
| `animate-neo-float` | 3s ∞ | `translateY(0→-12px→0)` |
| `animate-neo-reveal` | 0.8s | `translateY(20px→0)` |
| `animate-ambient-drift` | 15s ∞ | background-position drift |

#### CSS-only keyframes (in `index.css`)

```css
float        -> 6s ∞ — translateY(0) <-> translateY(-20px) + rotate(2deg)
float-slow   -> 8s ∞ — 3-stop X/Y drift
pulse-glow   -> 4s ∞ — scale(1→1.05), opacity(0.4→0.7)
blob         -> 10s ∞ — border-radius morph between two organic shapes
```

#### GSAP usage

- `PageLoader` — full timeline with `back.inOut`, `power2.out`, `power3.inOut`, `power4.inOut`
- `SplitText` — character/word/line text reveal with `power3.out`, triggered by IntersectionObserver + ScrollTrigger
- `EnrollNowButton` — CSS keyframe `charAppear`/`charDisappear` per character stagger

#### Framer Motion usage

- All page-level section entrances
- Navbar entry, mobile menu panel, nav item stagger
- Social icons spring scale
- NeumorphicButton spring hover/tap
- NeumorphicCard entrance
- Footer items

**Standard FM easing**: `[0.25, 0.46, 0.45, 0.94]` (custom ease-out)
**Standard transition timing**: `400ms cubic-bezier(0.4, 0, 0.2, 1)` for CSS transitions
**Spring**: `{ type: "spring", stiffness: 400, damping: 17–25 }`

---

### Layout

- **Page root**: `min-h-screen bg-neo-base overflow-x-hidden`
- **Navbar container**: `container mx-auto px-4 lg:max-w-6xl`
- **Content sections**: `container mx-auto px-4`
- **Section padding**: `py-16 md:py-14`
- **Hero**: `min-h-screen`, content `px-8 lg:px-16`, heading left-aligned
- **Breakpoints**: `sm: 640px, md: 768px, lg: 1024px, xl: 1280px`

---

## Part II — CC Club Dark Neumorphic System

Scoped entirely to `.cc-club-scope`. The CCButton applies the transition: clicking it overlays `#252436` via a `clip-path` iris animation, then navigates to `/club`.

### Core Principle

Everything is carved from the same warm dark clay (`#252436`). Shadows are the only boundary. No borders on neumorphic elements. Accent colors are never used as surface fills.

---

### CC Club Color Tokens

#### Surfaces (implied depth hierarchy)

| Token | Hex | Role |
|---|---|---|
| `--cc-bg` | `#252436` | Base clay — page and standard surfaces |
| `--cc-surface` | `#252436` | Raised elements (shadows do the work) |
| `--cc-surface-raised` | `#2C2A40` | Elevated panels, key cards |
| `--cc-surface-inset` | `#1C1A2B` | Inset wells, pressed inputs, chip backgrounds |
| `--cc-surface-deep` | `#151322` | Deepest — icon wells, active states, divider fill |
| `--cc-border` | `rgba(255,255,255,0.04)` | Hairline (used sparingly only) |

#### Typography

| Token | Value | Role |
|---|---|---|
| `--cc-text` | `#E8E6F0` | Primary — warm lavender-white |
| `--cc-text-muted` | `#9B97AD` | Secondary labels, metadata |
| `--cc-text-faint` | `#6E6A7C` | Tertiary — hints, placeholders |

#### Accent (Purple / Lavender) — Text, Icons, Glows ONLY

| Token | Value | Role |
|---|---|---|
| `--cc-accent` | `#8B7FFF` | Primary accent |
| `--cc-accent-bright` | `#A89CFF` | Hover text, active icons |
| `--cc-accent-vivid` | `#C4BCFF` | Gradient end, selected states |
| `--cc-accent-soft` | `rgba(139,127,255,0.10)` | Badge fills |
| `--cc-accent-glow` | `rgba(139,127,255,0.20)` | Ambient orb glow |

#### Semantic Status Colors (Text / Icon only — never fills)

| Token | Value | Role |
|---|---|---|
| `--cc-amber` | `hsl(38 88% 65%)` | Warning / gold |
| `--cc-success` | `#4ADE80` | Pass / completed |
| `--cc-danger` | `#F87171` | Fail / redo |
| `--cc-pending` | `#60A5FA` | In-progress |
| `--cc-teal` | `hsl(160 60% 50%)` | Trainer role |

Soft variants: `--cc-amber-soft`, `--cc-success-soft`, `--cc-warning-soft`, `--cc-danger-soft`, `--cc-pending-soft`, `--cc-teal-soft` — all `rgba(..., 0.08–0.10)` for chip fills.

---

### CC Club Shadow Physics

**Light source**: top-left. **Dark/light ratio**: ~35-45% dark, ~6-8% light. The asymmetry is what makes dark neumorphism work.

```css
--cc-shadow-dark:         rgba(0, 0, 0, 0.35)
--cc-shadow-light:        rgba(255, 255, 255, 0.06)
--cc-shadow-dark-strong:  rgba(0, 0, 0, 0.45)
--cc-shadow-light-strong: rgba(255, 255, 255, 0.08)
```

#### Extruded Scale

```
--cc-neu-xs:  2px  2px  5px  dark,  -2px  -2px  5px  light
--cc-neu-sm:  4px  4px  10px dark,  -4px  -4px  10px light
--cc-neu-md:  6px  6px  16px dark,  -6px  -6px  16px light
--cc-neu-lg:  8px  8px  22px dark*, -8px  -8px  22px light*   (* = strong variants)
--cc-neu-xl:  12px 12px 30px dark*, -12px -12px 30px light*
```

#### Inset Scale

```
--cc-neu-inset-xs:   inset 2px 2px 4px   dark,  inset -2px -2px 4px   light
--cc-neu-inset-sm:   inset 3px 3px 8px   dark,  inset -3px -3px 8px   light
--cc-neu-inset-md:   inset 5px 5px 14px  dark,  inset -5px -5px 14px  light
--cc-neu-inset-deep: inset 8px 8px 20px  dark*, inset -8px -8px 20px  light*
```

#### Glow Tokens

```css
--cc-glow-purple:    0 0 0 2px (surface-deep), 0 0 0 4px (accent)  /* focus ring */
--cc-glow-purple-sm: 0 0 10px rgba(139,127,255,0.28)
--cc-glow-purple-md: 0 0 16px rgba(139,127,255,0.32)
--cc-glow-purple-lg: 0 0 22px rgba(139,127,255,0.36)
--cc-glow-btn-hover: 0 0 18px rgba(139,127,255,0.38), 0 4px 12px rgba(139,127,255,0.22)  /* PRIMARY BUTTON HOVER */
--cc-glow-amber:     0 0 16px rgba(255,185,85,0.30)
--cc-glow-amber-sm:  0 0 10px rgba(255,185,85,0.22)
--cc-glow-success:   0 0 14px rgba(74,222,128,0.26)
--cc-glow-teal:      0 0 16px rgba(52,211,153,0.26)
```

> `--cc-glow-btn-hover` is a purpose-built tight glow for `.cc-btn-primary:hover`. The old `--cc-glow-purple-lg` (which was 40px radius) was replaced because it spread too far and looked jarring against the dark background.

---

### CC Club Gradients

```css
--cc-grad-accent:        linear-gradient(135deg, #8B7FFF 0%, #A89CFF 100%)
--cc-grad-accent-subtle: linear-gradient(135deg, rgba(139,127,255,0.15), rgba(139,127,255,0.05))
--cc-grad-amber:         linear-gradient(135deg, hsl(38 80% 55%), hsl(38 92% 68%))
--cc-grad-success:       linear-gradient(135deg, hsl(145 65% 42%), hsl(160 65% 52%))
--cc-grad-teal:          linear-gradient(135deg, hsl(160 55% 42%), hsl(175 60% 52%))
```

**Hero Orb Gradients** (parallax ambient backgrounds in CCHero):
```css
--cc-orb-purple: radial-gradient(circle, rgba(139,127,255,0.18) 0%, rgba(139,127,255,0.06) 50%, transparent 70%)
--cc-orb-amber:  radial-gradient(circle, rgba(255,185,85,0.14) 0%, rgba(255,185,85,0.04) 50%, transparent 70%)
--cc-orb-teal:   radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)
```

CCHero has mouse-parallax on three orbs: orb1 moves at 0.6x cursor offset, orb2 at -0.4x, orb3 at 0.25x.

---

### CC Club Surface Classes

```css
.cc-surface        -> bg: #252436  + --cc-neu-md
.cc-surface-raised -> bg: #2C2A40  + --cc-neu-lg
.cc-inset          -> bg: #1C1A2B  + --cc-neu-inset-md
.cc-inset-sm       -> bg: #1C1A2B  + --cc-neu-inset-sm
.cc-inset-deep     -> bg: #151322  + --cc-neu-inset-deep
```

---

### CC Club Buttons

#### .cc-btn-primary

```
Background:       --cc-grad-accent
Text:             #F0EDFF
Default shadow:   --cc-neu-sm + --cc-glow-purple-sm
Hover shadow:     --cc-neu-lg + --cc-glow-btn-hover
Hover transform:  translateY(-2px)
Active shadow:    --cc-neu-inset-sm
Active transform: translateY(0.5px)
Disabled:         opacity 0.45 + --cc-neu-xs
Transition:       box-shadow 300ms + transform 300ms cubic-bezier(0.16, 1, 0.3, 1)
```

#### .cc-btn-ghost

```
Background:    --cc-bg (same as surface)
Text:          --cc-accent-bright
Default:       --cc-neu-sm
Hover:         --cc-neu-md + --cc-glow-purple-sm
Hover text:    --cc-accent-vivid
Hover:         translateY(-1px)
Active:        --cc-neu-inset-sm
```

#### .cc-btn-back

```
Background:   --cc-bg
Text:         --cc-text-muted (hover: --cc-accent-bright)
Default:      --cc-neu-xs
Hover:        --cc-neu-sm + translateY(-1px)
Size:         padding 8px 14px, border-radius 10px, font-size 0.82rem
```

---

### CC Club Chips (.cc-chip)

```css
Shape:     border-radius: 999px (pill)
Shadow:    --cc-neu-inset-xs
Text:      0.72rem, weight 500, tracking 0.04em, uppercase
Padding:   3px 10px
Background (all variants): --cc-surface-inset (#1C1A2B)

.cc-chip-pending -> color: --cc-pending  (blue)
.cc-chip-done    -> color: --cc-success  (green)
.cc-chip-redo    -> color: --cc-danger   (red)
.cc-chip-idle    -> color: --cc-text-faint
.cc-chip-amber   -> color: --cc-amber    (gold)
```

### CC Club Divider (.cc-divider)

```css
height: 1px
background: #151322
box-shadow: 0 1px 0 rgba(255,255,255,0.06)  /* creates groove illusion */
margin: 1.5rem 0
```

### CC Club Text Gradients

```css
.cc-text-gradient         -> accent -> accent-bright -> accent-vivid (purple)
.cc-text-amber-gradient   -> --cc-grad-amber
.cc-text-success-gradient -> --cc-grad-success
.cc-text-teal-gradient    -> --cc-grad-teal
```

---

### CC Club Animations

```
cc-shimmer-bg       8s ∞    orb: scale + opacity breathe (purple)
cc-shimmer-amber    10s ∞   orb: scale + opacity breathe (amber)
cc-pulse-ring       2.4s ∞  scale(0.92→1.08), opacity(0.6→0) — live/active badge pulsing
cc-score-count      0.4s    translateY(6px→0) — score pop-in
cc-node-pop         0.5s    scale(0.5→1) spring(0.34,1.56,0.64,1) — timeline nodes
cc-fade-in-up       0.6s    translateY(20px→0) + opacity(0→1)
cc-glow-pulse-amber 3s ∞    box-shadow between --cc-neu-sm+amber-sm and --cc-neu-md+amber
cc-count-up         0.5s    spring(0.34,1.56,0.64,1) — stat number reveal
```

CSS animation utility classes: `.cc-animate-shimmer .cc-animate-shimmer-amber .cc-animate-pulse-ring .cc-animate-score .cc-animate-node .cc-animate-fade-up .cc-animate-glow-amber .cc-animate-count`

**Framer Motion** (within CC Club components):
- Default entrance: `initial: { opacity: 0, y: 16 }`, `animate: { opacity: 1, y: 0 }`, `duration: 0.6, delay: n * 0.08`
- Stat pills: `{ opacity: 0, y: 16 }` stagger per pill

---

### CC Club Scrollbar

```css
Width:   5px
Track:   #151322 (--cc-surface-deep)
Thumb:   rgba(139,127,255,0.15) → 0.35 on hover
Radius:  100px
```

### CC Club Responsive

```css
@media (max-width: 900px)     -> .cc-gamification-panel { display: none }
@media (901px - 1100px)       -> .cc-dashboard-body { padding-right: 180px }
@media (max-width: 640px)     -> .cc-hero-stats, .cc-hero-cta { flex-direction: column; gap: 12px }
```

---

## Part III — Shared Tailwind Config Tokens

### Timing

```
duration-neo:      300ms
duration-neo-slow: 500ms
ease-neo:          cubic-bezier(0.4, 0, 0.2, 1)
```

### Tailwind CC Shadow Utilities (shadow-cc-neo-* classes)

```
shadow-cc-neo-extruded:       6px  6px  16px rgba(0,0,0,0.35),  -6px  -6px  16px rgba(255,255,255,0.06)
shadow-cc-neo-extruded-hover: 8px  8px  22px rgba(0,0,0,0.45),  -8px  -8px  22px rgba(255,255,255,0.08)
shadow-cc-neo-extruded-sm:    4px  4px  10px rgba(0,0,0,0.35),  -4px  -4px  10px rgba(255,255,255,0.06)
shadow-cc-neo-inset:          inset 5px 5px 14px rgba(0,0,0,0.35), inset -5px -5px 14px rgba(255,255,255,0.06)
shadow-cc-neo-inset-deep:     inset 8px 8px 20px rgba(0,0,0,0.45), inset -8px -8px 20px rgba(255,255,255,0.08)
shadow-cc-neo-inset-sm:       inset 3px 3px 8px rgba(0,0,0,0.35),  inset -3px -3px 8px rgba(255,255,255,0.06)
```

---

## Admin / Print Fonts

Used in generated print reports (PDF-rendered HTML within `AdminDashboard.tsx` and `CCPresidentDashboard.tsx`):

- Body: `DM Sans`, 12px
- Report title: `DM Serif Display`, 28px (Admin) / 26px (CC President)
- Background: `#fff`, text: `#1a1a2e`

These are print-context styles only — never used in the UI.

---

## Accessibility

| Pairing | Ratio | WCAG |
|---|---|---|
| `neo-fg` (#3D4852) on `neo-base` (#E0E5EC) | 7.5:1 | **AAA** |
| `neo-muted` (#6B7280) on `neo-base` (#E0E5EC) | 4.6:1 | **AA** |
| `--cc-text` (#E8E6F0) on `--cc-bg` (#252436) | ~11:1 | **AAA** |
| `--cc-text-muted` (#9B97AD) on `--cc-bg` (#252436) | ~5.2:1 | **AA** |

- Touch targets: 48px minimum
- Focus: `shadow-neo-focus` (main site), `--cc-glow-purple` (CC Club)
- Use `motion-safe:` for ambient animations

---

## Anti-Patterns

### Main Site
- NO: `bg-white` / `#FFFFFF` — use `bg-neo-base` (#E0E5EC)
- NO: Solid hex shadows — always rgba()
- NO: Using `font-display` or `font-sans` for the hero brand name — it must be Erica One
- NO: Borders to define structure — shadows only
- NO: Using `bg-background` (#EFEFF7) for neumorphic element surfaces — use `bg-neo-base` (#E0E5EC)

### CC Club
- NO: `--cc-accent` as card/panel background fill
- NO: Pure black (#000000, #121212) as canvas — must be #252436
- NO: `--cc-glow-purple-lg` for button hover — use `--cc-glow-btn-hover`
- NO: Borders on neumorphic CC elements
- NO: `.neu-*` classes inside `.cc-club-scope` — CC scope uses only `.cc-*` tokens

---

## File Map

| File | Purpose |
|---|---|
| `index.html` | Loads Erica One + Fredoka from Google Fonts |
| `src/index.css` | All CSS vars, shadow tokens, .cc-club-scope, animations, utility classes |
| `tailwind.config.ts` | Shadow, color, radius, keyframe, timing tokens |
| `src/pages/Index.tsx` | Erica One hero heading + GSAP SplitText animations |
| `src/components/ui/EnrollNowButton.tsx` | Styled-components CTA button — purple neumorphic with GSAP char animation |
| `src/components/ui/CCButton.tsx` | Circular portal button — iris transition to CC Club |
| `src/components/ui/neumorphic-button.tsx` | Main site NeumorphicButton (Framer Motion) |
| `src/components/ui/neumorphic-card.tsx` | Main site NeumorphicCard (Framer Motion) |
| `src/components/ui/SplitText.tsx` | GSAP SplitText wrapper for hero text animation |
| `src/components/PageLoader.tsx` | GSAP 4-phase iris page loader |
| `src/components/layout/Navbar.tsx` | Scroll-aware neumorphic navbar |
| `src/components/layout/Footer.tsx` | Gradient footer with blob accents |
| `src/components/club/CC*.tsx` | All CC Club components — always under .cc-club-scope |
