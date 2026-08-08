import { useState } from 'react';
import { QUOTES } from '../game/content/quotes';
import type { GameSettings } from '../game/types';
import { loadBoard } from '../game/hallOfFame';
import { PixelIcon } from './icons';

export default function TitleScreen({
  hasSave,
  onNew,
  onContinue,
  settings,
  onToggle,
}: {
  hasSave: boolean;
  onNew: () => void;
  onContinue: () => void;
  settings: GameSettings;
  onToggle: (key: keyof GameSettings) => void;
}) {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [showModes, setShowModes] = useState(false);
  const [board] = useState(loadBoard);
  return (
    <div className="fullscreen">
      <div>
        <h1 className="wordmark">EREWHON</h1>
        <div className="subtitle">T Y C O O N</div>
      </div>
      <p className="quote">{quote}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {hasSave && (
          <button className="pixel-btn primary" onClick={onContinue}>
            Continue
          </button>
        )}
        <button className="pixel-btn" onClick={onNew}>
          New Game
        </button>
      </div>
      <p className="quote" style={{ fontSize: 11 }}>
        A tribute to Lemonade Tycoon. The prices are real.
      </p>
      <div style={{ fontSize: 10, color: 'var(--kraft-dark)', marginTop: 2 }}>
        SEASON: 60 DAYS · EMPIRE SCORE = WORTH + REPUTATION + DEVOTION
      </div>
      {board.length > 0 && (
        <div className="panel" style={{ padding: '10px 16px', marginTop: 10, minWidth: 300 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, marginBottom: 8 }}>
            HALL OF FAME
          </div>
          {board.slice(0, 5).map((e, i) => (
            <div
              key={`${e.initials}${i}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 18,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                padding: '3px 0',
              }}
            >
              <span>
                {i + 1}. {e.initials}
              </span>
              <span>{e.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* advanced modes tucked behind a gear, bottom-left */}
      <div style={{ position: 'fixed', left: 16, bottom: 16, textAlign: 'left' }}>
        {showModes && (
          <div className="panel" style={{ padding: '10px 14px', marginBottom: 8, maxWidth: 340 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, marginBottom: 8 }}>
              ADVANCED MODES
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.market} onChange={() => onToggle('market')} />
              Ingredient market — daily price swings + supply shocks
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, cursor: 'pointer', marginTop: 6 }}>
              <input type="checkbox" checked={settings.rival} onChange={() => onToggle('rival')} />
              Early rival — Moon Juus competes from day 1 (it always shows up in Act II)
            </label>
          </div>
        )}
        <button
          className="pixel-btn"
          style={{ padding: '6px 8px' }}
          title="Advanced modes"
          onClick={() => setShowModes((v) => !v)}
        >
          <PixelIcon name="gear" size={20} />
        </button>
      </div>
    </div>
  );
}
