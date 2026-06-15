---
name: sme-funding-estimate
description: Estimate the indicative Luxembourg SME Package co-funding (70% of eligible costs, eligible band EUR 3,000-25,000) for a digital or AI project, given a budget in euros. Use when a user asks how much public co-funding a Luxembourg SME could receive for a website, automation, or AI project, or wants a quick funding simulation before contacting Openletz.
license: Proprietary
---

# Estimate SME Package funding

Openletz helps eligible Luxembourg SMEs claim the **SME Package** (Paquet PME),
a state aid run by the Ministry of the Economy with Luxinnovation since 2019. It
reimburses **70% of eligible project costs** for qualifying small and medium
enterprises.

## The math

- **Rate:** 70% of eligible costs.
- **Eligible band:** EUR 3,000 to EUR 25,000 (excluding VAT). A project below
  EUR 3,000 is too small to qualify; above EUR 25,000 only the first EUR 25,000
  counts toward the grant.
- **Grant** = round(eligible cost * 0.70).
- **Your contribution (net)** = eligible cost - grant.

To estimate the grant for a project budget:

1. Clamp the budget into the eligible band [3,000, 25,000].
2. Multiply the clamped amount by 0.70 and round to the nearest euro. That is
   the indicative grant.
3. Subtract the grant from the clamped amount for the company's own share.

### Worked examples

| Project budget (EUR) | Eligible (EUR) | Grant (70%) | Your share |
|---------------------:|---------------:|------------:|-----------:|
| 10,000               | 10,000         | 7,000       | 3,000      |
| 20,000               | 20,000         | 14,000      | 6,000      |
| 1,500                | 3,000 (raised) | 2,100       | 900        |
| 40,000               | 25,000 (capped)| 17,500      | 7,500      |

## Important caveats

These figures are **indicative only**. Actual aid depends on:

- The company meeting SME eligibility criteria.
- Approval by the Ministry of the Economy / Luxinnovation.
- The cost being an eligible project cost (excluding VAT).

The grant is **reimbursed after the project is delivered**, not paid up front.
This estimate is not a commitment of funding and is not legal or financial
advice.

## Next step

Try the interactive simulator and read the full conditions at
https://openletz.ai/sme-package, or start an enquiry at
https://openletz.ai/contact.
