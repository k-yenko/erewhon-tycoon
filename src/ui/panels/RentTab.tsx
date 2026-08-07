import { useState } from 'react';
import type { GameState } from '../../game/types';
import { LOCATIONS } from '../../game/content/locations';
import { fmtMoney } from '../../game/economy';
import Meter from '../Meter';

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
          <div className="name" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11 }}>
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
          <div className="info-row">
            <span className="label">Rent</span>
            <span>{loc.rent === 0 ? 'FREE' : `${fmtMoney(loc.rent)} / day`}</span>
          </div>
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
