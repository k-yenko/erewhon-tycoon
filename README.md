# erewhon tycoon

lemonade tycoon (2002) but it's a bougie LA smoothie stand

## run it

```
npm install
npm run dev
```

## what it is now

- classic lemonade tycoon loop: buy supplies → set recipe/price → start day → watch tiny people buy smoothies → results screen
- strawberries + coconut cream spoil overnight, ice ALWAYS melts
- 10 LA locations, each with its own iso scene — venice boardwalk, calabasas gates, the beverly grove parking lot, etc.
- popularity + satisfaction are per-location and actually affect traffic
- weather + a daily LA news event (teachers strike, coachella exodus, GLP-1 discourse...) reroll every in-game morning
- "today's drop" = a real celebrity collab smoothie, pinned to the actual real-world date
- it also pings erewhon's real shopify feed for new arrivals and sells whatever's actually new that day (falls back to a built-in pool if offline)
- auto-saves to localStorage
- win: flagship cart + reserve-tier revenue. lose: priced out of los angeles

## dev notes

- vite + react + ts, no backend, no game engine — the scenes are hand-drawn inline svg
- pixel fonts for the UI, smooth vector art for the scenes (that's how the original did it, roughly)
- `?fakeDate=2026-08-08` to preview a different real-world day
- `npm run balance -- 40` runs a 40-day bot through the actual engine and prints the economy curve
- `npx tsx --tsconfig tsconfig.app.json scripts/render-scene.tsx <dir>` dumps every location scene to svg for eyeballing

## todo / someday

- [ ] sound?? little cash register noise
- [ ] more events, more drops
- [ ] challenge mode (30 days, high score)
- [ ] membership tiers as a late-game mechanic
- [ ] staff should probably do more
- [ ] balance is vibes-based, will keep tuning
