# Dwak Design System

## Scene
A caregiver on a sunlit Algiers sidewalk at 14:00, or under a streetlamp at 22:30, holding a mid-range Android, hunting a medicine for someone at home. Glare, urgency, one thumb.

→ Light theme, high contrast, warm paper surfaces (not clinical white). Auto dark variant only via `prefers-color-scheme` for the night garde use-case.

## Color (OKLCH, committed strategy)
Deep zellige green carries identity on header, primary actions, and the garde night surface (30–40% of key screens). Warm paper neutrals tinted toward the green hue. No teal, no neon pharmacy green.

- `--paper`: oklch(0.972 0.008 120) — warm paper background
- `--paper-raised`: oklch(0.99 0.005 120)
- `--ink`: oklch(0.24 0.02 150) — primary text
- `--ink-soft`: oklch(0.45 0.02 150)
- `--green`: oklch(0.42 0.09 155) — brand, actions, header
- `--green-deep`: oklch(0.30 0.07 158) — garde/night surfaces
- `--green-tint`: oklch(0.93 0.025 155)
- Availability semantics (functional, never decorative):
  - available: oklch(0.55 0.14 150)
  - limited: oklch(0.70 0.14 75) (amber)
  - rupture: oklch(0.55 0.19 25) (clay red, not alarm red)
- Accent for garde/night: warm lamp gold oklch(0.82 0.12 85), used only on the garde surface.

## Typography
Rubik (Latin + Arabic in one family), self-fallback to system-ui / Segoe UI, "Noto Sans Arabic". Scale ratio ≥1.28: 13 / 15 (body) / 17 / 22 / 28 / 38. Weights 400/500/600/700; hierarchy by scale+weight, not color alone. Body max 70ch. Arabic RTL flips layout via `dir="rtl"` and logical properties only.

## Layout
Mobile-first, single column, max-width 640px app frame; desktop centers the frame with the map/detail beside it at ≥1024px. Bottom tab bar (Chercher / Garde / Alertes) with 48px targets. Spacing scale 4/8/12/16/24/32/48; sections breathe at 32–48, list rows tight at 12. Results are full-bleed list rows with hairline separators, not card grids.

## Components
- Search field: oversized (56px), the hero of the home screen.
- Availability row: pharmacy name, distance, freshness chip ("il y a 20 min"), source chip (pharmacien ✓ / communauté), status dot+word.
- Freshness chip is time-graded: <1h strong, <24h neutral, older faded with "à confirmer".
- Substitute suggestion: inline block under a rupture result ("Générique équivalent: …"), full border, tinted background. No side-stripes anywhere.
- Garde screen: green-deep surface, lamp-gold accents, largest text of the app (read at night at arm's length).

## Motion
150–250ms, ease-out-quart, transform/opacity only. Status changes cross-fade; list entries stagger 30ms on first paint only. No skeleton shimmer loops.

## Voice
FR: "Disponible", "Stock limité", "En rupture", "Confirmé par le pharmacien", "Signaler". AR: "متوفر", "كمية محدودة", "مفقود", "أكده الصيدلي", "أبلغ". Short verbs, no exclamation points.
