  # Avant-Garde Neumorphism & Deep Lavender Design System

  ## Design Philosophy

  **Core Principles**: This design system merges tactile Neumorphism (Soft UI) with high-contrast, editorial typography and vivid color blocking. Neumorphism creates the illusion of physical depth through carefully balanced dual shadows—one light source from the top-left, one dark shadow falling bottom-right—on specialized monochromatic surfaces. Elements appear to either extrude from the surface (convex/raised) or be pressed into it (concave/inset). Every component feels like it is molded directly from a continuous porcelain sheet, rather than layered flat on top of it.

  **Vibe**: Visually stunning, high-fashion, tactile, and arresting. By abandoning traditional, sterile greys for a brilliant white-porcelain canvas punctuated by striking lavender and deep violet details, the UI looks premium, intentional, and physically grounded. The aesthetic utilizes dramatic typography scales to command attention instantly, while adhering rigorously to WCAG AA and AAA accessibility contrast metrics.

  **Unique Visual Signatures**:

  - **Dual Opposing Lavender-Tinted Shadows**: The top-left catches crisp white light, while the bottom-right projects a soft, diffuse shadow tinted with a drop of cool lavender pigment for smoother blending and richer depth.
  - **Porcelain Surface Discipline (`#F4F5F9`)**: A hyper-clean, slightly warm off-white that acts as the physical plane. Cards and structural elements share this background code to maintain the "molded surface" illusion.
  - **Deep Velvet Dark Intercepts**: Isolated, high-impact sections utilize an inverted dark palette built on a rich midnight-purple foundation (`#0B0813`), maintaining systemic continuity via matching neon lavender glows.
  - **Deep Inset States**: Wells for icons and inputs that feel significantly deeper (`insetDeep`) than standard pressed states, creating true 3D depth.
  - **Soft, Hyper-Rounded Corners**: `32px` for containers and `16px` for smaller elements, reinforcing the pillowed, organic aesthetic.
  - **Complex Nested Depth**: Visuals formed by nesting elements (Extruded → Inset → Extruded) to showcase the physics of the system.
  - **Smooth Micro-interactions**: 300ms transitions with scale, rotation, and shadow depth changes. Floating animations for ambient motion.
  - **Mobile-First Responsive**: Fully responsive with touch-friendly targets (44px minimum), hamburger menu, and maintained neumorphic aesthetic on all screen sizes.

  ---

  ## Design Token System (The DNA)

  ### Colors (Primary Light Mode)

  The palette balances clean, high-reflectivity porcelain fields with hyper-saturated, modern purples.

  - **Background**: `#F4F5F9` — The base porcelain surface. Clean, radiant, and soft.
  - **Foreground**: `#110D20` — Deep obsidian-purple for primary typography. Yields an ultra-sharp 16.4:1 contrast ratio against the background.
  - **Muted**: `#5A527A` — Medium slate-lavender for secondary typography and structural hints. Exceeds WCAG AA benchmarks (5.3:1 contrast ratio).
  - **Accent**: `#6D28D9` — Electric Lavender-Violet for hero highlights, interactive focus anchors, and primary call-to-actions.
  - **Accent Light**: `#A78BFA` — Pale pastel lavender used exclusively for gradient headers and internal hover glares.
  - **Accent Secondary**: `#F472B6` — Radiant Orchid-Pink for success states, secondary badges, and micro-highlights.
  - **Border**: `transparent` — Neumorphism **never** uses borders; shadows define all structural boundaries.

  **Shadow Colors** (Light Mode Physics):

  - **Shadow Light**: `rgba(255, 255, 255, 0.95)` — Intense white highlight focusing light on the top-left rim.
  - **Shadow Dark**: `rgba(188, 192, 212, 0.45)` — A soft, desaturated lavender-grey shadow stabilizing the bottom-right footprint.

  ---

  ### Special Section: Deep Velvet Dark Mode

  For the designated dark sections, the system reverses its polarities into an ultra-premium, light-emitting container structure.

  - **Dark Background**: `#0B0813` — Infinite midnight-purple canvas.
  - **Dark Foreground**: `#F5F3FF` — Ghostly lavender-white for pristine legibility.
  - **Dark Muted**: `#9333EA` — Pure violet for secondary headers and glowing vectors.

  **Dark Mode Shadow Physics**:

  - **Dark Shadow Light**: `rgba(29, 21, 51, 0.6)` — Deep structural recess shadow (top-left).
  - **Dark Shadow Dark**: `rgba(2, 1, 4, 0.9)` — Heavy anchoring ambient occlusion shadow (bottom-right).
  - **Dark Inset Glow**: `rgba(167, 139, 250, 0.15)` — Internal radioactive lavender emission for interactive inputs.

  ---

  ### Typography

  To prevent standard "AI slop" or generic tech layout traits, the system employs high-character, structural display typefaces paired with crisp, neo-grotesque body frames.

  - **Display Font**: **"Clash Display"** (500, 600, 700) by Custom Type Foundry — A high-fashion, structural sans with striking geometric quirks, tightly packed terminals, and intense visual weight. Applied via `.font-display`.
  - **Body Font**: **"Cabinet Grotesk"** (400, 500, 700) — A wide, highly technical, yet incredibly scalable typeface that looks distinctly editorial. Applied via `.font-body`.
  - **Weights**:
    - Display Headings: `font-bold` (700) with custom `tracking-tight` (-0.03em)
    - Standard Headings: `font-semibold` (600) with `tracking-tight`
    - Body Text: `font-normal` (400) to `font-medium` (500)
  - **Scale**: Aggressive, editorial scale ranging from `text-sm` (14px) up to an oversized `text-8xl` (96px) for massive hero phrases.

  ---

  ### Radius

  - **Container / Card**: `32px` (`rounded-[32px]`) — Very soft, organic, and pillowed frames.
  - **Base / Button**: `16px` (`rounded-2xl`).
  - **Inner Elements**: `12px` (`rounded-xl`) or `9999px` (`rounded-full`).

  ---

  ### Shadows & Effects (The Physics)

  #### 1. Light Mode Formulas (Base Canvas: `#F4F5F9`)

  **Extruded (Standard)** — The default resting structural card:

  ```css
  box-shadow:
    8px 8px 20px rgba(188, 192, 212, 0.45),
    -8px -8px 20px rgba(255, 255, 255, 0.95);
  ```

  - **Tailwind**: `shadow-[8px_8px_20px_rgba(188,192,212,0.45),-8px_-8px_20px_rgba(255,255,255,0.95)]`

  **Extruded Hover (Lifted)** — High interaction engagement:

  ```css
  box-shadow:
    14px 14px 28px rgba(188, 192, 212, 0.55),
    -14px -14px 28px rgba(255, 255, 255, 1);
  ```

  - **Tailwind**: `shadow-[14px_14px_28px_rgba(188,192,212,0.55),-14px_-14px_28px_rgba(255,255,255,1)]`

  **Inset (Pressed)** — For standard inputs, sliders, and active depressions:

  ```css
  box-shadow:
    inset 6px 6px 12px rgba(188, 192, 212, 0.4),
    inset -6px -6px 12px rgba(255, 255, 255, 0.9);
  ```

  **Inset Deep** — For deep-set icon wells or dramatic text areas:

  ```css
  box-shadow:
    inset 10px 10px 24px rgba(188, 192, 212, 0.5),
    inset -10px -10px 24px rgba(255, 255, 255, 0.95);
  ```

  #### 2. Dark Mode Formulas (Deep Velvet Section: `#0B0813`)

  **Dark Extruded (Standard)**:

  ```css
  box-shadow:
    8px 8px 20px rgba(2, 1, 4, 0.9),
    -8px -8px 20px rgba(29, 21, 51, 0.6);
  ```

  - **Tailwind**: `shadow-[8px_8px_20px_rgba(2,1,4,0.9),-8px_-8px_20px_rgba(29,21,51,0.6)]`

  **Dark Inset (Pressed)**:

  ```css
  box-shadow:
    inset 6px 6px 12px rgba(2, 1, 4, 0.9),
    inset -6px -6px 12px rgba(29, 21, 51, 0.6);
  ```

  ---

  ## Component Styling

  ### Buttons

  - **Shape**: `rounded-2xl`
  - **Transition**: `duration-300 cubic-bezier(0.16, 1, 0.3, 1)` (Ultra-smooth custom ease-out).
  - **Default State**: Extruded light-mode shadow paired with an obsidian foreground color.
  - **Hover State**: `translate-y-[-2px]` (Snappy vertical lift) + `Extruded Hover` shadow parameters.
  - **Active State**: `translate-y-[0.5px]` (Physical click compress) + `Inset` shadow state.
  - **Primary Lavender Variant**: Background colored completely in Accent Violet (`#6D28D9`). Text color switches to `#F4F5F9`. Active click state utilizes an internal dark purple alpha mask shadow to simulate color compression: `box-shadow: inset 4px 4px 8px rgba(0,0,0,0.4)`.

  ### Cards

  - **Shape**: `rounded-[32px]` (Highly pronounced corner profiles).
  - **Background**: `#F4F5F9`.
  - **Padding**: `p-8` for telemetry readouts up to `p-24` for macro narrative heroes.
  - **Micro-Physics**: When hovered, cards lift (`-translate-y-1`) and transition to an enhanced depth matrix, isolating the content. Internal features exploit layered hierarchy: Card (Extruded) $\rightarrow$ Inner Asset Pod (Inset Deep) $\rightarrow$ Active Interactive Icon (Extruded).

  ### Inputs

  - **Shape**: `rounded-2xl`.
  - **Background**: `#F4F5F9`.
  - **Default**: Static `Inset` shadow map.
  - **Focus**: `Inset Deep` shadow + structural outer Accent Violet outer halo (`ring-2 ring-[#6D28D9]`) offset by exactly `3px` using a `#F4F5F9` solid block color spacer.
  - **Placeholder**: `#5A527A` at `50%` opacity.

  ### Visual Decorations

  - **Lavender Orbs**: Soft, blurred CSS radial gradients floating underneath structural layers, mixing with the soft-molded topography.
  - **Icon Wells**: Deep-drilled circular sockets (`rounded-full` + `Inset Deep`) that ground iconography firmly into the grid architecture.

  ---

  ## Layout Principles

  - **Spacing**: Expansive, luxury editorial layouts. Minimal structural friction. Standard grid matrices utilize `gap-16` on desktop viewports, with hero structures isolated with `py-40` spacers to provide clear shadow boundaries.
  - **Container**: `max-w-7xl` with a mandatory responsive horizontal protective margin padding of `px-6`.
  - **Background**: Page base must remain anchored to `#F4F5F9`. Transitions to `#0B0813` must occur across full screen-width section blocks to maintain visual continuity.

  ---

  ## Animation & Micro-interactions

  - **Duration**: `300ms` for standard interactive elements, `600ms` for large layout shifts or full dark-to-light scroll triggers.
  - **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for high-end, premium responsive snapping.
  - **Hover Transitions**:
  - Elements scale smoothly (`scale-[1.02]`) on hover while shifting their shadow depths.
  - Nested components perform rotational or positional micro-offsets to showcase independent depth axes.

  - **Ambient Levitation**: Custom `@keyframes softFloat` cycles architectural accents through a subtle 4px vertical animation loop every 6 seconds to breathe life into the application canvas.

  ---

  ## Accessibility

  - **Contrast Calculations**:
  - Primary Obsidian Text (`#110D20`) on Porcelain (`#F4F5F9`): **16.4:1** (Exceeds WCAG AAA).
  - Slate-Lavender Text (`#5A527A`) on Porcelain (`#F4F5F9`): **5.3:1** (Exceeds WCAG AA).
  - Light-Violet Text (`#F5F3FF`) on Dark Canvas (`#0B0813`): **18.1:1** (Exceeds WCAG AAA).

  - **Focus States**: Explicit, high-visibility interactive focus outlines are mandatory. Every element supports tab-navigation indexing with clear responsive state indications.
  - **Touch Targets**: Minimum interactive sizing maps out to `48px` absolute bounds on all layout screens.

  ---

  ## Responsive Design

  - **Mobile First**: Fluid scaling workflows determine all breakpoint progressions.
  - **Breakpoints**: Standardized across `sm:` (640px), `md:` (768px), `lg:` (1024px), and `xl:` (1280px).
  - **Adaptation Controls**:
  - Font scales transition using fluid typography equations (`text-4xl` up to `text-8xl` depending on the device environment).
  - High-depth multi-layered card components simplify their internal physics matrices on mobile screens to save GPU rendering cycles on lower-end mobile displays.
  - Navigation switches from an expansive, open horizontal top-bar to a full-screen, high-depth slide-down porcelain panel on smaller mobile devices.

  ---

  ## Anti-Patterns (Do Not Do)

  - **Flat Pure Whites**: Do not use `bg-white` or `#FFFFFF` for structural containers or cards. It breaks the lighting model. All soft surfaces must remain anchored to `#F4F5F9`.
  - **Saturated Dark Grays**: Dark mode sections must not use industrial charcoal or pure black backgrounds (e.g., `#121212`). They must use the designated deep midnight-purple tint (`#0B0813`).
  - **Standard Generic Fonts**: Do not swap out the premium typographic pairing for generic system fonts like Arial, Inter, or Roboto. The visual identity relies heavily on the editorial feel of Clash Display and Cabinet Grotesk.
  - **Opaque Hex Shadows**: Avoid hard, opaque black hex codes for drop shadows (e.g., `#000000`). Shadows must always use transparent alpha channels (`rgba`) to blend natively into the underlying lavender and porcelain pigments.
  - **Unchecked Thin Weights**: Avoid utilizing font weights under `400` on colored background structures to protect visual clarity and readability.

  ---

  ## CC Club Section — Dark Neumorphic System v2

  The **CC Club** section uses a specialized scoped theme (`.cc-club-scope`) that implements a monochromatic, warm dark clay surface (`#2D3039`). Unlike the main site's high-contrast porcelain approach, this section relies purely on physical depth to define boundaries, without utilizing borders or flat color blocks for UI elements.

  ### Principles
  - **Monochromatic Canvas**: Every structural element shares the exact same base color (`--cc-bg`: `#2D3039`).
  - **Shadow Physics**: Depth is the only differentiator. Dark shadows (`rgba(0,0,0,0.35)`) drop bottom-right, while thin highlights (`rgba(255,255,255,0.06)`) define the top-left edge.
  - **No Borders**: Neumorphic components use light and shadow, not lines, to create shape boundaries.

  ### Component Rules
  - **Surfaces (`.cc-surface`)**: Standard raised UI containers, utilizing a medium drop-shadow (`var(--cc-neu-md)`).
  - **Inset Wells (`.cc-inset`)**: Concave sections designed for inputs, image holders, or active depressed states.
  - **Buttons (`.cc-btn-primary`)**: Utilizes a simpler 2-stop lavender-to-violet gradient (`--cc-grad-accent`) combined with an extruded physical base that compresses into an inset state upon clicking.
  - **Accent Colors**: Used strictly for text highlights, iconography, progress bars, and glowing halos. Background fills are never used for functional surfaces.
