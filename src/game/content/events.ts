import type { EventDef } from '../types';

// One headline per day, mirroring the original's categories:
// global good/bad, pay-more/pay-less, patience up/down, location-specific.
// Multipliers: traffic ×0.4–×1.6, pay ±30%, patience ±40%.
export const EVENTS: EventDef[] = [
  // ——— Global: good for business ———
  { id: 'teachers-strike', headline: 'Teachers On Strike: No School For Kids!', scope: { kind: 'global' }, traffic: 1.4 },
  { id: 'adaptogens-real', headline: 'New Study: Adaptogens Are Real, Probably!', scope: { kind: 'global' }, traffic: 1.3 },
  { id: 'protein-maxxing', headline: 'Cottage Cheese Protein-Maxxing Trend Up 82%!', scope: { kind: 'global' }, traffic: 1.3 },
  { id: 'wellness-day', headline: 'City Declares Official Wellness Day!', scope: { kind: 'global' }, traffic: 1.35 },
  { id: 'smoothie-tiktok', headline: 'Your Smoothie Stand Is Mildly Viral On TikTok!', scope: { kind: 'global' }, traffic: 1.5 },
  { id: 'glp1-muscle-panic', headline: 'GLP-1 Muscle-Loss Panic: Everyone Needs Protein NOW!', scope: { kind: 'global' }, traffic: 1.35, pay: 1.1 },
  { id: 'gut-health-week', headline: 'Podcasts Declare It Gut Health Week!', scope: { kind: 'global' }, traffic: 1.25 },
  { id: 'dry-january', headline: 'Dry January Energy Hits In August!', scope: { kind: 'global' }, traffic: 1.3 },
  { id: 'pilates-convention', headline: 'National Pilates Convention Comes To Town!', scope: { kind: 'global' }, traffic: 1.4 },
  { id: 'celeb-pap-walk', headline: 'A-Lister Photographed Holding A Smoothie Just Like Yours!', scope: { kind: 'global' }, traffic: 1.5, pay: 1.1 },

  // ——— Global: bad for business ———
  { id: 'glp1-nobody-hungry', headline: "GLP-1 News Cycle: Nobody's Hungry Anymore", scope: { kind: 'global' }, traffic: 0.6 },
  { id: 'cleanse-discourse', headline: 'Juice Cleanse Discourse Turns Ugly On TikTok', scope: { kind: 'global' }, traffic: 0.7 },
  { id: 'seed-oil-scare', headline: 'Influencer Claims Smoothies Are Full Of Seed Oils!', scope: { kind: 'global' }, traffic: 0.65 },
  { id: 'competitor-drop', headline: 'Competing Grocery Chain Drops Its Own Celebrity Smoothie!', scope: { kind: 'global' }, traffic: 0.7 },
  { id: 'coachella-exodus', headline: 'Coachella Weekend: The Entire City Has Left For The Desert', scope: { kind: 'global' }, traffic: 0.5 },
  { id: 'mercury-sales', headline: 'Astrologers Advise Against Purchases During Mercury Retrograde', scope: { kind: 'global' }, traffic: 0.7 },
  { id: 'raw-milk-recall', headline: 'Raw Milk Recall Shakes Consumer Confidence In Wellness Drinks', scope: { kind: 'global' }, traffic: 0.6 },

  // ——— Customers pay MORE ———
  { id: 'tech-ipo', headline: 'Tech IPO Mints 400 New Millionaires Overnight!', scope: { kind: 'global' }, pay: 1.3 },
  { id: 'awards-season', headline: "Awards Season: Everyone's On A Pre-Gala Cleanse!", scope: { kind: 'global' }, pay: 1.25, traffic: 1.1 },
  { id: 'bonus-season', headline: 'Entertainment Bonus Season: Assistants Sent On $700 Hauls!', scope: { kind: 'global' }, pay: 1.3 },
  { id: 'tax-refund', headline: 'Tax Refunds Land: Citizens Feel Briefly Rich!', scope: { kind: 'global' }, pay: 1.2 },

  // ——— Customers pay LESS ———
  { id: 'writers-strike', headline: "Industry Strike: Everyone's Money Is Frozen In Development", scope: { kind: 'global' }, pay: 0.75 },
  { id: 'rent-due', headline: 'Rent Due Week Hits The Eastside Hard', scope: { kind: 'global' }, pay: 0.8 },
  { id: 'stock-dip', headline: 'Stock Market Dips: Trust Funds Feel The Squeeze', scope: { kind: 'global' }, pay: 0.75 },
  { id: 'budgeting-app', headline: 'Viral Budgeting App Tells Users To "Audit Your Smoothies"', scope: { kind: 'global' }, pay: 0.8 },

  // ——— Queue patience up ———
  { id: 'sound-bath', headline: 'Citywide Sound Bath Festival Leaves Everyone Unusually Calm', scope: { kind: 'global' }, patience: 1.4 },
  { id: 'waiting-wellness', headline: 'Study: Waiting In Line Is Actually A Mindfulness Practice', scope: { kind: 'global' }, patience: 1.35 },
  { id: 'digital-detox', headline: 'Digital Detox Trend: Nobody Is Checking The Time', scope: { kind: 'global' }, patience: 1.3 },

  // ——— Queue patience down ———
  { id: 'mercury-retrograde', headline: "Mercury Retrograde: Everyone's On Edge", scope: { kind: 'global' }, patience: 0.6 },
  { id: 'traffic-405', headline: 'The 405 Is A Parking Lot: Citizens Arrive Pre-Annoyed', scope: { kind: 'global' }, patience: 0.65 },
  { id: 'cold-plunge', headline: 'Cold Plunge Trend Makes Everyone Weirdly Intense', scope: { kind: 'global' }, patience: 0.7 },
  { id: 'matcha-shortage', headline: 'Global Matcha Shortage Causes Citywide Irritability', scope: { kind: 'global' }, patience: 0.7 },

  // ——— Your Driveway ———
  { id: 'stayhome-day', headline: 'Neighborhood Celebrates "Stay At Home" Day!', scope: { kind: 'location', locationId: 'driveway' }, traffic: 1.5 },
  { id: 'block-party', headline: 'Your Block Is Having A Block Party!', scope: { kind: 'location', locationId: 'driveway' }, traffic: 1.6 },
  { id: 'street-sweeping', headline: 'Street Sweeping Day: Everyone Is Moving Their Car', scope: { kind: 'location', locationId: 'driveway' }, traffic: 0.6 },

  // ——— Silver Lake ———
  { id: 'flea-market', headline: 'Vintage Flea Market Takes Over Silver Lake!', scope: { kind: 'location', locationId: 'silverlake' }, traffic: 1.5 },
  { id: 'band-plays', headline: 'Secret Show At The Bowl: Silver Lake Empties By Noon', scope: { kind: 'location', locationId: 'silverlake' }, traffic: 0.6 },
  { id: 'reservoir-loop', headline: 'Reservoir Walking Loop Named "Most Photogenic" In LA!', scope: { kind: 'location', locationId: 'silverlake' }, traffic: 1.4 },

  // ——— Culver City ———
  { id: 'marathon-culver', headline: 'LA Marathon Closes Culver City Streets!', scope: { kind: 'location', locationId: 'culver' }, traffic: 0.5 },
  { id: 'studio-lunch', headline: 'Every Studio Scheduled Lunch At The Same Time!', scope: { kind: 'location', locationId: 'culver' }, traffic: 1.5 },
  { id: 'layoffs-culver', headline: 'Tech Layoffs Announced: Culver Campus Badges Deactivated', scope: { kind: 'location', locationId: 'culver' }, traffic: 0.6, pay: 0.85 },

  // ——— Studio City ———
  { id: 'pilot-season', headline: 'Pilot Season: The Valley Is Caffeinated And Manifesting', scope: { kind: 'location', locationId: 'studio' }, traffic: 1.5 },
  { id: 'production-halt', headline: 'Production Halt: Studio City Goes Quiet', scope: { kind: 'location', locationId: 'studio' }, traffic: 0.6 },
  { id: 'farmers-market-studio', headline: 'Sunday Farmers Market Draws The Whole Valley!', scope: { kind: 'location', locationId: 'studio' }, traffic: 1.4 },

  // ——— Venice ———
  { id: 'surf-contest', headline: 'International Surf Contest At The Breakwater!', scope: { kind: 'location', locationId: 'venice' }, traffic: 1.6 },
  { id: 'venice-ghost', headline: 'Festival Weekend: Venice Is A Ghost Town', scope: { kind: 'location', locationId: 'venice' }, traffic: 0.5 },
  { id: 'dolphins-venice', headline: 'Dolphins Spotted Off Venice: Everyone Comes To Look!', scope: { kind: 'location', locationId: 'venice' }, traffic: 1.45 },
  { id: 'high-surf', headline: 'High Surf Advisory: Boardwalk Half Closed', scope: { kind: 'location', locationId: 'venice' }, traffic: 0.6 },

  // ——— Santa Monica ———
  { id: 'influencer-meetup', headline: 'Influencer Meetup On The Promenade: Ring Lights Everywhere!', scope: { kind: 'location', locationId: 'santamonica' }, traffic: 1.5 },
  { id: 'pier-maintenance', headline: 'Pier Maintenance: Tourists Rerouted Inland', scope: { kind: 'location', locationId: 'santamonica' }, traffic: 0.6 },
  { id: 'wellness-expo', headline: 'Wellness Expo At The Civic Center!', scope: { kind: 'location', locationId: 'santamonica' }, traffic: 1.45 },

  // ——— Calabasas ———
  { id: 'kardashian-spotting', headline: 'Kardashian Spotted In Calabasas: Teens Descend!', scope: { kind: 'location', locationId: 'calabasas' }, traffic: 1.6, pay: 1.1 },
  { id: 'gated-lockdown', headline: 'Gated Community Repaves Roads: Nobody Can Get Out', scope: { kind: 'location', locationId: 'calabasas' }, traffic: 0.55 },
  { id: 'lacrosse-final', headline: 'Private School Lacrosse Final: Parents Need Refreshments', scope: { kind: 'location', locationId: 'calabasas' }, traffic: 1.4 },

  // ——— Beverly Grove ———
  { id: 'paparazzi-swarm', headline: 'Paparazzi Swarm Beverly Grove: Celebrity Sighting!', scope: { kind: 'location', locationId: 'beverlygrove' }, traffic: 1.6 },
  { id: 'parking-war', headline: 'Parking Garage Chaos Reaches Historic Levels', scope: { kind: 'location', locationId: 'beverlygrove' }, traffic: 0.6, patience: 0.7 },
  { id: 'yoga-anarchy', headline: '6PM Yoga Class Lets Out Early: Anarchy!', scope: { kind: 'location', locationId: 'beverlygrove' }, traffic: 1.45 },

  // ——— Beverly Hills ———
  { id: 'strawberry-viral', headline: '$19 Strawberry Goes Viral Again: Beverly Hills Mobbed!', scope: { kind: 'location', locationId: 'beverlyhills' }, traffic: 1.6, pay: 1.15 },
  { id: 'awards-lockdown', headline: 'Awards Ceremony Locks Down Beverly Hills Traffic', scope: { kind: 'location', locationId: 'beverlyhills' }, traffic: 0.5 },
  { id: 'tour-buses', headline: 'Record Number Of Tour Buses On Rodeo Today!', scope: { kind: 'location', locationId: 'beverlyhills' }, traffic: 1.4 },

  // ——— The Palisades ———
  { id: 'farmers-palisades', headline: 'Palisades Farmers Market Draws Serene Crowds', scope: { kind: 'location', locationId: 'palisades' }, traffic: 1.45 },
  { id: 'pch-closure', headline: 'PCH Lane Closure: The Palisades Is Unreachable', scope: { kind: 'location', locationId: 'palisades' }, traffic: 0.45 },
  { id: 'charity-5k', headline: 'Charity 5K Finishes At The Village: Runners Are Thirsty!', scope: { kind: 'location', locationId: 'palisades' }, traffic: 1.55 },
];

export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e]));
