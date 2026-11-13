# Dwak (دواك) — Trouvez votre médicament, tout de suite

**The problem.** Algeria lives with a chronic medicine shortage: SNAPO (the pharmacists' union) counts 50+ molecules in rupture; **42% of patients visit 3 or more pharmacies** to find a treatment; families beg in Facebook groups, which feeds an illegal online medicine market. Existing apps (PharmNet, Dawa, Med DZ) are drug *encyclopedias* — none answers the real question.

**Dwak answers it:** *which licensed pharmacy near me has my medicine, right now?*

## Features (MVP)
- **Search by brand or DCI** (FR + AR), instant suggestions.
- **Availability per pharmacy** with the three trust signals that matter: status (Disponible / Stock limité / En rupture), **freshness** ("il y a 20 min"), and **source** (pharmacist-confirmed ✓ vs community-reported). Stale info (>24 h) degrades honestly to "À confirmer".
- **Crowdsourced reporting**: after visiting, one tap ("Je l'ai trouvé" / "En rupture") updates the neighborhood.
- **Generic substitutes** (same DCI) suggested inline when a medicine is in rupture.
- **Pharmacies de garde**: night/24h pharmacies on a dedicated high-contrast night screen, sorted by distance, call + directions.
- **Alerts**: follow a medicine, get notified when it's back near you.
- **FR / Arabic (full RTL)**, geolocation with city fallback (Alger, Oran, Constantine seeded).
- **PWA**: installable on Android and iOS, offline shell, works on patchy 4G.
- **Legal by design**: locates licensed pharmacies only; no online sale of medicines (law 18-05 compliant).

## Run it
Any static server. For example:
```
cd dwak
python -m http.server 4173
# → http://localhost:4173
```
No build step, no dependencies.

## Ship it to the stores
One codebase, three targets:
1. **Website**: deploy the folder as-is (Netlify / Vercel / any static host + HTTPS).
2. **Android (Play Store)**: wrap as a Trusted Web Activity with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) or [PWABuilder](https://www.pwabuilder.com) — takes the manifest + service worker already present.
3. **iOS (App Store)**: package with PWABuilder's iOS target or [Capacitor](https://capacitorjs.com) (`npx cap add ios`), pointing the webview at this app.

## Business model (path to the million)
1. **Pharmacy subscriptions** (core): free listing; ~2 000 DZD/month "Pharmacie vérifiée" tier = stock badge, priority ranking, a 10-second stock-update flow, and demand analytics ("237 people searched Ventoline within 2 km this week"). 11 000+ officines in Algeria; 5% adoption ≈ 13M DZD/month.
2. **Labs & distributors** (B2B data): anonymized real-time demand/shortage heatmaps for pharma distributors and the ANPP — the only live picture of the national shortage.
3. **Later**: click-and-collect reservation for OTC products only (stays legal), garde-night sponsorships.

**Moat**: two-sided network effects (more reports → better answers → more users → more value for pharmacies) plus pharmacist trust — exactly the moat Yassir built in transport, unclaimed in health.

## Production roadmap
- Backend: replace `js/data.js` seed with an API (Supabase/Postgres works day one: `medicines`, `pharmacies`, `availability_events` tables — the JS shapes are the contract).
- Pharmacist app: WhatsApp-bot or 3-tap PWA flow to confirm stock (pharmacists won't open a dashboard).
- Real push notifications (Web Push + FCM) for the alerts tab.
- Import the full ANPP nomenclature (~5 000 medicines) and the Ministry's garde rotations per wilaya.
- Trust scoring: weight reports by reporter history; decay old signals.
- Wilaya-by-wilaya launch: win Algiers first (density → freshness → habit), then Oran, Constantine, Sétif, Annaba.
