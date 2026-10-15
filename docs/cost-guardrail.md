# Kairos cost guardrail

Kairos stays free for a normal user. This file is for the person running it.

## Classes

- OPEN — data that ships with the app. No account.
- FREE_LIMITED — a public or free-tier service with a quota. A miss degrades. It does not invent a plan.
- EXTERNAL_HANDOFF — the user's own app opens. Kairos does not call that API.
- OPTIONAL_PAID — off unless that provider's own environment values are set.

## Paid and card checks

Optional paid providers default to off.

- Yelp photos run only when `YELP_API_KEY` is set, and only for shortlisted venues, with a daily cap.
- Foursquare photos run only when `FOURSQUARE_API_KEY` is set and `FOURSQUARE_PHOTOS=on`. That photo endpoint is a paid Premium call and is the only provider marked as requiring a credit card. Leave it off.

Gemini uses an API key on the free tier. It does not require billing or a credit card in this setup. If a key is missing, the deterministic plan remains and the sentence is skipped. A trip may use one extra cached call to phrase place descriptions from facts already fetched. It is not one call per place, and it is skipped when there is no key. Photo lookup, navigation links, and review links stay at zero Gemini calls.

Affiliate links are not an API. They stay hidden until `AFFILIATE_<NAME>_ENABLED`, `_ID`, and `_TEMPLATE` are all set. Ranking code cannot read them.

Travel playbooks ship as curated seeds plus a generated cache (`data/playbooks/generated.json`). Lookup is local and is 0 Gemini. The first request for an unknown destination may read Wikivoyage headings (FREE_LIMITED, prose discarded) and up to four Photon lookups. It does not call a tour operator and it does not invent operator consensus. If that build fails, the existing place planner still runs.

## What is cached

Destination profiles, discovered places, geocodes, translations, Wikimedia photo lookups, route pairs, route matrices, and weather are cached in the server process. The same in-flight request is shared, including a double render. A reload of a saved result does not call Gemini again.

## What must stay at zero Gemini calls

Opening a tab that already has its sentence cached, opening an accordion, View Google reviews, Navigate, photo retrieval, and a name that already has an official English label.

## If you add a provider

Add it to `src/lib/provider-registry.ts`. If it needs billing or a credit card, set those flags. The development log prints optional-paid and credit-card providers when the server starts. Do not hide a paid dependency inside a component.
