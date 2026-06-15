import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ─────────────────────────────────────────────────────
      // TYPOGRAPHY — Plus Jakarta Sans (display) + DM Sans (body)
      // ─────────────────────────────────────────────────────
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },

      // ─────────────────────────────────────────────────────
      // COLORS — Cool Grey Neumorphic palette + shadcn tokens
      // ─────────────────────────────────────────────────────
      colors: {
        // ── shadcn / Radix primitive tokens (CSS-var backed) ──
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // ── Neumorphic semantic color tokens ──
        // Used directly as bg-neo-base, text-neo-fg, etc.
        neo: {
          base:          '#E0E5EC', // cool-clay surface — ALL elements molded from this
          fg:            '#3D4852', // primary text — 7.5:1 contrast (WCAG AAA)
          muted:         '#6B7280', // secondary text — 4.6:1 contrast (WCAG AA)
          // ── Purple palette (strongest → lightest) ──
          'accent-deep': '#391B49', // Russian Violet — deepest, text on light / dark surfaces
          'accent-mid':  '#795690', // Dark Lavender — secondary buttons, borders
          accent:        '#9570C6', // Amethyst — PRIMARY CTA color & focus rings
          'accent-light':'#C29CE4', // Bright Lavender — gradient end, hover highlights
          'accent-soft': '#999ECF', // Ceil — muted purple tints, decorative
          // ────────────────────────────────────────────
          success:       '#38B2AC', // teal — success indicators
          placeholder:   '#A0AEC0', // input placeholder only (not body text)
        },
      },

      // ─────────────────────────────────────────────────────
      // BORDER RADIUS
      // ─────────────────────────────────────────────────────
      borderRadius: {
        // shadcn radius tokens (kept for backward compat)
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",

        // Neumorphic radius tokens
        'neo-card': '32px', // containers, prominent cards
        'neo-btn':  '16px', // buttons, inputs, chips
        'neo-inner':'12px', // inner elements, tags
      },

      // ─────────────────────────────────────────────────────
      // BOX SHADOWS — The physics of Neumorphism
      //
      // Shadow colors:
      //   Light  → rgba(255,255,255,0.5–0.6)   top-left highlight
      //   Dark   → rgb(163,177,198,0.6–0.7)    bottom-right shadow
      //
      // Rule: NEVER use solid hex (#A3B1C6) — always rgba for blending.
      // ─────────────────────────────────────────────────────
      boxShadow: {
        // ── Extruded (Raised) — element protrudes from surface ──
        'neo-flat':
          '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255,255,255,0.5)',
        'neo-lifted':
          '12px 12px 20px rgb(163 177 198 / 0.7), -12px -12px 20px rgba(255,255,255,0.6)',
        'neo-flat-sm':
          '5px 5px 10px rgb(163 177 198 / 0.6), -5px -5px 10px rgba(255,255,255,0.5)',
        'neo-flat-xs':
          '3px 3px 6px rgb(163 177 198 / 0.5), -3px -3px 6px rgba(255,255,255,0.4)',

        // ── Inset (Pressed) — element is carved into surface ──
        'neo-inset':
          'inset 6px 6px 10px rgb(163 177 198 / 0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
        'neo-inset-deep':
          'inset 10px 10px 20px rgb(163 177 198 / 0.7), inset -10px -10px 20px rgba(255,255,255,0.6)',
        'neo-inset-sm':
          'inset 3px 3px 6px rgb(163 177 198 / 0.6), inset -3px -3px 6px rgba(255,255,255,0.5)',

        // ── Focus glow (Accent ring replacement for neumorphism) ──
        'neo-focus':
          '0 0 0 2px #E0E5EC, 0 0 0 4px #9570C6',

        // ── CC Club Dark Neumorphism (v2 — Soft Monochromatic) ──
        'cc-neo-extruded':       '6px 6px 16px rgba(0, 0, 0, 0.35), -6px -6px 16px rgba(255, 255, 255, 0.06)',
        'cc-neo-extruded-hover': '8px 8px 22px rgba(0, 0, 0, 0.45), -8px -8px 22px rgba(255, 255, 255, 0.08)',
        'cc-neo-extruded-sm':    '4px 4px 10px rgba(0, 0, 0, 0.35), -4px -4px 10px rgba(255, 255, 255, 0.06)',
        'cc-neo-inset':          'inset 5px 5px 14px rgba(0, 0, 0, 0.35), inset -5px -5px 14px rgba(255, 255, 255, 0.06)',
        'cc-neo-inset-deep':     'inset 8px 8px 20px rgba(0, 0, 0, 0.45), inset -8px -8px 20px rgba(255, 255, 255, 0.08)',
        'cc-neo-inset-sm':       'inset 3px 3px 8px rgba(0, 0, 0, 0.35), inset -3px -3px 8px rgba(255, 255, 255, 0.06)',

        // ── Legacy neu-* tokens (keep for backward compat — existing components) ──
        'neu':           'var(--neu-shadow)',
        'neu-sm':        'var(--neu-shadow-sm)',
        'neu-lg':        'var(--neu-shadow-lg)',
        'neu-xl':        'var(--neu-shadow-xl)',
        'neu-2xl':       'var(--neu-shadow-2xl)',
        'neu-inset':     'var(--neu-shadow-inset)',
        'neu-inset-sm':  'var(--neu-shadow-inset-sm)',
        'neu-inset-lg':  'var(--neu-shadow-inset-lg)',
        'glow-purple':   'var(--glow-purple)',
        'glow-purple-lg':'var(--glow-purple-lg)',
      },

      // ─────────────────────────────────────────────────────
      // KEYFRAMES & ANIMATIONS
      // ─────────────────────────────────────────────────────
      keyframes: {
        // shadcn accordion
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // existing site animations
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Neumorphic ambient float
        "neo-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        // Framer-Motion-compatible stagger reveal (CSS fallback)
        "neo-reveal": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ambient-drift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "fade-in":         "fade-in 0.6s ease-out forwards",
        "fade-in-up":      "fade-in-up 0.8s ease-out forwards",
        "scale-in":        "scale-in 0.5s ease-out forwards",
        "slide-in-right":  "slide-in-right 0.6s ease-out forwards",
        "slide-in-left":   "slide-in-left 0.6s ease-out forwards",
        "neo-float":       "neo-float 3s ease-in-out infinite",
        "neo-reveal":      "neo-reveal 0.8s ease-out forwards",
        "ambient-drift":   "ambient-drift 15s ease infinite",
      },

      // ─────────────────────────────────────────────────────
      // TRANSITION TIMING — Neumorphic standard
      // ─────────────────────────────────────────────────────
      transitionDuration: {
        'neo': '300ms',
        'neo-slow': '500ms',
      },
      transitionTimingFunction: {
        'neo': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
