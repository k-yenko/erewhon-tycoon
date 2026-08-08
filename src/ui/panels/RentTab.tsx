import { useState } from 'react';
import { PXFONT } from '../icons';
import type { GameState } from '../../game/types';
import { LOCATIONS } from '../../game/content/locations';
import { fmtMoney, rentFor, rivalAt } from '../../game/economy';
import Meter from '../Meter';

function noveltyRead(n: number): string | null {
  if (n >= 0.85) return null; // fresh — nothing to say
  if (n >= 0.6) return 'The crowd knows your cart by now. Still works.';
  return "Honestly? They're a little over you here. Give it a week.";
}

export default function RentTab({
  state,
  commit,
  onPreview,
}: {
  state: GameState;
  commit: () => void;
  onPreview?: (locationId: string) => void;
}) {
  const [idx, setIdxRaw] = useState(() =>
    Math.max(0, LOCATIONS.findIndex((l) => l.id === state.locationId)),
  );
  const setIdx = (i: number) => {
    setIdxRaw(i);
    onPreview?.(LOCATIONS[i].id); // live-preview the browsed spot in the viewport
  };
  const loc = LOCATIONS[idx];
  const ls = state.locations[loc.id];
  const isCurrent = state.locationId === loc.id;
  const rent = rentFor(state, loc.id);

  return (
    <div className="panel">
      <h2 className="panel-title">Locations</h2>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Choose a location. Moving is free — your cash, upgrades, staff, and stock all
        come with you. Each spot remembers its own reputation.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className="pixel-btn"
          onClick={() => setIdx((idx + LOCATIONS.length - 1) % LOCATIONS.length)}
        >
          ◀
        </button>
        <div style={{ flex: 1, border: '2px solid var(--cream-deep)', padding: 10 }}>
          <div className="name" style={{ fontFamily: PXFONT, fontSize: 11 }}>
            {loc.name}
          </div>
          <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', margin: '6px 0' }}>
            {loc.blurb}
          </div>
          <div style={{ display: 'flex', gap: 10, margin: '8px 0' }}>
            <Meter value={ls.popularity} label="popularity" color="pink" />
            <Meter value={ls.satisfaction} label="satisfaction" color="blue" />
          </div>
          {/* the reason to ever leave home: crowds and wallets */}
          <div style={{ display: 'flex', gap: 10, margin: '8px 0' }}>
            <Meter value={loc.baseTraffic / 90} label="foot traffic" color="green" />
            <Meter value={(loc.wealth - 14) / 16} label="spending power" color="gold" />
          </div>
          {/* every spot has a deal: the thing it gives you, the thing it costs you */}
          <div style={{ fontSize: 11, margin: '6px 0 2px', color: 'var(--go, #2e6b33)' }}>
            + {loc.perk}
          </div>
          <div style={{ fontSize: 11, marginBottom: 6, color: 'var(--alert)' }}>
            − {loc.catch}
          </div>
          <div className="info-row">
            <span className="label">Rent</span>
            <span>
              {loc.rent === 0 ? 'FREE' : `${fmtMoney(rent)} / day`}
              {rent > loc.rent ? ' ▲' : ''}
            </span>
          </div>
          {rent > loc.rent && (
            <div style={{ fontSize: 11, color: 'var(--kraft-dark)', marginTop: 2 }}>
              The landlord noticed your line. Base rate is {fmtMoney(loc.rent)}.
            </div>
          )}
          {noveltyRead(ls.novelty ?? 1) && (
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
              {noveltyRead(ls.novelty ?? 1)}
            </div>
          )}
          {rivalAt(state, loc.id) && (
            <div style={{ fontSize: 11, color: 'var(--alert)', marginTop: 4 }}>
              {state.daily?.rivalIntent === 'undercut'
                ? '⚠ Moon Juus is parked here and undercutting you today. It’s personal now.'
                : state.daily?.rivalIntent === 'stalk'
                  ? '⚠ Moon Juus followed you here. You’ve been noticed.'
                  : '⚠ The Moon Juus truck is parked here today — expect a thinner, pickier crowd.'}
            </div>
          )}
        </div>
        <button className="pixel-btn" onClick={() => setIdx((idx + 1) % LOCATIONS.length)}>
          ▶
        </button>
      </div>
      <div style={{ marginTop: 10, textAlign: 'right' }}>
        {isCurrent ? (
          <span className="price">CURRENT SPOT</span>
        ) : (
          <button
            className="pixel-btn primary"
            onClick={() => {
              state.locationId = loc.id;
              commit();
            }}
          >
            Set Up Here
          </button>
        )}
      </div>
    </div>
  );
}
