// Trading-card bios for every LA archetype in the crowd. Indexed to match
// OUTFITS in Person.tsx. Each hover deals a seeded pick from the pools, so
// every individual gets their own name, moves, and quote.
import { mulberry32 } from '../rng';

export interface ArchetypeCard {
  name: string;
  title: string;
  types: string;    // "CORE / MATCHA" — the elemental typing
  aura: number;     // HP, basically
  moves: [string, string];
  weakness: string;
  quote: string;
}

interface ArchetypeDef {
  title: string;
  types: string;
  names: string[];
  moves: string[];
  weakness: string;
  quotes: string[];
}

const A: ArchetypeDef[] = [
  { // 0 — red tee basic
    title: 'The Recent Transplant',
    types: 'EAGER / LOST',
    names: ['Jess', 'Tyler', 'Dana', 'Sam', 'Kelsey'],
    moves: ['Compares Everything To Back Home', 'Hikes Runyon Exactly Once', 'Calls It "Cali"', 'Asks If That Was A Celebrity', 'Still Uses An Umbrella'],
    weakness: 'merging onto the 101',
    quotes: ['I am never shoveling snow again.', 'My building has a pool. A POOL.', 'Everyone here is so... hydrated.'],
  },
  { // 1 — blue shirt basic
    title: 'The Guy Who Knows A Guy',
    types: 'HUSTLE / CONNECTIONS',
    names: ['Vinny', 'Marcus', 'Tony', 'Dave', 'Rico'],
    moves: ['Knows The Owner', 'Texts A Guy', 'Gets You In', 'Never Pays Retail', 'Has A Cousin For That'],
    weakness: 'paper trails',
    quotes: ['I could have gotten you this wholesale.', 'You know who you should talk to?', 'Deal is basically done.'],
  },
  { // 2 — green basic
    title: 'The Farmers Market Regular',
    types: 'PRODUCE / OPINIONS',
    names: ['Marge', 'Willow', 'Rosemary', 'Pat', 'Gene'],
    moves: ['Squeezes Every Stone Fruit', 'Brings Her Own Jars', 'Interrogates The Beekeeper', 'Arrives At 7 AM Sharp', 'Distrusts Cellophane'],
    weakness: 'out-of-season anything',
    quotes: ['Good strawberries. Harry’s are better.', 'Is this spray-free though?', 'I knew this stand when it was a table.'],
  },
  { // 3 — white tee + cap
    title: 'The Little League Dad',
    types: 'SNACKS / VOLUME',
    names: ['Greg', 'Mike', 'Randy', 'Steve', 'Carl'],
    moves: ['Coaches From The Fence', 'Owns Six Coolers', 'Grills Unprompted', 'Claps Slightly Too Long', 'Disputes The Call'],
    weakness: 'umpires',
    quotes: ['He gets it from me.', 'Ref, come ON.', 'We peaked in the ‘99 regionals.'],
  },
  { // 4 — pink pilates set
    title: 'The Pilates Girl',
    types: 'CORE / MATCHA',
    names: ['Kayleigh', 'Sloane', 'Bella', 'Peyton', 'Maddie'],
    moves: ['Books The 6 AM Reformer', 'Romanticizes Her Life', 'Emotional Support Water Bottle', 'Hot Girl Walk (12-3-30)', 'Little Treat Economics'],
    weakness: '9 AM meetings',
    quotes: ['It’s literally so important to move your body.', 'I can’t, I have Pilates.', 'This is my little treat.'],
  },
  { // 5 — purple pilates set
    title: 'The Pilates Girl',
    types: 'CORE / CELERY JUICE',
    names: ['Harlow', 'Brynn', 'Tatum', 'Emerson', 'Lux'],
    moves: ['Wears The Set To Everything', 'Manifests Out Loud', 'Sculpt Class Waitlist', 'Gut Health Monologue', 'Books Two Classes, Attends One'],
    weakness: 'mercury retrograde',
    quotes: ['My nervous system is SO dysregulated.', 'We’re cycle syncing now.', 'It’s giving inflammation.'],
  },
  { // 6 — tech bro vest
    title: 'The Tech Bro',
    types: 'DISRUPTION / FLEECE',
    names: ['Braden', 'Kyle', 'Tanner', 'Dev', 'Josh'],
    moves: ['Explains Crypto Unprompted', 'Optimizes His Sleep', 'Walking Stand-Up Meeting', 'Expenses This Smoothie', 'Cold Plunge Testimony'],
    weakness: 'eye contact',
    quotes: ['We’re pre-revenue but post-vision.', 'I did a cold plunge this morning.', 'It’s basically Uber for wellness.'],
  },
  { // 7 — influencer
    title: 'The Influencer',
    types: 'CONTENT / LIGHTING',
    names: ['Kandice', 'Skye', 'Lexi', 'Amber', 'Presley'],
    moves: ['Films Without Consent', 'Golden Hour Ambush', 'Mid-Bite Voiceover', 'Link In Bio', 'Deletes The Candid'],
    weakness: 'bad lighting',
    quotes: ['Okay wait, that’s actually so viral.', 'Can you do that again? I wasn’t rolling.', 'This is UGC, technically.'],
  },
  { // 8 — dog dad
    title: 'The Dog Dad',
    types: 'LEASH / DEVOTION',
    names: ['Miles', 'Jordan', 'Pete', 'Andre', 'Cole'],
    moves: ['Introduces The Dog First', 'Refers To Himself As "Dada"', 'Carries The Small One', 'Throws Dog Birthday Parties', 'Shares Custody Amicably'],
    weakness: '"no dogs allowed"',
    quotes: ['He’s a rescue.', 'Sorry — he’s reactive.', 'We’re working on socialization.'],
  },
  { // 9 — stroller parent
    title: 'The Almond Mom',
    types: 'SNACKS / CONTROL',
    names: ['Whitney', 'Meredith', 'Claire', 'Joanna', 'Blaire'],
    moves: ['Stroller Right Of Way', 'Sugar-Free Birthday Cake', 'Reads Every Label Twice', 'Nap Schedule Enforcement', 'BYO Snack Pouch'],
    weakness: 'other kids’ birthday parties',
    quotes: ['He’s never had refined sugar.', 'Is there agave in this?', 'We don’t do dyes.'],
  },
  { // 10 — hoodie skater
    title: 'The Skater Kid',
    types: 'KICKFLIP / APATHY',
    names: ['Dylan', 'Ryder', 'Ollie', 'Theo', 'Max'],
    moves: ['Lands It On The Ninth Try', 'Films His Homie', 'Hydro Flask Percussion', 'Vibes Exclusively', 'Waxes The Curb'],
    weakness: 'security guards',
    quotes: ['It’s chill.', 'We already got kicked out twice.', 'You got a dollar?'],
  },
  { // 11 — surfer
    title: 'The Surfer',
    types: 'SALT / STOKE',
    names: ['Kai', 'Sunny', 'Diego', 'Bodhi', 'Reef'],
    moves: ['Dawn Patrol', 'Reads The Buoys', 'Wetsuit Lives In The Car', 'Calls It "Sheet Glass"', 'Quits Job Seasonally'],
    weakness: 'onshore wind',
    quotes: ['Should’ve been here an hour ago.', 'The water’s basically warm.', 'Work can wait. The swell can’t.'],
  },
  { // 12 — visor power walker
    title: 'The Power Walker',
    types: 'CARDIO / GOSSIP',
    names: ['Barb', 'Sandy', 'Diane', 'Gail', 'Ruth'],
    moves: ['Elbows Like Pistons', 'Knows Everyone’s Business', 'The 5 AM Route', 'Visor-Based Anonymity', 'Waves At Every Dog'],
    weakness: 'closed sidewalks',
    quotes: ['We saw a coyote on Tuesday.', 'It’s about consistency.', 'I don’t trust the new neighbors.'],
  },
  { // 13 — all-black industry
    title: 'The Development Exec',
    types: 'NOTES / BLACK',
    names: ['Morgan', 'Blake', 'Sydney', 'Parker', 'Reese'],
    moves: ['Circles Back', 'Takes It To The Team', 'Passes Enthusiastically', 'Reschedules Lunch Forever', 'Loves It (Won’t Make It)'],
    weakness: 'original ideas',
    quotes: ['Love it. We’ll pass.', 'It’s a maybe, which is a no.', 'Can it be more like the other thing?'],
  },
  { // 14 — tote hipster
    title: 'The Tote Bag Person',
    types: 'ANALOG / IRONY',
    names: ['Juniper', 'Silas', 'Margot', 'Arlo', 'Wren'],
    moves: ['Owns It On Vinyl', 'Knew Them Before They Blew Up', 'Shoots Exclusively 35mm', 'Tote Full Of Other Totes', 'Judges Your Coffee Order'],
    weakness: 'popularity',
    quotes: ['The reissue isn’t the same.', 'It was better as a zine.', 'I don’t stream. On principle.'],
  },
  { // 15 — shades it-girl
    title: 'The It Girl',
    types: 'MYSTERY / SUNGLASSES',
    names: ['Roma', 'Devon', 'Nico', 'Sasha', 'Blair'],
    moves: ['Arrives Late Correctly', 'The Unbothered Stare', 'Soft-Launches A Boyfriend', 'Leaves While It’s Still Good', 'Doesn’t Explain'],
    weakness: 'being perceived',
    quotes: ['I don’t really post anymore.', 'It’s giving... fine.', 'I know the DJ.'],
  },
  { // 16 — beret artist
    title: 'The Artist',
    types: 'VISION / TURPENTINE',
    names: ['Indigo', 'Clementine', 'Moss', 'Ziggy', 'Vera'],
    moves: ['Explains The Piece', 'Gallery Opening Wine Reflexes', 'Paint On Every Garment', 'Rent-Controlled Since 2011', 'Between Mediums Right Now'],
    weakness: 'invoicing',
    quotes: ['It’s about the negative space.', 'The landlord is my muse and my enemy.', 'I’m between mediums.'],
  },
  { // 17 — brandy teen
    title: 'The Brandy Teen',
    types: 'OVERSIZED / DRAMA',
    names: ['Madison', 'Chloe', 'Ava', 'Brooklynn', 'Emma'],
    moves: ['One Size Fits Some', 'Group Chat Screenshot', 'Borrows Mom’s Card', 'Mall Loitering (Advanced)', 'Films Everything Sideways'],
    weakness: 'low battery',
    quotes: ['That’s so unserious.', 'Everyone’s literally gonna be there.', 'Can you Zelle me back?'],
  },
  { // 18 — screenwriter
    title: 'The Screenwriter',
    types: 'DIALOGUE / DESPAIR',
    names: ['Jonah', 'Eli', 'Nate', 'Simone', 'Abby'],
    moves: ['Third Act Problems', 'Coffee Shop Squatting', 'Pitches At Parties', 'Almost Sold It Twice', 'Backs Up To Four Clouds'],
    weakness: 'notes',
    quotes: ['My agent says January.', 'It’s a thriller, but warm.', 'The second act is basically done.'],
  },
  { // 19 — old money lady
    title: 'The Old Money Lady',
    types: 'LINEN / DIVIDENDS',
    names: ['Bitsy', 'CeCe', 'Lovey', 'Babs', 'Mimi'],
    moves: ['Knows The Maître D’', 'Charity Luncheon Circuit', 'Strongly Worded Note', 'Has Never Touched Cash', 'Compliments That Devastate'],
    weakness: 'valet delays',
    quotes: ['We summer elsewhere.', 'My decorator would simply die.', 'It’s vintage, darling. Everything is.'],
  },
];

export function cardFor(outfitIndex: number, customerId: number): ArchetypeCard {
  const def = A[outfitIndex] ?? A[0];
  const rand = mulberry32((Math.imul(customerId + 1, 0x9e3779b9) ^ (outfitIndex * 7919)) >>> 0);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const m1 = Math.floor(rand() * def.moves.length);
  let m2 = Math.floor(rand() * (def.moves.length - 1));
  if (m2 >= m1) m2 += 1;
  return {
    name: pick(def.names),
    title: def.title,
    types: def.types,
    aura: 40 + Math.floor(rand() * 60),
    moves: [def.moves[m1], def.moves[m2]],
    weakness: def.weakness,
    quote: pick(def.quotes),
  };
}
