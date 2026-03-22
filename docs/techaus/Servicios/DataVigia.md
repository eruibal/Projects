# DataVigía by TECHAUS — Product & Strategy Brief

**Prepared by:** Digital Marketing Analysis  
**Parent brand:** TECHAUS  
**Date:** February 2026  
**Version:** 1.0

## Problem definition

El mercado móvil total es de unas 158 millones de líneas activas (datos aproximados de 2025), y Telcel tiene la mayor participación (cerca del 70%). El postpago representa solo alrededor del 16-17% del total de líneas móviles en el país, lo que coincide con estas cifras.Estos datos provienen de reportes oficiales de América Móvil y análisis del sector.

1. Datos más recientes disponibles cuarto trimestre de 2025, Telcel tenía 84.7 millones de suscriptores móviles en total.
2. La base de postpago creció en 135,000 adiciones netas en el último trimestre, alrededor del 3-6% anual
3. Telcel reporta 15.919 millones de líneas/suscriptores activos de postpago en México en diciembre de 2025, Un mismo contratante (persona física o moral/empresa) puede tener y factura varias líneas bajo un solo contrato o cuenta:Persona física → planes familiares “Amigos y Familia” (generalmente 2 a 5 líneas).
4. Planes Telcel Empresa o corporativos (pueden tener 5, 10, 50 o más líneas por cuenta)

### Contratantes con líneas múltiples

- El promedio de líneas por contratante postpago ronda entre 1.3 y 1.6, esto significa:Número estimado de contratantes únicos: aproximadamente 10 a 12.2 millones.
- Porcentaje de líneas que pertenecen a contratantes con más de 1 línea: entre el 20 % y el 35 % del total (es decir, entre 3.2 y 5.6 millones de líneas son “adicionales” bajo contratos multi-línea).

| Escenario estimado            | Líneas promedio por contratante | Contratantes únicos estimados | % de líneas en contratos multi-línea |
| :---------------------------: | :-----------------------------: | :---------------------------: | :----------------------------------: |
| Conservador (más residencial) | 1.3                             | \~12.2 millones               | \~23 %                               |
| Promedio realista             | 1.45                            | \~11 millones                 | \~31 %                               |
| Alto (más empresarial)        | 1.6                             | \~10 millones                 | \~37 %                               |

### Motivation

1. I have been  struggling with this  problem with post payment mobile phone subscriptions for my family plans.
2. Our communications company Telcel actually does very little to protect excessive consumption of data packages, and I believe a strong motivation for them is to charge more on every phone bill.
3. Their alert management app for excess data consumption is very limited and I can almost think they encourage you to unwillingly go pass beyond your data consumption limit every month as they turn the other way every time this happens
4. My motivation is to create a very simple working process that would be so easy to set up and be able to provide valuable feedback on a frequent basis so that the responsible party has relevant information as to allow him not to go.

## Executive Summary

DataVigía is a WhatsApp-native data consumption monitoring service for postpaid mobile phone subscribers in Mexico. For a small monthly fee, subscribers receive automated alerts about their data usage, overage warnings, and usage summaries — directly in WhatsApp, the channel they already live in.

Beyond its standalone value, DataVigía functions as a strategic trust-building engine for TECHAUS's core insurance business. It solves a real, recurring financial pain point, establishes daily brand presence, and converts a cold-audience problem (insurance skepticism) into a warm-audience opportunity by the time an insurance offer is introduced.

---

## The Problem DataVigía Solves

Mobile data overages on postpaid plans are a consistent, recurring source of financial frustration for Mexican consumers. Carriers — Telcel, AT&T Mexico, Movistar, Izzi — do not proactively alert subscribers in time to avoid overage charges. The result is a predictable monthly surprise on the bill.

This pain point is:

- **Universal** — affects all postpaid subscribers regardless of income level
- **Recurring** — happens every billing cycle, not just once
- **Financially tangible** — overage charges range from $100–500+ MXN per incident
- **Emotionally charged** — people feel cheated, not just inconvenienced
- **Underserved** — no dominant, trusted solution exists in Mexico today

---

## Product Overview

**Name:** DataVigía by TECHAUS  
**Tagline:** *Tu datos, bajo control.*  
**Delivery channel:** WhatsApp Business  
**Pricing:** $49–99 MXN/month (tiered)

### How It Works

1. Subscriber signs up via a WhatsApp link or landing page
2. They forward their carrier's data usage SMS to the DataVigía WhatsApp number (or connect via carrier API where available)
3. DataVigía parses usage data and sends:
   - Daily usage summary (optional, premium tier)
   - Threshold alerts at 50%, 75%, and 90% of plan usage
   - Overage warning before charges are triggered
   - Monthly usage report with a spend summary

### Service Tiers

| Tier | Price | Features |
|------|-------|----------|
| Básico | $49 MXN/month | Weekly summary + overage alert |
| Plus | $79 MXN/month | Daily summary + threshold alerts (75%, 90%) |
| Premium | $99 MXN/month | All alerts + priority WhatsApp support + monthly report |

---

## MVP Approach

The fastest path to market does not require carrier API agreements. Mexican carriers (Telcel, AT&T, Movistar) already send SMS consumption alerts to subscribers automatically. The MVP can be built on a simple SMS-forwarding flow:

1. User receives carrier SMS (e.g., "Has consumido el 80% de tu plan de datos")
2. User forwards that SMS to the DataVigía WhatsApp number
3. A parser reads the message, logs usage state, and responds with a structured alert and recommendation
4. If no SMS is forwarded within 48 hours, DataVigía sends a reminder check-in

This approach requires no carrier partnership, no API negotiations, and can be prototyped in days using the WhatsApp Business API and a simple NLP parsing layer.

**Estimated MVP build time:** 2–4 weeks  
**Estimated MVP cost:** $15,000–40,000 MXN (development) + WhatsApp API setup

---

## Strategic Alignment with TECHAUS

DataVigía is not just a standalone product — it is the entry point of a deliberate trust funnel that leads to insurance sales.

### The Trust Problem in Mexican Insurance

Insurance penetration in Mexico is among the lowest in Latin America. The primary barrier is not affordability — it is trust. Consumers do not believe the provider will deliver when it matters, and they have no existing relationship with the brand to draw on.

DataVigía is designed to solve this by inverting the typical acquisition sequence. Instead of asking for trust upfront (buy a policy from us), TECHAUS earns it daily over 60–90 days before ever mentioning insurance.

### The Trust-to-Conversion Funnel

**Step 1 — Awareness**  
User discovers DataVigía through WhatsApp group shares, Google Search ("cómo evitar cobros extra de datos Telcel"), or Meta ads targeting postpaid subscribers frustrated with data overages.

**Step 2 — Activation**  
User subscribes for $49–99 MXN/month. Low price, immediate perceived value. No long-term commitment required.

**Step 3 — Daily Brand Exposure**  
Every WhatsApp alert carries the TECHAUS brand. Over 60–90 days, TECHAUS becomes associated in the subscriber's mind with saving money and looking out for them. Monthly messages can introduce insurance concepts naturally and conversationally — not as sales pitches, but as tips ("¿Sabías que tus gastos médicos pueden costarte mucho más que tu plan de datos si no tienes cobertura?").

**Step 4 — Intent Trigger**  
At the 60-day mark, or triggered by a life event signal in conversation (mention of a family member, a new vehicle, starting a business), DataVigía sends a soft, personalized insurance introduction: *"Como usuario DataVigía, puedes cotizar tu seguro con TECHAUS sin costo y sin compromiso."*

**Step 5 — Conversion**  
A subscriber who has trusted TECHAUS with their financial wellbeing for two to three months is a fundamentally different insurance prospect than a cold Google Ads visitor. Expected conversion rate: 3–5× higher than cold traffic.

### Six Strategic Reasons This Works

**1. Solves the trust gap directly**  
DataVigía gives TECHAUS a daily reason to be in the subscriber's life before asking for a high-consideration purchase. Trust is earned through repeated small wins, not declared in an ad.

**2. Shared WhatsApp infrastructure**  
The WhatsApp Business API setup, automated conversation flows, contact management, and message templating built for DataVigía is exactly the same infrastructure TECHAUS needs for insurance lead nurturing, renewal reminders, and claims follow-up. You build it once and it serves both products.

**3. Recurring revenue bridge**  
Insurance commissions are lumpy and dependent on a long sales cycle. DataVigía generates predictable monthly recurring revenue from day one. At 500 subscribers, MRR ranges from $24,500–49,500 MXN/month before a single insurance policy is sold. This provides financial runway while the insurance pipeline matures.

**4. Identical customer profile**  
Postpaid mobile phone subscribers in Mexico are urban, between 25 and 55 years old, financially active, and already paying for recurring services. This is precisely the demographic for TECHAUS's insurance products — particularly gastos médicos and seguro de auto.

**5. Brand coherence**  
TECHAUS's positioning — *"Tecnología y calidez humana en un solo lugar"* — maps onto both products without any contradiction. DataVigía is the technology proof point. Insurance is the care layer. The brand promise is identical; the entry point is different.

**6. First-party data and lead scoring**  
DataVigía subscribers voluntarily disclose their carrier and plan tier. A subscriber on a $500+ MXN/month postpaid plan signals a household income bracket that correlates strongly with gastos médicos intent. This data allows TECHAUS to prioritize and personalize the insurance offer with a level of precision that paid advertising cannot match.

---

## Financial Model (Illustrative)

### DataVigía Standalone

| Subscribers | Avg. Revenue/User | Monthly Revenue | API Cost (est.) | Net MRR |
|-------------|-------------------|-----------------|-----------------|---------|
| 100 | $69 MXN | $6,900 MXN | ~$800 MXN | ~$6,100 MXN |
| 500 | $69 MXN | $34,500 MXN | ~$3,500 MXN | ~$31,000 MXN |
| 2,000 | $69 MXN | $138,000 MXN | ~$12,000 MXN | ~$126,000 MXN |

*WhatsApp Business API estimated at $0.04–0.07 USD per conversation window.*

### Insurance Conversion Upside (Conservative)

Assuming 5% of active DataVigía subscribers convert to an insurance policy within 12 months, and an average first-year commission of $1,800 MXN per policy:

| Subscribers | 5% Conversion | Policies | Commission Revenue |
|-------------|---------------|----------|--------------------|
| 500 | 25 policies | 25 | $45,000 MXN |
| 2,000 | 100 policies | 100 | $180,000 MXN |
| 5,000 | 250 policies | 250 | $450,000 MXN |

At scale, the insurance conversion revenue significantly exceeds the DataVigía subscription revenue, making every subscriber acquired for DataVigía a long-term insurance asset.

---

## Brand & Landing Page Recommendations

### Naming
**DataVigía by TECHAUS** — "Vigía" means lookout or watchman in Spanish. It retains the familiar "Data" prefix for tech clarity while adding a Spanish word with genuine character. The name works in spoken conversation, WhatsApp context, and digital advertising.

### Brand voice for DataVigía
- Warm, practical, and straightforward — not technical
- Speaks like a financially savvy friend, not a corporate service
- Example alert tone: *"¡Ojo! Ya usaste el 80% de tu plan. Si sigues así, Telcel te cobrará extra. Aquí tienes algunas opciones..."*

### Landing page structure
A separate landing page (`techaus.mx/datavigía` or `datavigía.mx`) should be distinct from the main insurance landing page but visually connected to the TECHAUS brand.

Recommended sections:
1. Hero — pain statement + WhatsApp CTA ("Activa DataVigía ahora")
2. How it works — 3-step visual (Regístrate → Reenvía tu SMS → Recibe alertas)
3. Pricing tiers — Básico / Plus / Premium
4. Social proof — "X usuarios ya evitaron cobros extra este mes"
5. TECHAUS brand footer — connecting DataVigía to the parent brand

---

## Key Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Carrier API access is unavailable | Use SMS-forwarding MVP — no carrier agreement needed |
| WhatsApp API costs erode margins | Model per-message cost before launch; batch non-urgent alerts; set pricing accordingly |
| User churn if onboarding is confusing | Invest in a frictionless 3-message onboarding flow; include a short video walkthrough |
| LFPDPPP data privacy compliance | Draft explicit consent flow at signup; data policy visible before WhatsApp activation |
| Brand confusion between DataVigía and TECHAUS insurance | Clear "by TECHAUS" sub-branding; separate landing pages; connected but distinct visual identity |

---

## Recommended First 30 Days

- [ ] Validate SMS-forwarding MVP with 10–20 beta users manually before any development
- [ ] Register `datavigía.mx` domain (or equivalent)
- [ ] Set up WhatsApp Business API account and message templates
- [ ] Build and test SMS parser for Telcel, AT&T Mexico, and Movistar formats (covers ~85% of postpaid market)
- [ ] Design and launch a single-page landing page with waitlist signup
- [ ] Define pricing tiers and model WhatsApp API unit economics at 100 / 500 / 2,000 users
- [ ] Draft LFPDPPP-compliant privacy notice and consent flow
- [ ] Create DataVigía branding aligned with TECHAUS visual identity

---

## Summary

DataVigía is a tactically smart interim product and a strategically essential long-term asset for TECHAUS. It enters the market through a low-friction, high-frequency pain point, builds the trust infrastructure that makes insurance sales possible, and generates its own recurring revenue in the process. The WhatsApp channel, the customer demographic, the brand positioning, and the underlying business goal are all identical between the two products. DataVigía is not a detour from the insurance business — it is the on-ramp.

---

*DataVigía by TECHAUS — Product & Strategy Brief v1.0 — February 2026*  
*For questions or to discuss implementation, contact the growth team.*