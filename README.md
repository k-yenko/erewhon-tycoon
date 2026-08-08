# erewhon tycoon

lemonade tycoon (2002) but it's a bougie LA smoothie cart

## run it

```
npm install
npm run dev
```

## the shape of a run

- one season = 60 in-game days (jan 1 → feb 30, the calendar is real-ish, weekdays matter)
- three acts, unlocked by lifetime revenue, each with its own upgrade list:
  - **act I — the hustle**: blenders, tip screens, fridges, stand tiers. classic ladder
  - **act II — the landlord era** ($3k): the city notices you. rent gets repriced where you're popular, neighborhoods get *over* you if you camp them, and moon juus (a wellness-truck pastiche) rolls into town. counter-tools: a lease lawyer, a residency program, a misting system, a valet stand
  - **act III — the juice wars** ($8k): moon juus starts parking wherever YOU are, and past $12k it undercuts you. counter-billboards, celebrity collabs, exclusive supplier contracts, a merch empire
- the flagship dream (flagship cart + $15k lifetime) can land any day — the season keeps going
- day 60: **empire score** = net worth + city-wide reputation + city-wide devotion + flagship bonus → arcade initials → local hall of fame on the title screen

## the machine

- real lemonade tycoon loop: supplies → recipe → price → start day → tiny people buy smoothies → results ledger
- strawberries + coconut spoil, ice ALWAYS melts, cups are forever
- 10 LA locations, each with a stated perk AND catch (culver's lunch rush is a stampede, venice lives and dies by weather, calabasas whales overpay, beverly hills torches an off recipe)
- office districts fill on weekdays, beaches on weekends, commuters still show up in an atmospheric river
- popularity, satisfaction, and novelty are per-location and compound — camping one corner is a strategy with a shelf life
- weather + a satirical LA news event reroll every morning; "today's drop" (celebrity collab smoothie) + "new at erewhon today" pin to the actual real-world date, pulled live from erewhon's shopify feed when online
- hover any pedestrian: they freeze and show a trading card — archetype, aura, signature moves, mood (wired to the sim), weakness, star sign with a date-aware reading
- upgrades physically appear on the cart: shade sail, sound-bath speaker, LED halo, mist, valet podium, the counter-billboard
- everything sells back (supplies at 60%, gear at 50%) — bankruptcy only hits when even the fire sale can't fund a supply run
- webaudio sfx + a synthesized lofi loop (the ♪ toggle mutes music only)
- auto-saves to localStorage, saves always migrate

## dev notes

- vite + react + ts, no backend, no game engine — scenes are hand-drawn inline svg
- `?fakeDate=2026-08-08` to preview a different real-world day
- `npm run balance -- 70` runs a 70-day bot through the actual engine (crosses both act gates + the day-60 scoring) and prints the economy curve
- `npx tsx --tsconfig tsconfig.app.json scripts/render-scene.tsx <dir>` dumps every location scene to svg for eyeballing
- advanced modes behind the title-screen gear: ingredient commodity market, early rival

## todo / someday

- [ ] second cart (empire mode, the lemonade tycoon 2 move)
- [ ] prestige seasons after day 60
- [ ] more events, more drops, more archetypes
- [ ] balance is vibes-based, will keep tuning
