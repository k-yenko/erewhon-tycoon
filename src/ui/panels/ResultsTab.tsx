import { useState } from 'react';
import type { DayResult, GameState } from '../../game/types';
import { LOCATION_BY_ID } from '../../game/content/locations';
import { calendar, fmtMoney } from '../../game/economy';
import { PixelIcon } from '../icons';

interface MonthAgg {
  label: string;
  revenue: number;
  stockUsed: number;
  stockLost: number;
  rents: number;
  marketing: number;
  wages: number;
  earnings: number;
}

function aggregate(results: DayResult[]): Map<string, MonthAgg> {
  const months = new Map<string, MonthAgg>();
  for (const r of results) {
    const c = calendar(r.day);
    const key = `Y${c.year}/M${c.month}`;
    const m = months.get(key) ?? {
      label: key,
      revenue: 0, stockUsed: 0, stockLost: 0, rents: 0, marketing: 0, wages: 0, earnings: 0,
    };
    m.revenue += r.revenue;
    m.stockUsed += r.stockUsedCost;
    m.stockLost += r.stockLostCost;
    m.rents += r.rent;
    m.marketing += r.marketing;
    m.wages += r.wages;
    m.earnings += r.earnings;
    months.set(key, m);
  }
  return months;
}

function Money({ n }: { n: number }) {
  return <>{n.toFixed(2)} $</>;
}

function Yesterday({ r }: { r: DayResult }) {
  const gross = r.revenue - r.stockUsedCost - r.stockLostCost;
  const margin = r.revenue > 0 ? (gross / r.revenue) * 100 : 0;
  const totalExpense = r.rent + r.marketing + r.wages;
  const verdict =
    r.earnings > 400
      ? 'The algorithm smiles upon you.'
      : r.earnings > 0
        ? 'Keep up the good work!'
        : 'A rough one. Adjust and rehydrate.';
  return (
    <div>
      <div className="info-row" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9 }}>
        <span>Day {r.day} — {LOCATION_BY_ID[r.locationId]?.name.split(' (')[0]}</span>
      </div>
      <div className="info-row"><span className="label">Revenue</span><span>{r.cupsSold} cups · <Money n={r.revenue} /></span></div>
      <div className="info-row"><span className="label">Stock used</span><span><Money n={r.stockUsedCost} /></span></div>
      <div className="info-row"><span className="label">Stock lost</span><span><Money n={r.stockLostCost} /></span></div>
      <div className="info-row"><span className="label">Gross profit</span><span><Money n={gross} /></span></div>
      <div className="info-row"><span className="label">Gross margin</span><span>{margin.toFixed(1)} %</span></div>
      <div className="info-row"><span className="label">Rent</span><span><Money n={r.rent} /></span></div>
      <div className="info-row"><span className="label">Marketing</span><span><Money n={r.marketing} /></span></div>
      <div className="info-row"><span className="label">Wages</span><span><Money n={r.wages} /></span></div>
      <div className="info-row"><span className="label">Total expense</span><span><Money n={totalExpense} /></span></div>
      <div className="info-row total"><span className="label">Earnings</span><span><Money n={r.earnings} /></span></div>
      <div style={{ fontSize: 12, marginTop: 8 }}>{verdict}</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>
        Customer satisfaction: {r.satisfactionPct ?? '—'}%
      </div>
      <div style={{ fontSize: 12 }}>You missed {r.walkedAway} sale(s).</div>
      {r.bestReview && (
        <div className="tagline" style={{ fontSize: 11, marginTop: 6 }}>★★★ "{r.bestReview.text}"</div>
      )}
      {r.worstReview && (
        <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>☆ "{r.worstReview.text}"</div>
      )}
    </div>
  );
}

function ProfitLoss({ state }: { state: GameState }) {
  const months = aggregate(state.results);
  const cal = calendar(state.day);
  const curKey = `Y${cal.year}/M${cal.month}`;
  const keys = [...months.keys()];
  const lastKey = keys[keys.indexOf(curKey) - 1];
  const best = [...months.values()].reduce<MonthAgg | null>(
    (b, m) => (b === null || m.earnings > b.earnings ? m : b),
    null,
  );
  const cols = [
    { title: 'Current', agg: months.get(curKey) },
    { title: lastKey ? `Last (${lastKey})` : 'Last', agg: lastKey ? months.get(lastKey) : undefined },
    { title: best ? `Best (${best.label})` : 'Best', agg: best ?? undefined },
  ];
  const row = (label: string, f: (m: MonthAgg) => string, cls = '') => (
    <tr className={cls}>
      <td>{label}</td>
      {cols.map((c, i) => (
        <td key={i}>{c.agg ? f(c.agg) : '—'}</td>
      ))}
    </tr>
  );
  return (
    <table className="pl-table">
      <thead>
        <tr>
          <th>Month</th>
          {cols.map((c, i) => (
            <th key={i}>{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {row('Revenue', (m) => fmtMoney(m.revenue))}
        {row('Stock used', (m) => fmtMoney(m.stockUsed))}
        {row('Stock lost', (m) => fmtMoney(m.stockLost), 'section')}
        {row('Gross profit', (m) => fmtMoney(m.revenue - m.stockUsed - m.stockLost))}
        {row(
          'Gross margin',
          (m) =>
            m.revenue > 0
              ? `${(((m.revenue - m.stockUsed - m.stockLost) / m.revenue) * 100).toFixed(1)} %`
              : '—',
          'section',
        )}
        {row('Rents', (m) => fmtMoney(m.rents))}
        {row('Marketing', (m) => fmtMoney(m.marketing))}
        {row('Wages', (m) => fmtMoney(m.wages))}
        {row('Total expense', (m) => fmtMoney(m.rents + m.marketing + m.wages), 'section')}
        {row('Earnings', (m) => fmtMoney(m.earnings), 'total')}
      </tbody>
    </table>
  );
}

export default function ResultsTab({ state }: { state: GameState }) {
  const [view, setView] = useState<'yesterday' | 'pl'>('yesterday');
  const last = state.results[state.results.length - 1];
  return (
    <div className="panel">
      <h2 className="panel-title">
        {view === 'yesterday' ? "Yesterday's Results" : 'Profit & Loss'}
      </h2>
      <div className="info-row">
        <span className="label">Lifetime revenue</span>
        <span>{fmtMoney(state.lifetimeRevenue)}</span>
      </div>
      <div className="subtabs">
        <button
          className={`subtab ${view === 'yesterday' ? 'active' : ''}`}
          onClick={() => setView('yesterday')}
          title="Yesterday's results"
        >
          <PixelIcon name="ledger" size={18} />
        </button>
        <button
          className={`subtab ${view === 'pl' ? 'active' : ''}`}
          onClick={() => setView('pl')}
          title="Profit & loss by month"
        >
          <PixelIcon name="tag" size={18} />
        </button>
      </div>
      <div className="subtab-body">
        {!last ? (
          <div className="tagline" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            No trading days yet. The ledger is as clean as your gut lining.
          </div>
        ) : view === 'yesterday' ? (
          <Yesterday r={last} />
        ) : (
          <ProfitLoss state={state} />
        )}
      </div>
    </div>
  );
}
