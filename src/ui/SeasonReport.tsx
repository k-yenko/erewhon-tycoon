// Day 60: the season report. Arcade rules — three initials, no take-backs.
import { useState } from 'react';
import type { GameState } from '../game/types';
import { empireScore, addRun, runCard } from '../game/hallOfFame';
import { fmtMoney } from '../game/economy';

export default function SeasonReport({
  state,
  onDone,
}: {
  state: GameState;
  onDone: () => void;
}) {
  const [initials, setInitials] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const s = empireScore(state);

  const save = () => {
    const ini = (initials || 'AAA').toUpperCase().slice(0, 3);
    addRun({
      initials: ini,
      total: s.total,
      cash: Math.round(state.cash),
      lifetimeRevenue: Math.round(state.lifetimeRevenue),
      when: new Date().toISOString().slice(0, 10),
    });
    setSaved(true);
  };

  return (
    <div className="modal-overlay">
      <div className="panel modal" style={{ maxWidth: 460 }}>
        <h2 className="panel-title">Season Report — Day 60</h2>
        <div style={{ fontSize: 12, marginBottom: 10 }}>
          The season is over. This is what you built. (The cart keeps trading —
          but the books close today.)
        </div>
        <div className="info-row">
          <span className="label">Net worth</span>
          <span>{s.netWorth.toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="label">Reputation (city-wide buzz)</span>
          <span>{s.reputation.toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="label">Devotion (city-wide satisfaction)</span>
          <span>{s.devotion.toLocaleString()}</span>
        </div>
        {s.flagshipBonus > 0 && (
          <div className="info-row">
            <span className="label">
              Flagship Dream{state.wonDay ? `, achieved Day ${state.wonDay}` : ''}
            </span>
            <span>+{s.flagshipBonus.toLocaleString()}</span>
          </div>
        )}
        <div className="info-row" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, marginTop: 8 }}>
          <span>EMPIRE SCORE</span>
          <span>{s.total.toLocaleString()}</span>
        </div>
        <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', margin: '6px 0 10px' }}>
          Lifetime revenue: {fmtMoney(state.lifetimeRevenue)}
        </div>

        {!saved ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9 }}>INITIALS</span>
            <input
              value={initials}
              maxLength={3}
              onChange={(e) => setInitials(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())}
              style={{
                width: 64,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 14,
                padding: '6px 8px',
                border: '2px solid var(--ink)',
                background: 'var(--cream)',
                textAlign: 'center',
              }}
            />
            <button className="pixel-btn primary" onClick={save}>
              Enter The Hall
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 12, marginTop: 6 }}>
            Enshrined. The hall of fame lives on the title screen.
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <button
            className="pixel-btn"
            onClick={() => {
              void navigator.clipboard
                ?.writeText(runCard((initials || 'AAA').toUpperCase().slice(0, 3), s, state))
                .then(() => setCopied(true));
            }}
          >
            {copied ? 'Copied' : 'Copy Run Card'}
          </button>
          <button className="pixel-btn primary" onClick={onDone}>
            Keep Trading
          </button>
        </div>
      </div>
    </div>
  );
}
