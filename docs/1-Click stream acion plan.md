# Techaus Clickstream Audit & Action Plan

**Document:** Clickstream v1.0 — Feb 2026  
**Scope:** 4 primary flows · 12 unique screens · 3 conversion points  
**Prepared by:** UX / Growth Review

---

## Executive Summary

| Metric | Current state |
|--------|---------------|
| Minimum clicks to lead | 5+ |
| Conversion entry points | 2 (nav CTA + bottom banner) |
| Lead capture before quote form | None |
| Dead-end screens | 2 (`/cotizar/gracias`, `/nosotros`) |
| Critical friction issues | 3 |

The core problem is a **5-click minimum path to a lead** with zero partial capture along the way. A user who abandons the quote form mid-way is a complete loss — no email, no phone, nothing to follow up with. The three critical fixes below address the biggest conversion killers and can reduce the path to lead to **2 clicks**.

---

## Flow Overview

### Flow 01 — Main Navigation

`Homepage → Protección (dropdown) → [Gastos Médicos / Auto / Vida / Hogar] → Cuida Servicios → Nosotros → Cotizar Ahora`

Navigation is logically structured but `/servicios` and `/nosotros` are dead ends with no conversion path. Users who browse the brand before buying have no nudge back to the quote flow.

### Flow 02 — Hero Section CTAs

`Homepage Hero → "Ver Soluciones" → Product Catalog → Quote Form`  
`Homepage Hero → "Contáctanos" → Contact Page → Confirmation`

The primary hero CTA routes to a catalog page rather than initiating a quote. This adds a full extra click and page load before any conversion event fires.

### Flow 03 — Product Cards → Quote

`"Protección para lo que más amas" section → Product card "Saber más" → Individual product page (Cotizar →) → Quote Form → Thank-you page`

The product-to-quote journey works structurally but loses product context at the form stage. The thank-you page is a missed re-engagement opportunity.

### Flow 04 — Bottom CTA Banner

`"¿Listo para asegurar tu futuro?" → "Hablar con un asesor" → Contact page`  
`"¿Listo para asegurar tu futuro?" → "Cotizar en línea" → Quote form`

Two CTAs with equal visual weight lead to very different destinations, creating choice ambiguity for high-intent users.

---

## Issues Found

### Critical

1. Quote form has no product pre-selection
Flow 03 sends users to `techaus.mx/cotizar?tipo=X` from product cards, but the quote form still shows a generic "Datos del seguro" field with no context. Users must re-select the product they already chose, adding unnecessary friction right before the highest-intent moment in the funnel.

2. Thank-you page is a dead end with no re-engagement
After form submission at `/cotizar/gracias`, the only option shown is "Volver al inicio." There is no upsell to a second product, no WhatsApp CTA, no social proof, and no referral prompt. Users who just converted are the warmest audience on the site and are being shown the exit door.

3. Hero CTA "Ver Soluciones" routes to catalog, not quote
Clicking "Ver Soluciones" takes users to `/proteccion` (the catalog) rather than starting a quote. High-intent users who engage with the primary hero CTA should be able to begin quoting immediately, not browse a product listing first.

### Warnings

1. Dual CTAs in the bottom banner have identical visual hierarchy
Flow 04's bottom banner presents "Hablar con un asesor" and "Cotizar en línea" at the same visual weight, creating ambiguity. Users with high intent who want a price may accidentally route themselves to the contact page instead.

2. No lead capture before the full quote form
There is zero email or phone capture earlier in the funnel. If a user abandons the multi-field `/cotizar` form halfway through, the lead is lost entirely. A single-field micro-capture on product pages would allow recovery via email automation.

### Optimisations

`/servicios` and `/nosotros` have no connection to the quote flow

Both pages are reachable from the primary nav but neither includes a CTA pointing to `/cotizar`. These pages likely carry meaningful dwell time from users doing due diligence before buying — a persistent floating CTA would capture that in-session intent.

---

## Current vs Target Click Path

**Current — best case:**

```
Homepage → Protección catalog → Product page → Quote form → Lead ✓
```

5 clicks minimum · 3 intermediate pages · no partial capture

**Target after fixes:**

```
Homepage → Product selector (hero) → Pre-filled quote form → Lead ✓
```

2 clicks · product context preserved · lead captured on arrival

---

## Step-by-Step Action Plan

### Step 1 — Add product pre-selection to the quote form URL

**Impact: High · Effort: Dev · ~1 day · Affects: Flow 03**

Read the `?tipo=gastos-medicos` (or `auto` / `vida` / `hogar`) query param on `/cotizar` and auto-select the matching product in the form dropdown on page load. Add a hidden field to pass it through on submission so the CRM knows which product triggered the lead.

### Step 2 — Redesign the hero to include an inline product selector

**Impact: High · Effort: Design + Dev · 2–3 days · Affects: Flows 01 & 02**

Replace the generic "Ver Soluciones →" CTA with a pill-group (Gastos Médicos / Auto / Vida / Hogar) above a single "Cotizar ahora" button. Selecting a pill sets the `?tipo=` param. This cuts hero-to-lead from 4 clicks to 2 and eliminates the catalog detour entirely.

### Step 3 — Rebuild the thank-you page as a conversion asset

**Impact: High · Effort: Design + Copy · 1–2 days · Affects: Flow 03**

Add the following to `/cotizar/gracias`:

- A WhatsApp deep-link button to continue with an advisor
- A cross-sell card for one complementary product (e.g. Auto → Vida)
- A referral prompt ("¿Conoces a alguien que necesite seguro?")
- An estimated response time counter to set expectations and reduce inbound advisor call volume

### Step 4 — Add a sticky quote CTA to `/servicios` and `/nosotros`

**Impact: Medium · Effort: Dev · ~0.5 days · Affects: Flow 01**

Place a fixed bottom bar ("¿Listo para cotizar? → Empezar") on both pages using a contrasting background colour (brand cyan) so it doesn't blend with page content. This converts currently dead navigation endpoints into soft funnel entry points.

### Step 5 — Visually separate the two CTAs in the bottom banner

**Impact: Medium · Effort: Design + Copy · ~0.5 days · Affects: Flow 04**

"Cotizar en línea" should be the primary CTA (filled, green). "Hablar con un asesor" should be secondary (outline or ghost). Add a micro-label under each — "Obtén precio en 2 min" vs "Respuesta en 24h" — to help users self-select by intent and reduce wrong-path clicks from high-intent visitors.

### Step 6 — Add email micro-capture on product pages

**Impact: Medium · Effort: Dev + Email automation · ~2 days · Affects: Flow 03**

Add a single-field email input below the "Ver cobertura" secondary CTA on each product page, triggered on exit-intent or after 30 seconds of dwell time. Suggested copy: "¿Quieres que te enviemos los detalles?" — low commitment, high value. Route captured emails into an automated drip sequence with the product's coverage details and a quote CTA.

### Step 7 — Instrument the quote funnel with step-level tracking

**Impact: Foundational · Effort: Analytics · ~1 day · Affects: All flows**

Add event tracking (GA4 or equivalent) at each step of the `/cotizar` form: step viewed, field completed, step completed, and form abandoned. This gives you the data to identify the exact field or step with the highest drop-off rate, enabling data-driven optimisation of steps 1–6 above. This should run in parallel with everything else.

---

## Prioritised Summary

| # | Action | Impact | Effort | Flow |
|---|--------|--------|--------|------|
| 1 | Auto-fill product on quote form from URL param | High | 1 day | 03 |
| 2 | Inline product selector on hero CTA | High | 2–3 days | 01, 02 |
| 3 | Redesign thank-you page with re-engagement CTAs | High | 1–2 days | 03 |
| 4 | Sticky quote CTA on `/servicios` and `/nosotros` | Medium | 0.5 days | 01 |
| 5 | Differentiate primary/secondary CTAs in bottom banner | Medium | 0.5 days | 04 |
| 6 | Email micro-capture on product pages | Medium | 2 days | 03 |
| 7 | Step-level funnel tracking in GA4 | Foundational | 1 day | All |

---

*Techaus Clickstream Audit — based on live landing page analysis · techaus.mx*
