// Trading-card bios for every LA archetype in the crowd. Indexed to match
// OUTFITS in Person.tsx. Each hover deals a seeded pick from the pools, so
// every individual gets their own name, moves, and quote. Tone: roast.
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
    moves: ['Compares Everything To Back Home', 'Cried On The 405 (Twice Today)', 'Calls It "Cali" Unironically', 'Thinks They Saw Timothée (It Was A Barista)', 'Still Owns A Winter Coat, Just In Case'],
    weakness: 'left turns',
    quotes: ['Everyone here is so fake nice. I love it.', 'My rent doubled but my VIBES tripled.', 'I give it a year. (Year six.)'],
  },
  { // 1 — blue shirt basic
    title: 'The Guy Who Knows A Guy',
    types: 'HUSTLE / LOOPHOLES',
    names: ['Vinny', 'Marcus', 'Tony', 'Dave', 'Rico'],
    moves: ['Knows The Owner (The Owner Disagrees)', 'Texts A Guy Who Never Texts Back', 'Cash Only, No Reason', 'Three LLCs, Zero Products', 'Was Almost In A Fast & Furious'],
    weakness: 'audits',
    quotes: ['I could have gotten you this wholesale.', 'Deal is basically done. Basically.', 'Don’t google me, there’s a mixup.'],
  },
  { // 2 — green basic
    title: 'The Farmers Market Regular',
    types: 'PRODUCE / VENDETTAS',
    names: ['Marge', 'Willow', 'Rosemary', 'Pat', 'Gene'],
    moves: ['Squeezes Fruit She Will Never Buy', 'Has Beef With A Beekeeper', 'Announces Prices Out Loud, Appalled', 'Brings 14 Jars, Buys 1 Radish', 'Reports Stands To A Committee'],
    weakness: 'out-of-season anything',
    quotes: ['These strawberries have done nothing to earn this price.', 'I knew this stand before it sold out. Literally today.', 'Is this spray-free or spray-quiet?'],
  },
  { // 3 — white tee + cap
    title: 'The Little League Dad',
    types: 'SNACKS / UNRESOLVED DREAMS',
    names: ['Greg', 'Mike', 'Randy', 'Steve', 'Carl'],
    moves: ['Coaches From The Fence (Uninvited)', 'Owns Six Coolers, Trusts None', 'Relives The ‘99 Regionals Nightly', 'Argues With Teen Umpires', 'Claps Until It’s Uncomfortable'],
    weakness: 'his son’s actual interests',
    quotes: ['He gets it from me. The yips too.', 'Ref, I have a PODCAST.', 'We don’t talk about the 2019 season.'],
  },
  { // 4 — pink pilates set
    title: 'The Pilates Girl',
    types: 'CORE / DELUSION',
    names: ['Kayleigh', 'Sloane', 'Bella', 'Peyton', 'Maddie'],
    moves: ['Cancels Plans, Keeps Reformer', 'Romanticizes Buying $19 Juice', 'Emotional Support Water Bottle (Named)', 'Calls Walking "Movement"', 'Has Never Once Been On Time'],
    weakness: 'a 9 AM anything',
    quotes: ['It’s literally so important to move your body.', 'I can’t. I have Pilates. Forever.', 'This smoothie is my whole personality today.'],
  },
  { // 5 — purple pilates set
    title: 'The Pilates Girl',
    types: 'CORE / MERCURY',
    names: ['Harlow', 'Brynn', 'Tatum', 'Emerson', 'Lux'],
    moves: ['Blames Mercury For Being Rude', 'Diagnoses Strangers’ Auras', 'Cycle Syncs Her Excuses', 'Gut Health Monologue (47 Min)', 'Manifests Parking, Steals Yours'],
    weakness: 'being told she’s projecting',
    quotes: ['My nervous system said no today.', 'You’re SO in your masculine right now.', 'It’s giving inflammation.'],
  },
  { // 6 — tech bro vest
    title: 'The Tech Bro',
    types: 'DISRUPTION / FLEECE',
    names: ['Braden', 'Kyle', 'Tanner', 'Dev', 'Josh'],
    moves: ['Explains Your Job To You', 'Optimizes Sleep, Ruins Parties', 'Says "Bandwidth" At A Funeral', 'Expenses This Smoothie To A Dead Startup', 'Cold Plunge Personality'],
    weakness: 'eye contact without a deck',
    quotes: ['We’re pre-revenue but post-vision.', 'I’d disrupt this cart. Respectfully.', 'My sleep score outranks my credit score.'],
  },
  { // 7 — influencer
    title: 'The Influencer',
    types: 'CONTENT / DESPERATION',
    names: ['Kandice', 'Skye', 'Lexi', 'Amber', 'Presley'],
    moves: ['Films Strangers’ Children', 'Cried On Camera (It Performed Well)', 'Golden Hour Ambush', 'Says "Community" Means Discount', 'Three Takes Of A Candid Laugh'],
    weakness: 'comments off',
    quotes: ['Can you go again? I wasn’t rolling.', 'This is UGC, technically. Legally? Unclear.', 'My engagement is down and so am I.'],
  },
  { // 8 — dog dad
    title: 'The Dog Dad',
    types: 'LEASH / CODEPENDENCE',
    names: ['Miles', 'Jordan', 'Pete', 'Andre', 'Cole'],
    moves: ['Introduces The Dog First, Himself Never', 'Refers To Himself As "Dada"', '"He’s Friendly" (He Is Not)', 'Dog Has A Therapist And A Stylist', 'Custody Negotiations, Year Three'],
    weakness: '"no dogs allowed"',
    quotes: ['He’s a rescue. I’m the one who was saved.', 'Sorry — he’s reactive. To everything.', 'We’re not "socializing him." He’s an introvert.'],
  },
  { // 9 — stroller parent
    title: 'The Almond Mom',
    types: 'CONTROL / SNACK DENIAL',
    names: ['Whitney', 'Meredith', 'Claire', 'Joanna', 'Blaire'],
    moves: ['Stroller As A Weapon', 'Confiscates Birthday Cake', 'Asks If Water Has Seed Oils', '"We Don’t Do Dyes" (The Kid Does, Secretly)', 'Judges Your Cart From 40 Feet'],
    weakness: 'grandma’s house',
    quotes: ['He’s never had refined sugar. He’s had rage.', 'Is there agave in this? Is there JOY in this?', 'We’re raising him alkaline.'],
  },
  { // 10 — hoodie skater
    title: 'The Skater Kid',
    types: 'KICKFLIP / TRUANCY',
    names: ['Dylan', 'Ryder', 'Ollie', 'Theo', 'Max'],
    moves: ['Lands It On The Ninth Try, Claims First', 'Films His Homie Eating It (Priorities)', 'Owes Everyone Here $4', 'Waxes Public Property', 'Allergic To Applause'],
    weakness: 'his mom calling',
    quotes: ['It’s chill. Everything’s chill. I’m bleeding.', 'Security knows me by name. Both names.', 'You got a dollar? You got eleven dollars?'],
  },
  { // 11 — surfer
    title: 'The Surfer',
    types: 'SALT / UNEMPLOYMENT',
    names: ['Kai', 'Sunny', 'Diego', 'Bodhi', 'Reef'],
    moves: ['Shirt Optional, Always', 'Quit Three Jobs For Swells', 'Describes Waves Like Ex-Girlfriends', 'Dawn Patrol, Afternoon Nap, No In-Between', 'Owns A Van Worth More Than His Apartment'],
    weakness: 'onshore wind and W-2s',
    quotes: ['Should’ve been here an hour ago. Story of my life.', 'Work can wait. It has waited. Years.', 'The ocean is my LinkedIn.'],
  },
  { // 12 — visor power walker
    title: 'The Power Walker',
    types: 'CARDIO / SURVEILLANCE',
    names: ['Barb', 'Sandy', 'Diane', 'Gail', 'Ruth'],
    moves: ['Elbows Like Pistons, Eyes Like Drones', 'Knows Your Business Before You Do', 'Files Noise Complaints Recreationally', 'The 5 AM Route Of Judgment', 'Waves At Dogs, Glares At Owners'],
    weakness: 'a closed sidewalk',
    quotes: ['We saw a coyote on Tuesday. I blame the new neighbors.', 'I walk eight miles a day. For evidence.', 'I don’t gossip. I *report*.'],
  },
  { // 13 — all-black industry
    title: 'The Development Exec',
    types: 'NOTES / SOUL DEBT',
    names: ['Morgan', 'Blake', 'Sydney', 'Parker', 'Reese'],
    moves: ['Passes Enthusiastically', 'Loves It (Will Never Make It)', 'Circles Back Into The Void', 'Takes Credit Via "We"', 'Reschedules Lunch Until You Die'],
    weakness: 'an original idea',
    quotes: ['Love it. We’ll pass.', 'It’s a maybe, which is a no, which is a maybe.', 'Can it be the other thing, but worse?'],
  },
  { // 14 — tote hipster
    title: 'The Tote Bag Person',
    types: 'ANALOG / SUPERIORITY',
    names: ['Juniper', 'Silas', 'Margot', 'Arlo', 'Wren'],
    moves: ['Owns It On Vinyl, Unopened', 'Knew Them Before You Ruined Them', 'Judges Your Coffee Order Silently (Loudly)', 'Film Camera With No Film In It', 'Quit Streaming, Won’t Shut Up About It'],
    weakness: 'anything popular',
    quotes: ['The reissue isn’t the same. Nothing is.', 'It was better as a zine no one read.', 'I don’t "listen." I *curate*.'],
  },
  { // 15 — shades it-girl
    title: 'The It Girl',
    types: 'MYSTERY / CRUELTY',
    names: ['Roma', 'Devon', 'Nico', 'Sasha', 'Blair'],
    moves: ['Arrives Late Correctly', 'The Stare That Ends Careers', 'Soft-Launches Boyfriends, Hard-Launches Exits', 'Compliments That Are Autopsies', 'Has Never Waited In A Line'],
    weakness: 'being perceived at brunch',
    quotes: ['I don’t really post anymore. People post *about* me.', 'It’s giving... attempt.', 'I know the DJ. The DJ wishes he knew me.'],
  },
  { // 16 — beret artist
    title: 'The Artist',
    types: 'VISION / UNPAID INVOICES',
    names: ['Indigo', 'Clementine', 'Moss', 'Ziggy', 'Vera'],
    moves: ['Explains The Piece Until You Apologize', 'Free Wine Radar (Gallery-Grade)', 'Rent-Controlled And Insufferable Since 2011', 'Between Mediums, Between Paychecks', 'Your Aura, But As An Insult'],
    weakness: 'Venmo requests',
    quotes: ['It’s about the negative space. Like my savings.', 'The landlord is my muse and my enemy.', 'Commercial success would honestly ruin me. So far so good.'],
  },
  { // 17 — brandy teen
    title: 'The Brandy Teen',
    types: 'OVERSIZED / MENACE',
    names: ['Madison', 'Chloe', 'Ava', 'Brooklynn', 'Emma'],
    moves: ['One Size Fits Some, Judges All', 'Screenshots You For The Group Chat', 'Mom’s Card, Zero Remorse', 'Films Everything, Learns Nothing', 'Can End You With Two Words'],
    weakness: '2% battery',
    quotes: ['That’s so unserious.', 'You’re kind of giving side character.', 'Can you Zelle me back? I know you won’t.'],
  },
  { // 18 — screenwriter
    title: 'The Screenwriter',
    types: 'DIALOGUE / COPING',
    names: ['Jonah', 'Eli', 'Nate', 'Simone', 'Abby'],
    moves: ['Pitches At Funerals', 'Third Act Problems (Also Life)', 'Almost Sold It Twice, Tells You Thrice', 'Squats In Coffee Shops Like It’s Rent', 'Puts You In The Script As A Villain'],
    weakness: 'notes from anyone',
    quotes: ['My agent says January. My agent says a lot of things.', 'It’s a thriller, but warm. Like me.', 'You’d be perfect for a character who dies early.'],
  },
  { // 19 — old money lady
    title: 'The Old Money Lady',
    types: 'LINEN / MENACE (QUIET)',
    names: ['Bitsy', 'CeCe', 'Lovey', 'Babs', 'Mimi'],
    moves: ['Compliments That Devastate Bloodlines', 'Has A Wing Named After Her Somewhere', 'Strongly Worded Note, Hand-Delivered By Staff', 'Remembers Everything, Forgives Nothing', 'Has Never Touched A Door Handle'],
    weakness: 'valet delays',
    quotes: ['We summer elsewhere. We winter elsewhere. We’re rarely here.', 'How brave, wearing that.', 'It’s vintage, darling. Unlike your family.'],
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
