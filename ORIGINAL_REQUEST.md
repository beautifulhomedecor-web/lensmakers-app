# Original User Request

## Initial Request — 2026-07-07T09:58:00Z

Completely retheme the **Lens Makers** premium eyewear mobile web app from its current dark navy aesthetic to a **warm, vibrant, Lenscare-inspired light/warm design** using the new color palette (#FFCA95, #FF7873, #E22F80, #8140DC). The new palette becomes the primary background and accent system, with dark tones reserved for text, shadows, and highlights. Apply this transformation across every `.css` file, inline `style={{}}` in every React `.js` screen and component file, and every CSS custom property in `:root`. No shapes, animations, border-radius, or layout dimensions should change — only colors.

Working directory: c:\Users\NEW\OneDrive\Desktop\lensmakers-web

Integrity mode: development

---

## New Color Palette & Semantic Roles

| Token Name | Hex | Role |
|---|---|---|
| `--color-peach` | #FFCA95 | Warm background sections, card fills, subtle hero gradients |
| `--color-coral` | #FF7873 | Sale/notification badges, secondary CTA hover state, warm highlights |
| `--color-magenta` | #E22F80 | Primary CTA buttons, brand accent, active nav state, hero headlines |
| `--color-violet` | #8140DC | VIP/Member badges, AR Try-On accent, secondary action buttons, links |
| Background base | Warm cream/light warm tone complementary to palette | App background (replaces #0F1535 navy) |
| Dark text/highlight | #1A0A1E or similar deep warm-dark | Text, icon strokes, card shadows (replaces white text) |

---

## Requirements

### R1. CSS Custom Property Overhaul (`styles.css` and all other `.css` files)
Replace all color definitions in `:root` and throughout `styles.css` (and any other `.css`/`.scss` files in the project) with the new palette. Update:
- Background colors (`--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-overlay`)
- Accent colors (`--color-pink`, `--color-purple`, `--gradient-primary`, etc.)
- Border, shadow, and glow colors derived from old pink/purple palette
- The 3 ambient background blob colors to use new palette radial gradients
- Glassmorphism card backgrounds to warm-tinted frosted glass (warm rgba tones instead of cool rgba tones)
- Text colors: primary text should now be a deep warm-dark (not white) where backgrounds are light; retain white text only where backgrounds are dark/vibrant

### R2. Inline Style Updates in All Screen & Component JS Files
Search every file under `src/screens/` and `src/components/` for hardcoded hex colors, `rgba()` values, and `linear-gradient()` definitions in inline `style={{}}` props. Replace all occurrences with the new palette equivalents, maintaining the same semantic role:
- Old pink CTAs (`#FF4D8D`, `#C2185B`) → `#E22F80`
- Old purple VIP/member (`#7C4DFF`, `#8B4FFF`) → `#8140DC`
- Old coral/sale accents → `#FF7873`
- Old warm/gold highlights → `#FFCA95`
- Old dark navy card backgrounds (`rgba(27,31,74,…)`, `#1B1F4A`) → warm frosted glass equivalents

### R3. Lenscare-Inspired CTA & Button Style
Primary CTA pill buttons (`btn-primary-pill`) must be styled like Lenscare's bold action buttons:
- Solid `#E22F80` or gradient `linear-gradient(135deg, #FF7873, #E22F80)` fill
- White (`#FFFFFF`) text
- Strong box-shadow using `rgba(226, 47, 128, 0.45)` glow
- On hover: slightly lighter/brighter tint using `#FF7873` direction
Secondary buttons: outlined style with `#8140DC` border and `#8140DC` text on transparent background.

### R4. Background Warmth
The app background (`--bg-primary`) must shift to a warm tone that complements the palette — a warm off-white, warm light cream, or a very light warm lavender. The ambient blob gradients must be recolored using the new palette (peach blob, coral blob, violet blob) so the background feels cohesive with the new warm system. Dark navbar/header should use a warm-dark overlay (e.g., deep warm-dark with blur) that contrasts well with the new backgrounds.

### R5. Zero Structural Regressions
After all color replacements:
- All 6+ screens must render and navigate without JavaScript errors
- All spring animations, glassmorphism `backdrop-filter`, border-radius values, font sizes, and layout dimensions must remain exactly as before
- The bottom nav FAB (AR Try-On) remains raised 28px above the bar, visually prominent using the new `#8140DC` or `#E22F80` accent
- The logo construction must remain unchanged

---

## Acceptance Criteria

### Color Coverage
- [ ] Zero occurrences of old cold-palette hex values (`#0F1535`, `#FF4D8D`, `#C2185B`, `#7C4DFF`, `#1B1F4A`) remain anywhere in the codebase
- [ ] All four palette colors (`#FFCA95`, `#FF7873`, `#E22F80`, `#8140DC`) are registered as CSS custom properties in `:root` in `styles.css`
- [ ] Every screen and every glassmorphism card reflects the new warm palette visually

### Lenscare-Style CTAs
- [ ] Primary CTA buttons display the `#FF7873 → #E22F80` gradient or solid `#E22F80` with white text
- [ ] Secondary/outline buttons use `#8140DC` border and text
- [ ] No CTA button has a cold-blue or old-magenta color remaining

### Warm Background System
- [ ] App background is a warm, light-toned color (not cold navy or black)
- [ ] Ambient background blobs use the new palette radial gradients
- [ ] Glassmorphism cards have warm-tinted frosted glass backgrounds

### Readability
- [ ] All body text and headings are readable (contrast >= 3:1) against the new backgrounds
- [ ] White text is used only where the background is a vibrant/dark palette color
- [ ] Deep warm-dark text is used on light/peach backgrounds

### Zero Regressions
- [ ] App loads with zero JavaScript console errors
- [ ] All screens navigate correctly (Home, Shop, Cart, Profile, Eye Checkup, AR Try-On)
- [ ] No layout shifts, no border-radius changes, no animation timing changes
