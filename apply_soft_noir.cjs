const fs = require('fs');
const css = fs.readFileSync('src/index.css', 'utf8');

const startStr = '/* ═══════════════════════════════════════════════════════════\r\n   🌿 CC CLUB — DARK CYBER-EMERALD NEUMORPHIC DESIGN SYSTEM';
const startStr2 = '/* ═══════════════════════════════════════════════════════════\n   🌿 CC CLUB — DARK CYBER-EMERALD NEUMORPHIC DESIGN SYSTEM';
const endStr = '.cc-club-scope *::-webkit-scrollbar-thumb:hover { background: var(--cc-accent-soft); }';

let startIndex = css.indexOf(startStr);
if (startIndex === -1) startIndex = css.indexOf(startStr2);
const endIndex = css.indexOf(endStr) + endStr.length;

if (startIndex === -1 || endIndex < startIndex) {
  console.log('Could not find block to replace.');
  process.exit(1);
}

const replacement = `/* ═══════════════════════════════════════════════════════════
   🌙 CC CLUB — SOFT NOIR DARK NEUMORPHIC DESIGN SYSTEM
   Scoped to .cc-club-scope — never pollutes the main site.
   ═══════════════════════════════════════════════════════════ */

.cc-club-scope {
  /* ── Background layers ── */
  --cc-bg:              #1E222B;          /* premium deep slate-charcoal clay base */
  --cc-surface:         #1E222B;          /* elements molded from the background */
  --cc-surface-raised:  #1E222B;          /* raised elements are also molded */
  --cc-border:          transparent;      /* Neumorphic physics forbid standard borders */

  /* ── Typography ── */
  --cc-text:            #E2E8F0;          /* High legibility off-white/slate text (WCAG AAA) */
  --cc-text-muted:      #94A3B8;          /* Soft grey for secondary text (WCAG AA) */
  --cc-text-faint:      #64748B;          /* Even softer grey */

  /* ── Accent palette (Vibrant violet) ── */
  --cc-accent:          #6C63FF;          /* Vibrant violet core state */
  --cc-accent-bright:   #8B84FF;          /* Upper gradient step / hover */
  --cc-accent-vivid:    #A39EFF;          /* Vivid highlight */
  --cc-accent-soft:     rgba(108, 99, 255, 0.15); 
  --cc-accent-glow:     rgba(108, 99, 255, 0.28);

  /* ── Semantic colors ── */
  --cc-amber:           hsl(38 88% 65%);
  --cc-amber-soft:      rgba(255,185,85,0.15);

  --cc-success:         #38B2AC;          /* Matte teal for verification */
  --cc-success-soft:    rgba(56, 178, 172, 0.15);
  --cc-warning:         hsl(38 88% 65%);
  --cc-warning-soft:    rgba(255,185,85,0.15);
  --cc-danger:          hsl(0 72% 62%);
  --cc-danger-soft:     rgba(248,113,113,0.15);
  --cc-pending:         hsl(200 70% 60%);
  --cc-pending-soft:    rgba(96,165,250,0.15);

  /* ── Soft Noir Neumorphic shadow system ──
     Extracted to Tailwind config as well, but mapping to CSS vars for custom classes
  ── */
  --cc-shadow-dark:     rgba(0, 0, 0, 0.5);
  --cc-shadow-light:    rgba(255, 255, 255, 0.04);
  
  --cc-shadow-dark-hover:  rgba(0, 0, 0, 0.6);
  --cc-shadow-light-hover: rgba(255, 255, 255, 0.05);

  --cc-neu-sm:
    4px 4px 8px var(--cc-shadow-dark),
    -4px -4px 8px var(--cc-shadow-light);

  --cc-neu-md:
    6px 6px 14px var(--cc-shadow-dark),
    -6px -6px 14px var(--cc-shadow-light);

  --cc-neu-lg:
    10px 10px 24px var(--cc-shadow-dark),
    -10px -10px 24px var(--cc-shadow-light);

  --cc-neu-inset-sm:
    inset 3px 3px 7px var(--cc-shadow-dark),
    inset -3px -3px 7px var(--cc-shadow-light);

  --cc-neu-inset-md:
    inset 5px 5px 12px var(--cc-shadow-dark),
    inset -5px -5px 12px var(--cc-shadow-light);

  --cc-neu-inset-deep:
    inset 8px 8px 20px var(--cc-shadow-dark),
    inset -8px -8px 20px var(--cc-shadow-light);

  /* ── Glow tokens ── */
  --cc-glow-purple:     0 0 0 2px #0f0818, 0 0 0 4px #9570C6;
  --cc-glow-purple-md:  0 0 20px rgba(149,112,198,0.4);
  --cc-glow-purple-lg:  0 0 40px rgba(149,112,198,0.5);
  --cc-glow-amber:      0 0 20px rgba(255,185,85,0.35);

  /* ── Keep legacy aliases so existing components don't break ── */
  --cc-glow-teal:       var(--cc-glow-purple-md);
  --cc-glow-teal-lg:    var(--cc-glow-purple-lg);

  /* ── Gradients ── */
  /* Hero: deep purple atmospheric radial */
  --cc-grad-hero:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(149,112,198,0.20), transparent 70%),
    linear-gradient(180deg, #0f0818, #120a1e);

  /* Accent CTA: Russian Violet → Amethyst → Bright Lavender */
  --cc-grad-accent:
    linear-gradient(135deg, #391B49 0%, #795690 45%, #9570C6 80%, #C29CE4 100%);

  /* Card backgrounds (raised from surface) */
  --cc-grad-card:
    linear-gradient(145deg, #2a1240, #1e0d2e);

  --cc-grad-surface:
    linear-gradient(145deg, #391B49, #2a1240);

  /* Amber (unchanged) */
  --cc-grad-amber:
    linear-gradient(135deg, hsl(38 80% 55%), hsl(38 92% 68%));

  font-family: 'Erica One', sans-serif;
  color: var(--cc-text);
  background: var(--cc-bg);
  min-height: 100vh;
}

/* ─────────────────────────────────────
   DARK PURPLE NEU SURFACE CLASSES
───────────────────────────────────── */

.cc-club-scope .cc-surface {
  background: var(--cc-grad-card);
  box-shadow: var(--cc-neu-md);
}

.cc-club-scope .cc-surface-raised {
  background: var(--cc-grad-surface);
  box-shadow: var(--cc-neu-lg);
}

.cc-club-scope .cc-inset {
  background: #1e0d2e;
  box-shadow: var(--cc-neu-inset-md);
}

.cc-club-scope .cc-inset-sm {
  background: #1e0d2e;
  box-shadow: var(--cc-neu-inset-sm);
}

.cc-club-scope .cc-inset-deep {
  background: #0f0818;
  box-shadow: var(--cc-neu-inset-deep);
}

/* ─────────────────────────────────────
   BUTTONS
───────────────────────────────────── */

.cc-club-scope .cc-btn-primary {
  background: var(--cc-grad-accent);
  color: #f0ecf8;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition:
    box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1),
    transform   300ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--cc-neu-md), var(--cc-glow-purple-md);
}

.cc-club-scope .cc-btn-primary:hover {
  box-shadow: var(--cc-neu-lg), var(--cc-glow-purple-lg);
  transform: translateY(-2px);
}

.cc-club-scope .cc-btn-primary:active {
  box-shadow: var(--cc-neu-inset-sm);
  transform: translateY(0.5px);
}

.cc-club-scope .cc-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.cc-club-scope .cc-btn-ghost {
  background: transparent;
  color: var(--cc-accent-vivid);
  border: 1.5px solid rgba(121,86,144,0.4);
  cursor: pointer;
  font-weight: 600;
  transition: background 250ms ease, border-color 250ms ease, color 250ms ease;
}

.cc-club-scope .cc-btn-ghost:hover {
  background: var(--cc-accent-soft);
  border-color: var(--cc-accent-bright);
  color: #f0ecf8;
}

/* ─────────────────────────────────────
   CHIPS / BADGES
───────────────────────────────────── */

.cc-club-scope .cc-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
}

.cc-club-scope .cc-chip-pending  { background: var(--cc-pending-soft);  color: var(--cc-pending); }
.cc-club-scope .cc-chip-done     { background: var(--cc-success-soft);  color: var(--cc-success); }
.cc-club-scope .cc-chip-redo     { background: var(--cc-danger-soft);   color: var(--cc-danger); }
.cc-club-scope .cc-chip-idle     { background: rgba(121,86,144,0.15);   color: var(--cc-text-faint); }
.cc-club-scope .cc-chip-amber    { background: var(--cc-amber-soft);    color: var(--cc-amber); }

/* ─────────────────────────────────────
   GRADIENT TEXT
───────────────────────────────────── */

.cc-club-scope .cc-text-gradient {
  background: linear-gradient(135deg, #9570C6, #C29CE4, #999ECF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cc-club-scope .cc-text-amber-gradient {
  background: var(--cc-grad-amber);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─────────────────────────────────────
   DIVIDER
───────────────────────────────────── */

.cc-club-scope .cc-divider {
  border: none;
  border-top: 1px solid var(--cc-border);
  margin: 1.5rem 0;
}

/* ─────────────────────────────────────
   SCROLLBAR
───────────────────────────────────── */

.cc-club-scope::-webkit-scrollbar,
.cc-club-scope *::-webkit-scrollbar { width: 6px; }

.cc-club-scope::-webkit-scrollbar-track,
.cc-club-scope *::-webkit-scrollbar-track { background: #0f0818; }

.cc-club-scope::-webkit-scrollbar-thumb,
.cc-club-scope *::-webkit-scrollbar-thumb {
  background: rgba(108,99,255,0.2);
  border-radius: 100px;
}

.cc-club-scope::-webkit-scrollbar-thumb:hover,
.cc-club-scope *::-webkit-scrollbar-thumb:hover { background: #6C63FF; }`;

const newCss = css.substring(0, startIndex) + replacement + css.substring(endIndex);
fs.writeFileSync('src/index.css', newCss);
console.log('Successfully updated index.css with Soft Noir CSS!');
