# TechAus Landing Page — Click Stream Workflow for Maximum Lead Conversion

## Current Page Architecture

The landing page is a **single-page** Next.js site structured as:

| Order | Section | Component | Purpose |
|-------|---------|-----------|---------|
| 1 | **Navigation** | [Navigation.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/Navigation.tsx) | Fixed top nav with "Cotizar Ahora" CTA |
| 2 | **Hero** | [Hero.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/Hero.tsx) | Headline + dual CTAs |
| 3 | **Partners** | [Partners.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/Partners.tsx) | Trust bar (AXA, GNP, Quálitas, CONDUSEF) |
| 4 | **Services** | [Services.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/Services.tsx) | 4 insurance product cards |
| 5 | **Why Choose Us** | [WhyChoose.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/WhyChoose.tsx) | Trust building + "Conocer al equipo" CTA |
| 6 | **CTA Banner** | [CTA.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/CTA.tsx) | Final conversion push with 2 buttons |
| 7 | **Footer** | [Footer.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/Footer.tsx) | Contact info, links, socials (`id="contact"`) |

---

## Recommended Click Stream Workflows

Below are **three optimal user journeys** from first impression to lead capture, ranked by conversion potential.

### 🥇 Path A — The "Hot Lead" Express (Highest Conversion)

> For visitors who arrive with **intent to buy** (e.g., from a search ad for "cotizar seguro Hermosillo").

```mermaid
graph TD
    A["🟢 Land on Hero"] --> B["Click: 'Cotizar Ahora' (nav bar)"]
    B --> C["📍 Scroll to #contact (Footer)"]
    C --> D["🎯 Call, email, or WhatsApp"]
    style A fill:#0ea5e9,color:#fff
    style D fill:#22c55e,color:#fff
```

**Steps:**
1. **Hero** — Visitor sees the headline *"Protección integral con el respaldo de profesionales"* and scans the trust badge.
2. **Navigation CTA** — The sticky nav's **"Cotizar Ahora"** button is always visible; the visitor clicks it immediately.
3. **Footer / Contact** — They land at `#contact` and convert via phone, email, or a future contact form.

> [!IMPORTANT]  
> This path has only **1 click** to conversion — the shortest possible. Currently `#contact` scrolls to the Footer, which only has passive contact info (address, email, phone). **Adding an inline contact/quote form here would dramatically increase conversions.**

---

### 🥈 Path B — The "Educated Buyer" Journey (Recommended Default)

> For visitors who need to **understand the offer** before committing (organic search, social media traffic).

```mermaid
graph TD
    A["🟢 Land on Hero"] --> B["Click: 'Ver Soluciones'"]
    B --> C["📍 Services Section (#services)"]
    C --> D["Click: Service Card CTA\n(e.g. 'Cotizar Auto')"]
    D --> E["📍 CTA Banner"]
    E --> F["Click: 'Hablar con un asesor'\nor 'Cotizar en línea'"]
    F --> G["🎯 Lead Captured"]
    style A fill:#0ea5e9,color:#fff
    style G fill:#22c55e,color:#fff
```

**Steps:**
1. **Hero** — Headline & subtext establish credibility. Visitor clicks **"Ver Soluciones" →** smooth scroll to `#services`.
2. **Partners Bar** — As they scroll past, they subconsciously register AXA/GNP/Quálitas logos (trust).
3. **Services Cards** — They browse the 4 products and click a card's CTA (e.g., *"Cotizar Auto"* or *"Saber más"*).
4. **CTA Banner** — After reviewing services, the bold blue CTA section catches them with *"¿Listo para asegurar tu futuro?"*
5. **Conversion** — They click **"Hablar con un asesor"** (phone/WhatsApp) or **"Cotizar en línea"** (form).

> [!WARNING]  
> Currently, the service card CTAs (`href="#"`) and the CTA banner buttons are **non-functional placeholders**. These are the highest-impact dead ends on the page. Fixing them is the single biggest conversion lever.

---

### 🥉 Path C — The "Trust Builder" Journey

> For **skeptical visitors** or those comparison-shopping who need social proof before engaging.

```mermaid
graph TD
    A["🟢 Land on Hero"] --> B["Scroll past Partners → Services"]
    B --> C["📍 Why Choose Us section"]
    C --> D["See: '+800 Familias' badge\n+ benefit checklist"]
    D --> E["Click: 'Conocer al equipo'"]
    E --> F["📍 Footer (#contact)"]
    F --> G["🎯 Email or Call"]
    style A fill:#0ea5e9,color:#fff
    style G fill:#22c55e,color:#fff
```

**Steps:**
1. **Hero** — They read but aren't ready to click; they scroll organically.
2. **Partners / Services** — They absorb social proof (carrier logos) and the product range.
3. **Why Choose Us** — The *"+800 Familias"* stat and the 3-point checklist build trust.
4. **"Conocer al equipo"** — They click to learn more → lands at `#contact`.
5. **Footer** — They see the physical address (local business credibility), contact email, and phone.

---

## Conversion Gaps & Recommendations

The current page architecture follows solid landing page principles, but has **critical gaps** preventing actual conversions:

| # | Issue | Impact | Recommended Fix |
|---|-------|--------|-----------------|
| 1 | **No contact/quote form** — `#contact` goes to the Footer, which has only static info | 🔴 Critical | Add an inline form (name, email, phone, insurance type) above the Footer or as the [CTA.tsx](file:///c:/Users/Usuario/Projects/techaus-landing/components/CTA.tsx) section |
| 2 | **Service card CTAs are dead** — all 4 cards link to `href="#"` | 🔴 Critical | Link each to the quote form pre-selecting the insurance type, or to a dedicated product page |
| 3 | **CTA Banner buttons are dead** — both `<button>` elements do nothing | 🔴 Critical | Wire "Hablar con un asesor" to WhatsApp/phone and "Cotizar en línea" to the quote form |
| 4 | **No WhatsApp integration** — WhatsApp is the dominant channel in Mexico for business inquiries | 🟡 High | Add a floating WhatsApp button (bottom-right) and link "Hablar con un asesor" to a `wa.me` link |
| 5 | **Nav links are dead** — "Protección", "Cloud Services", "Nosotros" all go to `href="#"` | 🟡 Medium | Link them to `#services`, relevant section, or future pages |
| 6 | **No urgency or scarcity triggers** — no limited-time offers or social proof counters | 🟡 Medium | Add a banner like *"Cotiza hoy y recibe 10% de descuento en tu primer pago"* |
| 7 | **Mobile CTA in nav missing** — mobile menu has no "Cotizar Ahora" button | 🟡 Medium | Add the CTA button to the mobile menu panel |
| 8 | **No testimonials section** — "+800 Familias" stat exists but no named testimonials | 🟠 Nice-to-have | Add 2–3 short client quotes with photos between WhyChoose and CTA |

---

## Optimal Section Order for Conversion

Your current order is already good. One suggested reorder to front-load trust signals:

```
Navigation → Hero → Partners → Services → Testimonials (NEW) → WhyChoose → Contact Form (NEW) → CTA Banner → Footer
```

The key change: place a **contact form** *before* the final CTA banner so the CTA buttons can scroll the user *up* to the form, and add **testimonials** as a new trust section.

---

## Summary

The **single most impactful action** you can take is:

> **Wire up the 6 dead CTA buttons/links to a real quote form or WhatsApp link.**

The page's visual design and content hierarchy are strong. The conversion funnel just needs its exit points connected to actual lead capture mechanisms.
