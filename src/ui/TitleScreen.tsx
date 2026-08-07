import { useState } from 'react';
import { QUOTES } from '../game/content/quotes';

export default function TitleScreen({
  hasSave,
  onNew,
  onContinue,
}: {
  hasSave: boolean;
  onNew: () => void;
  onContinue: () => void;
}) {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
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
    </div>
  );
}
