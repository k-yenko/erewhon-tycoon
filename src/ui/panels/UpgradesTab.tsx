import type { GameState, UpgradeDef } from '../../game/types';
import { UPGRADES, RESALE_RATE } from '../../game/content/upgrades';
import { fmtMoney, era, ERA_2_AT, ERA_3_AT } from '../../game/economy';
import { PixelIcon } from '../icons';

const ERA_META: Record<number, { title: string; locked: (cur: number) => string | null }> = {
  1: { title: 'ACT I — THE HUSTLE', locked: () => null },
  2: {
    title: 'ACT II — THE LANDLORD ERA',
    locked: (cur) =>
      cur >= 2 ? null : `Unlocks at ${fmtMoney(ERA_2_AT)} lifetime revenue — when the city notices you.`,
  },
  3: {
    title: 'ACT III — THE JUICE WARS',
    locked: (cur) =>
      cur >= 3 ? null : `Unlocks at ${fmtMoney(ERA_3_AT)} lifetime revenue — when Moon Juus learns your name.`,
  },
};

export default function UpgradesTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  const currentEra = era(state);
  const ownedStandTier = UPGRADES.filter(
    (u) => u.effect.kind === 'stand' && state.upgrades.includes(u.id),
  ).reduce((m, u) => Math.max(m, (u.effect as { tier: number }).tier), 0);

  const renderItem = (u: UpgradeDef, eraLocked: boolean) => {
    const owned = state.upgrades.includes(u.id);
    const isStand = u.effect.kind === 'stand';
    const outranked = isStand && (u.effect as { tier: number }).tier <= ownedStandTier;
    return (
      <div
        className={`shop-item ${owned ? 'owned' : ''}`}
        key={u.id}
        style={eraLocked ? { opacity: 0.45 } : undefined}
      >
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
            disabled={eraLocked || state.cash < u.price || (isStand && outranked)}
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
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Upgrades</h2>
      {[1, 2, 3].map((e) => {
        const items = UPGRADES.filter((u) => (u.era ?? 1) === e);
        const lockedLine = ERA_META[e].locked(currentEra);
        return (
          <div key={e} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                margin: '10px 0 6px',
                color: lockedLine ? 'var(--kraft-dark)' : 'var(--ink)',
              }}
            >
              {ERA_META[e].title}
            </div>
            {lockedLine && (
              <div style={{ fontSize: 11, color: 'var(--kraft-dark)', marginBottom: 6 }}>
                {lockedLine}
              </div>
            )}
            {items.map((u) => renderItem(u, lockedLine !== null))}
          </div>
        );
      })}
    </div>
  );
}
