import type { EventDef } from '../types';

// One headline per day, mirroring the original's categories:
// global good/bad, pay-more/pay-less, patience up/down, location-specific.
// Multipliers: traffic ×0.4–×1.6, pay ±30%, patience ±40%.
export const EVENTS: EventDef[] = [
  // ——— Global: good for business ———
  { id: 'teachers-strike', headline: 'Teachers On Strike: No School For Kids!', scope: { kind: 'global' }, vibe: 'chaos', traffic: 1.4, audience: 'locals' },
  { id: 'adaptogens-real', headline: 'New Study Confirms What The Girlies Already Knew', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.3 },
  { id: 'protein-maxxing', headline: 'The Boys Are Eating Cottage Cheese Again', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.3 },
  { id: 'wellness-day', headline: 'The City Is Collectively In Its Healing Era Today', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.35 },
  { id: 'smoothie-tiktok', headline: "A Certain Cart Is All Over Everyone's Stories", scope: { kind: 'global' }, vibe: 'hype', traffic: 1.5 },
  { id: 'glp1-muscle-panic', headline: 'The Podcasts Have Pivoted To Muscle Preservation', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.35, pay: 1.1 },
  { id: 'gut-health-week', headline: 'Podcasts Declare It Gut Health Week!', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.25 },
  { id: 'dry-january', headline: 'Dry January Energy Hits In August!', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.3 },
  { id: 'pilates-convention', headline: 'National Pilates Convention Comes To Town!', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.4 },
  { id: 'celeb-pap-walk', headline: 'Someone Extremely Famous Was Photographed Holding A Smoothie', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.5, pay: 1.1 },

  // ——— Global: bad for business ———
  { id: 'glp1-nobody-hungry', headline: "Everyone Is Suspiciously Not Hungry This Month", scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.6 },
  { id: 'cleanse-discourse', headline: 'Juice Cleanse Discourse Turns Ugly On TikTok', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.7 },
  { id: 'seed-oil-scare', headline: 'A Podcast Said The Thing About Seed Oils Again', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.65 },
  { id: 'competitor-drop', headline: 'Competing Grocery Chain Drops Its Own Celebrity Smoothie!', scope: { kind: 'global' }, vibe: 'hype', traffic: 0.7 },
  { id: 'coachella-exodus', headline: "Everyone You Know Is 'At The Desert' This Weekend", scope: { kind: 'global' }, vibe: 'hype', traffic: 0.5, audience: 'locals' },
  { id: 'mercury-sales', headline: 'Astrologers Advise Against Purchases During Mercury Retrograde', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.7 },
  { id: 'raw-milk-recall', headline: 'Raw Milk Recall Shakes Consumer Confidence In Wellness Drinks', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.6 },

  // ——— Customers pay MORE ———
  { id: 'tech-ipo', headline: 'Several Group Chats Went Quiet, Then Very Loud (IPO Day)', scope: { kind: 'global' }, vibe: 'money', pay: 1.3, audience: 'industry' },
  { id: 'awards-season', headline: "Awards Season: Everyone's On A Pre-Gala Cleanse!", scope: { kind: 'global' }, vibe: 'money', pay: 1.25, traffic: 1.1, audience: 'industry' },
  { id: 'bonus-season', headline: 'The Assistants Have The Company Card Again', scope: { kind: 'global' }, vibe: 'money', pay: 1.3, audience: 'industry' },
  { id: 'tax-refund', headline: 'Tax Refunds Land: Citizens Feel Briefly Rich!', scope: { kind: 'global' }, vibe: 'money', pay: 1.2 },

  // ——— Customers pay LESS ———
  { id: 'writers-strike', headline: "The Entire Industry Is 'Between Projects' Right Now", scope: { kind: 'global' }, vibe: 'chaos', pay: 0.75, audience: 'industry' },
  { id: 'rent-due', headline: "It's The 1st. Everyone Is Being So Brave.", scope: { kind: 'global' }, vibe: 'money', pay: 0.8, audience: 'locals' },
  { id: 'stock-dip', headline: 'The Family Office Called. It Was Not Great.', scope: { kind: 'global' }, vibe: 'money', pay: 0.75, audience: 'industry' },
  { id: 'budgeting-app', headline: 'Viral Budgeting App Tells Users To "Audit Your Smoothies"', scope: { kind: 'global' }, vibe: 'money', pay: 0.8 },

  // ——— Queue patience up ———
  { id: 'sound-bath', headline: 'Citywide Sound Bath Festival Leaves Everyone Unusually Calm', scope: { kind: 'global' }, vibe: 'wellness', patience: 1.4 },
  { id: 'waiting-wellness', headline: 'Study: Waiting In Line Is Actually A Mindfulness Practice', scope: { kind: 'global' }, vibe: 'wellness', patience: 1.35 },
  { id: 'digital-detox', headline: 'Digital Detox Trend: Nobody Is Checking The Time', scope: { kind: 'global' }, vibe: 'wellness', patience: 1.3 },

  // ——— Queue patience down ———
  { id: 'mercury-retrograde', headline: "Mercury Retrograde: Everyone's On Edge", scope: { kind: 'global' }, vibe: 'chaos', patience: 0.6 },
  { id: 'traffic-405', headline: 'The 405 Is A Parking Lot: Citizens Arrive Pre-Annoyed', scope: { kind: 'global' }, vibe: 'chaos', patience: 0.65 },
  { id: 'cold-plunge', headline: 'Cold Plunge Trend Makes Everyone Weirdly Intense', scope: { kind: 'global' }, vibe: 'wellness', patience: 0.7 },
  { id: 'matcha-shortage', headline: 'Global Matcha Shortage Causes Citywide Irritability', scope: { kind: 'global' }, vibe: 'chaos', patience: 0.7 },

  // ——— Your Driveway ———
  { id: 'stayhome-day', headline: 'Neighborhood Celebrates "Stay At Home" Day!', scope: { kind: 'location', locationId: 'driveway' }, vibe: 'wellness', traffic: 1.5, audience: 'locals' },
  { id: 'block-party', headline: 'Your Block Is Having A Block Party!', scope: { kind: 'location', locationId: 'driveway' }, vibe: 'hype', traffic: 1.6 },
  { id: 'street-sweeping', headline: 'Street Sweeping Day: Everyone Is Moving Their Car', scope: { kind: 'location', locationId: 'driveway' }, vibe: 'chaos', traffic: 0.6, audience: 'locals' },

  // ——— Silver Lake ———
  { id: 'flea-market', headline: 'Vintage Flea Market Takes Over Silver Lake!', scope: { kind: 'location', locationId: 'silverlake' }, vibe: 'hype', traffic: 1.5 },
  { id: 'band-plays', headline: 'Secret Show At The Bowl: Silver Lake Empties By Noon', scope: { kind: 'location', locationId: 'silverlake' }, vibe: 'hype', traffic: 0.6 },
  { id: 'reservoir-loop', headline: 'Reservoir Walking Loop Named "Most Photogenic" In LA!', scope: { kind: 'location', locationId: 'silverlake' }, vibe: 'hype', traffic: 1.4 },

  // ——— Culver City ———
  { id: 'marathon-culver', headline: 'LA Marathon Closes Culver City Streets!', scope: { kind: 'location', locationId: 'culver' }, vibe: 'wellness', traffic: 0.5 },
  { id: 'studio-lunch', headline: 'Every Studio Scheduled Lunch At The Same Time!', scope: { kind: 'location', locationId: 'culver' }, vibe: 'money', traffic: 1.5 },
  { id: 'layoffs-culver', headline: 'Tech Layoffs Announced: Culver Campus Badges Deactivated', scope: { kind: 'location', locationId: 'culver' }, vibe: 'chaos', traffic: 0.6, pay: 0.85 },

  // ——— Studio City ———
  { id: 'pilot-season', headline: 'Pilot Season: The Valley Is Caffeinated And Manifesting', scope: { kind: 'location', locationId: 'studio' }, vibe: 'money', traffic: 1.5 },
  { id: 'production-halt', headline: 'Production Halt: Studio City Goes Quiet', scope: { kind: 'location', locationId: 'studio' }, vibe: 'chaos', traffic: 0.6 },
  { id: 'farmers-market-studio', headline: 'Sunday Farmers Market Draws The Whole Valley!', scope: { kind: 'location', locationId: 'studio' }, vibe: 'wellness', traffic: 1.4 },

  // ——— Venice ———
  { id: 'surf-contest', headline: 'International Surf Contest At The Breakwater!', scope: { kind: 'location', locationId: 'venice' }, vibe: 'hype', traffic: 1.6 },
  { id: 'venice-ghost', headline: 'Festival Weekend: Venice Is A Ghost Town', scope: { kind: 'location', locationId: 'venice' }, vibe: 'chaos', traffic: 0.5 },
  { id: 'dolphins-venice', headline: 'Dolphins Spotted Off Venice: Everyone Comes To Look!', scope: { kind: 'location', locationId: 'venice' }, vibe: 'hype', traffic: 1.45 },
  { id: 'high-surf', headline: 'High Surf Advisory: Boardwalk Half Closed', scope: { kind: 'location', locationId: 'venice' }, vibe: 'chaos', traffic: 0.6 },

  // ——— Santa Monica ———
  { id: 'influencer-meetup', headline: 'Influencer Meetup On The Promenade: Ring Lights Everywhere!', scope: { kind: 'location', locationId: 'santamonica' }, vibe: 'hype', traffic: 1.5 },
  { id: 'pier-maintenance', headline: 'Pier Maintenance: Tourists Rerouted Inland', scope: { kind: 'location', locationId: 'santamonica' }, vibe: 'chaos', traffic: 0.6 },
  { id: 'wellness-expo', headline: 'Wellness Expo At The Civic Center!', scope: { kind: 'location', locationId: 'santamonica' }, vibe: 'wellness', traffic: 1.45 },

  // ——— Calabasas ———
  { id: 'kardashian-spotting', headline: 'Kardashian Spotted In Calabasas: Teens Descend!', scope: { kind: 'location', locationId: 'calabasas' }, vibe: 'hype', traffic: 1.6, pay: 1.1 },
  { id: 'gated-lockdown', headline: 'Gated Community Repaves Roads: Nobody Can Get Out', scope: { kind: 'location', locationId: 'calabasas' }, vibe: 'chaos', traffic: 0.55 },
  { id: 'lacrosse-final', headline: 'Private School Lacrosse Final: Parents Need Refreshments', scope: { kind: 'location', locationId: 'calabasas' }, vibe: 'money', traffic: 1.4 },

  // ——— Beverly Grove ———
  { id: 'paparazzi-swarm', headline: 'Paparazzi Swarm Beverly Grove: Celebrity Sighting!', scope: { kind: 'location', locationId: 'beverlygrove' }, vibe: 'hype', traffic: 1.6 },
  { id: 'parking-war', headline: 'Parking Garage Chaos Reaches Historic Levels', scope: { kind: 'location', locationId: 'beverlygrove' }, vibe: 'chaos', traffic: 0.6, patience: 0.7 },
  { id: 'yoga-anarchy', headline: '6PM Yoga Class Lets Out Early: Anarchy!', scope: { kind: 'location', locationId: 'beverlygrove' }, vibe: 'wellness', traffic: 1.45 },

  // ——— Beverly Hills ———
  { id: 'strawberry-viral', headline: '$19 Strawberry Goes Viral Again: Beverly Hills Mobbed!', scope: { kind: 'location', locationId: 'beverlyhills' }, vibe: 'hype', traffic: 1.6, pay: 1.15 },
  { id: 'awards-lockdown', headline: 'Awards Ceremony Locks Down Beverly Hills Traffic', scope: { kind: 'location', locationId: 'beverlyhills' }, vibe: 'chaos', traffic: 0.5 },
  { id: 'tour-buses', headline: 'Record Number Of Tour Buses On Rodeo Today!', scope: { kind: 'location', locationId: 'beverlyhills' }, vibe: 'hype', traffic: 1.4 },

  // ——— The Palisades ———
  { id: 'farmers-palisades', headline: 'Palisades Farmers Market Draws Serene Crowds', scope: { kind: 'location', locationId: 'palisades' }, vibe: 'wellness', traffic: 1.45 },
  { id: 'pch-closure', headline: 'PCH Lane Closure: The Palisades Is Unreachable', scope: { kind: 'location', locationId: 'palisades' }, vibe: 'chaos', traffic: 0.45 },
  { id: 'charity-5k', headline: 'Charity 5K Finishes At The Village: Runners Are Thirsty!', scope: { kind: 'location', locationId: 'palisades' }, vibe: 'wellness', traffic: 1.55 },

  // ——— Deck expansion: more LA, more variety ———
  { id: 'dodgers-win', headline: 'Dodgers Walk It Off: The Whole City Is In A Good Mood', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.35, patience: 1.15 },
  { id: 'lakers-parade', headline: 'Championship Parade Downtown: Everyone Is Somewhere Else Or Celebrating', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.25 },
  { id: 'ciclavia', headline: 'CicLAvia Opens The Streets: Thousands On Bikes, All Thirsty', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.45 },
  { id: 'june-gloom-discourse', headline: 'Marine Layer Discourse Reaches Day 11 On Local Twitter', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.85 },
  { id: 'kombucha-recall', headline: 'Boutique Kombucha Recall: Trust In Fermentation Shaken', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.75 },
  { id: 'pilates-opening', headline: 'Another Pilates Studio Opens: Reformer Waitlists Citywide', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.3 },
  { id: 'run-club', headline: 'Sunday Run Club Culture Officially Out Of Control', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.35 },
  { id: 'espresso-martini', headline: 'City Collectively Regrets Last Night\'s Espresso Martinis', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.25, patience: 0.85 },
  { id: 'audition-week', headline: 'Self-Tape Season: Half The City Is Being "So Normal" On Camera', scope: { kind: 'global' }, vibe: 'money', traffic: 1.1, patience: 0.85, audience: 'industry' },
  { id: 'gifting-suite', headline: 'Awards Gifting Suites Open: Free Stuff For People Who Need It Least', scope: { kind: 'global' }, vibe: 'money', pay: 1.2, audience: 'industry' },
  { id: 'super-bloom', headline: 'Super Bloom Weekend: Everyone Is Off Taking Poppy Photos', scope: { kind: 'global' }, vibe: 'hype', traffic: 0.7, audience: 'locals' },
  { id: 'gas-prices', headline: 'Gas Hits $7: Walking Is Suddenly A Lifestyle Choice', scope: { kind: 'global' }, vibe: 'money', traffic: 1.2, pay: 0.9, audience: 'locals' },
  { id: 'earthquake-small', headline: '3.9 Earthquake: Everyone Posts "Did You Feel That"', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.85, patience: 0.85 },
  { id: 'santa-ana-discourse', headline: 'Santa Anas Blow In: Everyone Blames The Wind For Their Behavior', scope: { kind: 'global' }, vibe: 'chaos', patience: 0.7 },
  { id: 'moon-circle', headline: 'Full Moon Circle At Runyon: Manifestation Levels Elevated', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.2 },
  { id: 'juicer-influencer', headline: 'Wellness Influencer Apologizes (For The Juice Thing)', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.8 },
  { id: 'matcha-drop', headline: 'Limited Ceremonial Matcha Drop Causes Lines Across The City', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.3 },
  { id: 'farmers-market-day', headline: 'Peak Farmers Market Weather: Tote Bags As Far As The Eye Can See', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.3 },
  { id: 'sober-curious', headline: '"Sober Curious" Trend Peaks: Mocktail Demand Surges', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.25 },
  { id: 'street-takeover', headline: 'Street Takeover Discourse: Everyone Has An Opinion, Nobody Has Plans', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.9 },
  { id: 'pop-up-week', headline: 'Pop-Up Week: Every Parking Lot Is Now A Concept', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.3 },
  { id: 'wellness-retreat', headline: 'Half Your Customer Base Is At A Retreat In Ojai', scope: { kind: 'global' }, vibe: 'wellness', traffic: 0.7, audience: 'locals' },
  { id: 'premiere-night', headline: 'Big Premiere Tonight: Blowouts And Green Juice All Day', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.2, pay: 1.1, audience: 'industry' },
  { id: 'influencer-drama', headline: 'Two Wellness Influencers Are Feuding And It\'s All Anyone Talks About', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.15, patience: 0.9 },
  { id: 'crystal-fair', headline: 'Crystal & Mineral Fair In Town: Energies Are Aligned', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.2, patience: 1.2 },
  { id: 'heat-advisory-park', headline: 'Everyone Suddenly Remembers Griffith Park Has No Shade', scope: { kind: 'global' }, vibe: 'chaos', traffic: 1.15 },
  { id: 'oat-milk-shortage', headline: 'Oat Milk Shortage: Baristas Bracing For Impact', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.85 },
  { id: 'nepo-discourse', headline: 'Nepo Baby Discourse Round 14: Engagement Is Through The Roof', scope: { kind: 'global' }, vibe: 'hype', traffic: 1.1 },
  { id: 'private-chef', headline: 'Private Chef Shortage Forces The Wealthy To Buy Their Own Smoothies', scope: { kind: 'global' }, vibe: 'money', pay: 1.25, traffic: 1.1 },
  { id: 'tarot-says-no', headline: 'Prominent Tarot Reader Advises Against "Big Purchases"', scope: { kind: 'global' }, vibe: 'chaos', pay: 0.8 },
  { id: 'goop-adjacent', headline: 'New Goop-Adjacent Newsletter Endorses Sea Moss, Again', scope: { kind: 'global' }, vibe: 'wellness', traffic: 1.25 },
  { id: 'jury-duty', headline: 'Half The Westside Got Jury Duty The Same Week', scope: { kind: 'global' }, vibe: 'chaos', traffic: 0.75, audience: 'locals' },
  // ——— Supply shocks: the input market has moods too ———
  { id: 'strawberry-futures', headline: 'Unseasonal Snow In Japan: Strawberry Futures Soar', scope: { kind: 'global' }, vibe: 'chaos', shock: { ingredient: 'strawberries', mult: 1.7 } },
  { id: 'coconut-freighter', headline: 'Coconut Freighter Stuck Outside The Port Of LA', scope: { kind: 'global' }, vibe: 'chaos', shock: { ingredient: 'coconutCream', mult: 1.6 } },
  { id: 'seamoss-glut', headline: 'Sea Moss Harvest Glut: Wholesalers Practically Giving It Away', scope: { kind: 'global' }, vibe: 'wellness', shock: { ingredient: 'seaMoss', mult: 0.55 } },

  { id: 'grove-tourists', headline: 'Tour Bus Season Peaks: Cameras Out, Wallets Open', scope: { kind: 'location', locationId: 'beverlygrove' }, vibe: 'hype', traffic: 1.4, pay: 1.1 },
  { id: 'abbot-kinney-fest', headline: 'Abbot Kinney Festival: The Whole Street Is A Runway', scope: { kind: 'location', locationId: 'venice' }, vibe: 'hype', traffic: 1.6 },
  { id: 'calabasas-car-show', headline: 'Cars & Coffee In Calabasas: Engines Loud, Wallets Louder', scope: { kind: 'location', locationId: 'calabasas' }, vibe: 'money', traffic: 1.4, pay: 1.15 },
];

export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e]));
