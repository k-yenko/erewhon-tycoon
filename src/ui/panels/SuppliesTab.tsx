import type { GameState } from '../../game/types';
import { SUPPLIES } from '../../game/content/supplies';
import { computeMods, fmtMoney } from '../../game/economy';
import { PixelIcon } from '../icons';

export default function SuppliesTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  const mods = computeMods(state);
  const freeIce = mods.freeIce;
  return (
    <div className="panel">
      <h2 className="panel-title">Supplies</h2>
      {SUPPLIES.map((s) => {
        const cap = mods.storage[s.id] ?? 999;
        const have = state.stock[s.id];
        if (s.id === 'ice' && freeIce) {
          return (
            <div className="shop-item owned" key={s.id}>
              <span className="icon"><PixelIcon name={s.icon} size={24} /></span>
              <div className="body">
                <div className="name">{s.name}</div>
                <div className="tagline">Unlimited — the ice maker has you covered.</div>
              </div>
            </div>
          );
        }
        return (
          <div className="shop-item" key={s.id}>
            <span className="icon"><PixelIcon name={s.icon} size={24} /></span>
            <div className="body">
              <div className="name">
                {s.name} <span style={{ opacity: 0.6 }}>({have}/{cap})</span>
              </div>
              <div className="tagline">
                {s.meltsNightly
                  ? 'Melts overnight.'
                  : s.spoils
                    ? 'Spoils a little each night.'
                    : 'Keeps.'}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {s.tiers.map((t, i) => {
                  const overCap = have + t.qty > cap;
                  const cantAfford = state.cash < t.cost;
                  return (
                    <button
                      key={i}
                      className="pixel-btn"
                      style={{ fontSize: 11, padding: '4px 8px' }}
                      disabled={overCap || cantAfford}
                      title={overCap ? 'Not enough storage' : undefined}
                      onClick={() => {
                        state.cash -= t.cost;
                        state.stock[s.id] += t.qty;
                        commit();
                      }}
                    >
                      {t.qty} / {fmtMoney(t.cost)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
        Bulk is cheaper per unit — but strawberries spoil and ice melts overnight.
      </div>
    </div>
  );
}
