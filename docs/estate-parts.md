# Estate parts and Main House

How the 3-suite villa product, the 5-suite Main House offer, and in-page hashes relate. Read this before changing homepage spaces, Stay, Experiences, or Main House links.

## Two products

The public marketing site sells the **3-suite villa** as the default stay. The **Main House** is a separate returning-guest offer: 5 suites, $2,500–$3,600/night, $10,000 damage deposit.

Do not mix them:

- Homepage `ESTATE_SPACES` in `lib/homepage-content.ts` is the villa product (Main Villa, King Suites, Pool Deck, Private Docks, Chef Service). Do not add Main House as a carousel space.
- Stay may show Main House as a **designed card** (eyebrow “Returning guests”, title “Main House · 5 suites”) that links `/stay/main-house`. Do not restore a stray underlined microsite link in the Stay hero.
- Rates publishes Main House pricing at `/rates#main-house-accommodations`. Site search should keep pricing answers on that hash, not the microsite.

## Live hashes that guests actually hit

| Source | Must land on |
| --- | --- |
| Homepage King Suites CTA | `/stay#inside-the-villa` |
| Homepage Private Docks CTA | `/experiences#on-the-water` |
| `/stay/suites` redirect | `/stay#inside-the-villa` |
| `/stay/main-house` redirect | `https://mainhouse.canarycove.com` (307, on purpose) |
| `/experiences/on-the-water` and `/experiences/land` | `/experiences#on-the-water` (Included card) |
| `/experiences/power-boating` and `/experiences/diving-fishing` | `/experiences#diving-fishing` (Add-on adventures card) |

Stay also owns `#villa`, `#outside`, `#services`, `#amenities`, `#inside-the-villa`, and `#outside-the-villa`. Those IDs must stay on the page if highlights, search, or redirects still point at them.

## Main House microsite

- Repo: `enzo-prism/main-house-CC`
- Production: `https://mainhouse.canarycove.com`
- Vercel project: `canary-cove-main-house`
- Header/footer chrome must match current Cove IA: Stay, Rates, Explore (Experiences, Dining, Adventures, Gallery), Reviews, Getting Here, plus Book and Contact.
- Hero photograph uses `object-fit: cover`. The H1 under the photo should wrap as “Canary Cove / Main House”, not mid-word (`max-width` around `12ch`).
- Do not claim 3 king suites, up to 10 guests, chef, docks, or boats on the microsite unless the offer is reconfirmed.
- Booking URL: `https://www.canarycove.com/book?accommodation=main-house&returning=yes`
- Do not restore Bookingmood. Do not email Consi from Formspree.

When Main House chrome or hashes change, update this file, `docs/codex-route-map.md`, and `docs/release-log.md` in the same change.
