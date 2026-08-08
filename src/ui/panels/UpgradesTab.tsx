import type { GameState } from '../../game/types';
import { UPGRADES, RESALE_RATE } from '../../game/content/upgrades';
import { fmtMoney } from '../../game/economy';
import { PixelIcon } from '../icons';

export default function UpgradesTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  const ownedStandTier = UPGRADES.filter(
    (u) => u.effect.kind === 'stand' && state.upgrades.includes(u.id),
  ).reduce((m, u) => Math.max(m, (u.effect as { tier: number }).tier), 0);

  return (
    <div className="panel">
      <h2 className="panel-title">Upgrades</h2>
      {UPGRADES.map((u) => {
        const owned = state.upgrades.includes(u.id);
        const isStand = u.effect.kind === 'stand';
        const outranked = isStand && (u.effect as { tier: number }).tier <= ownedStandTier;
        return (
          <div className={`shop-item ${owned ? 'owned' : ''}`} key={u.id}>
            <span className="icon"><PixelIcon name={u.icon} size={24} /></span>
            <div className="body">
              <div className="name">{u.name}</div>
              <div className="tagline">{u.tagline}</div>
            </div>
            {owned ? (
              <button
                className="pixel-btn"
                style={{ fontSize: 10, padding: '4px 8px' }}
                title={`Sell for ${fmtMoney(u.price * RESALE_RATE)} — someone on the marketplace app wants it`}
                onClick={() => {
                  state.upgrades = state.upgrades.filter((id) => id !== u.id);
                  state.cash += Math.round(u.price * RESALE_RATE * 100) / 100;
                  commit();
                }}
              >
                SELL {fmtMoney(u.price * RESALE_RATE)}
              </button>
            ) : (
              <button
                className="pixel-btn"
                style={{ fontSize: 10, padding: '4px 8px' }}
                disabled={state.cash < u.price || (isStand && outranked)}
                onClick={() => {
                  state.cash -= u.price;
                  state.upgrades.push(u.id);
                  commit();
                }}
              >
                {fmtMoney(u.price)}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
