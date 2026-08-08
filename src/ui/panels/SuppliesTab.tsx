import { useState } from 'react';
import type { GameState, StockId } from '../../game/types';
import { SUPPLIES, UNIT_VALUE, BUYBACK_RATE } from '../../game/content/supplies';
import { computeMods, fmtMoney, round2, stockCoverage } from '../../game/economy';
import { sfx, unlock } from '../../game/audio';
import { PixelIcon } from '../icons';
import Stepper from '../Stepper';

// Per-ingredient sub-tabs with an order basket: nothing is bought until BUY.
export default function SuppliesTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  const mods = computeMods(state);
  const supplies = SUPPLIES.filter((s) => !(s.id === 'ice' && mods.freeIce));
  const marketOn = !!state.settings?.market;
  const px = (id: StockId) =>
    (marketOn ? (state.daily?.marketPrices?.[id] ?? 1) : 1) * mods.supplyCostMult;
  const [activeId, setActiveId] = useState<StockId>(supplies[0].id);
  const [order, setOrder] = useState<Record<string, number>>({});
  const [sellQty, setSellQty] = useState(0);

  const active = supplies.find((s) => s.id === activeId) ?? supplies[0];
  const cap = mods.storage[active.id] ?? 999;

  const orderQty = (id: StockId) =>
    SUPPLIES.find((s) => s.id === id)!.tiers.reduce(
      (q, t, i) => q + t.qty * (order[`${id}_${i}`] ?? 0),
      0,
    );
  const totalCost = SUPPLIES.reduce(
    (sum, s) =>
      sum + s.tiers.reduce((c, t, i) => c + t.cost * px(s.id) * (order[`${s.id}_${i}`] ?? 0), 0),
    0,
  );
  const overCap = supplies.some(
    (s) => state.stock[s.id] + orderQty(s.id) > (mods.storage[s.id] ?? 999),
  );
  const cantAfford = totalCost > state.cash;
  const empty = totalCost === 0;

  const buy = () => {
    unlock();
    state.cash -= totalCost;
    for (const s of SUPPLIES) {
      s.tiers.forEach((t, i) => {
        state.stock[s.id] += t.qty * (order[`${s.id}_${i}`] ?? 0);
      });
    }
    setOrder({});
    sfx('sale');
    commit();
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Supplies</h2>
      <div style={{ fontSize: 12, marginBottom: 4 }}>
        Running out of stock in the middle of a promising day is a painful experience.
        Strawberries spoil, ice melts, and the customers do not forgive.
      </div>
      <div className="subtabs">
        {supplies.map((s) => (
          <button
            key={s.id}
            className={`subtab ${s.id === active.id ? 'active' : ''}`}
            onClick={() => setActiveId(s.id)}
            title={s.name}
          >
            <PixelIcon name={s.icon} size={22} />
            {orderQty(s.id) > 0 && (
              <span style={{ fontSize: 10, marginLeft: 3 }}>•</span>
            )}
          </button>
        ))}
      </div>
      <div className="subtab-body">
        <div className="info-row">
          <span className="label">{active.name}</span>
          <span>
            have {state.stock[active.id]} / cap {cap}
          </span>
        </div>
        <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', margin: '4px 0 2px' }}>
          {active.meltsNightly
            ? 'Melts overnight. Every night.'
            : active.spoils
              ? 'Spoils a little each night.'
              : 'Keeps forever.'}
        </div>
        {marketOn && (
        <div style={{ fontSize: 11, margin: '0 0 8px' }}>
          Market today:{' '}
          <b>
            {px(active.id) > 1.05 ? '▲' : px(active.id) < 0.95 ? '▼' : '•'}{' '}
            {Math.round((px(active.id) - 1) * 100)}%
          </b>{' '}
          vs. usual{px(active.id) < 0.9 ? ' — a good day to stock up' : px(active.id) > 1.3 ? ' — maybe wait it out' : ''}
        </div>
        )}
        {active.tiers.map((t, i) => {
          const key = `${active.id}_${i}`;
          return (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}
            >
              <div style={{ flex: 1, fontSize: 13 }}>
                {t.qty} units
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                  {fmtMoney(t.cost * px(active.id))}
                </div>
              </div>
              <Stepper
                value={order[key] ?? 0}
                onChange={(v) => setOrder({ ...order, [key]: v })}
                step={1}
                min={0}
                max={9}
              />
            </div>
          );
        })}
        {state.stock[active.id] > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 10,
              paddingTop: 8,
              borderTop: '1.5px solid rgba(26, 26, 24, 0.2)',
            }}
          >
            <div style={{ flex: 1, fontSize: 13 }}>
              Sell back
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                {fmtMoney(UNIT_VALUE[active.id] * BUYBACK_RATE)}/unit — cash-flow problems
                happen to the best of us
              </div>
            </div>
            <Stepper
              value={Math.min(sellQty, state.stock[active.id])}
              onChange={setSellQty}
              step={6}
              min={0}
              max={state.stock[active.id]}
            />
            <button
              className="pixel-btn"
              disabled={Math.min(sellQty, state.stock[active.id]) === 0}
              onClick={() => {
                unlock();
                const n = Math.min(sellQty, state.stock[active.id]);
                state.stock[active.id] -= n;
                state.cash += round2(n * UNIT_VALUE[active.id] * BUYBACK_RATE);
                setSellQty(0);
                sfx('sale');
                commit();
              }}
            >
              Sell
            </button>
          </div>
        )}
      </div>
      <div className="info-row" style={{ marginTop: 8 }}>
        <span className="label">Current stock covers</span>
        <span>~{stockCoverage(state, mods.freeIce)} smoothies</span>
      </div>
      <div className="info-row">
        <span className="label">Order total</span>
        <span>{fmtMoney(totalCost)}</span>
      </div>
      {overCap && (
        <div style={{ fontSize: 11, color: 'var(--alert)' }}>
          Not enough storage for that order. A bigger stand holds more.
        </div>
      )}
      {cantAfford && (
        <div style={{ fontSize: 11, color: 'var(--alert)' }}>You cannot afford this order.</div>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
        <button className="pixel-btn" disabled={empty} onClick={() => setOrder({})}>
          Cancel
        </button>
        <button
          className="pixel-btn primary"
          disabled={empty || overCap || cantAfford}
          onClick={buy}
        >
          Buy
        </button>
      </div>
    </div>
  );
}
