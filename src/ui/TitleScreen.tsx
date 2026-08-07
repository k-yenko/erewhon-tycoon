import { useState } from 'react';
import { QUOTES } from '../game/content/quotes';
import type { GameSettings } from '../game/types';
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
              Rival cart — the Moon Juus truck competes for corners
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
