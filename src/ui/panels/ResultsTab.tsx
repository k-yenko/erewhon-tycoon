import { useState } from 'react';
import type { DayResult, GameState } from '../../game/types';
import { LOCATION_BY_ID } from '../../game/content/locations';
import { C, calendar, fmtMoney } from '../../game/economy';
import { UPGRADES } from '../../game/content/upgrades';
import { UNIT_VALUE } from '../../game/content/supplies';
import { PixelIcon, PXFONT } from '../icons';

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
      <div className="info-row" style={{ fontFamily: PXFONT, fontSize: 9 }}>
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

// ——— Charts: the original tracked temperature/revenues/visitors/sales.
// Ours adds satisfaction, because reputation is the compounding asset here.
const CHART_W = 430;
const CHART_H = 180;

function Charts({ state }: { state: GameState }) {
  const days = state.results.slice(-28);
  if (days.length < 2) {
    return (
      <div className="tagline" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
        Charts need at least two trading days. Go sell something.
      </div>
    );
  }
  const xs = (i: number) => 8 + (i / (days.length - 1)) * (CHART_W - 16);
  const line = (vals: (number | undefined)[], lo: number, hi: number) =>
    vals
      .map((v, i) =>
        v === undefined
          ? null
          : `${xs(i).toFixed(1)},${(CHART_H - 10 - ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * (CHART_H - 24)).toFixed(1)}`,
      )
      .filter(Boolean)
      .join(' ');
  const maxMoney = Math.max(...days.map((d) => d.revenue), 1);
  const maxPeople = Math.max(...days.map((d) => d.customersTotal), 1);
  const series: { label: string; color: string; pts: string }[] = [
    { label: 'temperature', color: '#8fc94e', pts: line(days.map((d) => d.tempF), 40, 110) },
    { label: 'revenues', color: '#1a1a18', pts: line(days.map((d) => d.revenue), 0, maxMoney) },
    { label: 'visitors', color: '#f2c53d', pts: line(days.map((d) => d.customersTotal), 0, maxPeople) },
    { label: 'sales', color: '#e8724a', pts: line(days.map((d) => d.cupsSold), 0, maxPeople) },
    { label: 'satisfaction', color: '#e05a7a', pts: line(days.map((d) => d.satisfactionPct), 0, 100) },
  ];
  const weekEnd = days.length > 7 ? xs(6) : xs(days.length - 1);
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ fontSize: 11, lineHeight: 1.9, flexShrink: 0 }}>
        {series.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 16, height: 4, background: s.color, display: 'inline-block' }} />
            {s.label}
          </div>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H + 16}`}
        style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.35)', border: '2px solid var(--ink)' }}
      >
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" y1={CHART_H * t} x2={CHART_W} y2={CHART_H * t} stroke="#1a1a18" opacity="0.08" />
        ))}
        {series.map((s) => (
          <polyline key={s.label} points={s.pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />
        ))}
        <line x1={xs(0)} y1={CHART_H + 6} x2={weekEnd} y2={CHART_H + 6} stroke="#1a1a18" strokeWidth="1.5" />
        <line x1={xs(0)} y1={CHART_H + 2} x2={xs(0)} y2={CHART_H + 10} stroke="#1a1a18" strokeWidth="1.5" />
        <line x1={weekEnd} y1={CHART_H + 2} x2={weekEnd} y2={CHART_H + 10} stroke="#1a1a18" strokeWidth="1.5" />
        <text x={(xs(0) + weekEnd) / 2} y={CHART_H + 14} textAnchor="middle" fontSize="9" fill="#1a1a18">
          {days.length > 7 ? '1 week' : `${days.length} days`}
        </text>
      </svg>
    </div>
  );
}

// ——— Balance Sheet: cash + stock at standard cost + equipment at purchase
// price, balanced against starting capital and retained earnings.
function BalanceSheet({ state }: { state: GameState }) {
  const stockValue = (Object.keys(state.stock) as (keyof typeof state.stock)[]).reduce(
    (sum, id) => sum + state.stock[id] * (UNIT_VALUE[id] ?? 0),
    0,
  );
  const equipment = UPGRADES.filter((u) => state.upgrades.includes(u.id)).reduce(
    (sum, u) => sum + u.price,
    0,
  );
  const total = state.cash + stockValue + equipment;
  return (
    <div>
      <div className="info-row" style={{ fontFamily: PXFONT, fontSize: 9 }}>
        <span>Assets</span>
      </div>
      <div className="info-row"><span className="label">Cash</span><span><Money n={state.cash} /></span></div>
      <div className="info-row"><span className="label">Stock</span><span><Money n={stockValue} /></span></div>
      <div className="info-row"><span className="label">Equipment</span><span><Money n={equipment} /></span></div>
      <div className="info-row total"><span className="label">Total</span><span><Money n={total} /></span></div>
      <div className="info-row" style={{ fontFamily: PXFONT, fontSize: 9, marginTop: 12 }}>
        <span>Equity</span>
      </div>
      <div className="info-row"><span className="label">Share capital</span><span><Money n={C.START_CASH} /></span></div>
      <div className="info-row"><span className="label">Profit / Loss</span><span><Money n={total - C.START_CASH} /></span></div>
      <div className="info-row total"><span className="label">Total</span><span><Money n={total} /></span></div>
      <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 8 }}>
        {total - C.START_CASH >= 0
          ? 'The books balance. Your accountant (you) is thriving.'
          : 'Technically underwater, spiritually aligned.'}
      </div>
    </div>
  );
}

type BookView = 'yesterday' | 'charts' | 'pl' | 'balance';

const BOOK_TABS: { id: BookView; icon: 'calendar' | 'chart' | 'bookred' | 'bookgold'; title: string }[] = [
  { id: 'yesterday', icon: 'calendar', title: "Yesterday's Results" },
  { id: 'charts', icon: 'chart', title: 'Charts' },
  { id: 'pl', icon: 'bookred', title: 'Profit & Loss' },
  { id: 'balance', icon: 'bookgold', title: 'Balance Sheet' },
];

export default function ResultsTab({ state }: { state: GameState }) {
  const [view, setView] = useState<BookView>('yesterday');
  const last = state.results[state.results.length - 1];
  return (
    <div className="panel">
      <h2 className="panel-title">{BOOK_TABS.find((t) => t.id === view)!.title}</h2>
      <div className="info-row">
        <span className="label">Lifetime revenue</span>
        <span>{fmtMoney(state.lifetimeRevenue)}</span>
      </div>
      <div className="subtabs">
        {BOOK_TABS.map((t) => (
          <button
            key={t.id}
            className={`subtab ${view === t.id ? 'active' : ''}`}
            onClick={() => setView(t.id)}
            title={t.title}
          >
            <PixelIcon name={t.icon} size={18} />
          </button>
        ))}
      </div>
      <div className="subtab-body">
        {view === 'balance' ? (
          <BalanceSheet state={state} />
        ) : !last ? (
          <div className="tagline" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            No trading days yet. The ledger is as clean as your gut lining.
          </div>
        ) : view === 'yesterday' ? (
          <Yesterday r={last} />
        ) : view === 'charts' ? (
          <Charts state={state} />
        ) : (
          <ProfitLoss state={state} />
        )}
      </div>
    </div>
  );
}
