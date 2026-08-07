import type { GameState } from '../../game/types';
import { LOCATION_BY_ID } from '../../game/content/locations';
import { fmtMoney } from '../../game/economy';

export default function ResultsTab({ state }: { state: GameState }) {
  const recent = [...state.results].slice(-10).reverse();
  const totalEarnings = state.results.reduce((s, r) => s + r.earnings, 0);
  return (
    <div className="panel">
      <h2 className="panel-title">Results</h2>
      <div className="info-row">
        <span className="label">Lifetime revenue</span>
        <span>{fmtMoney(state.lifetimeRevenue)}</span>
      </div>
      <div className="info-row">
        <span className="label">Lifetime earnings</span>
        <span>{fmtMoney(totalEarnings)}</span>
      </div>
      <div style={{ marginTop: 10 }}>
        {recent.length === 0 && (
          <div className="tagline" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            No trading days yet. The ledger is as clean as your gut lining.
          </div>
        )}
        {recent.map((r) => (
          <div className="info-row" key={r.day}>
            <span className="label">
              Day {r.day} — {LOCATION_BY_ID[r.locationId]?.name.split(' (')[0]}
            </span>
            <span>
              {r.cupsSold} sold · {fmtMoney(r.earnings)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
