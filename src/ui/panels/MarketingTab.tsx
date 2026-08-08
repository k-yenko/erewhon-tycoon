import type { GameState } from '../../game/types';
import { adBoost, fmtMoney } from '../../game/economy';
import { LOCATION_BY_ID } from '../../game/content/locations';
import { WEATHER_BY_ID } from '../../game/content/weather';
import { costPerCup } from './RecipeTab';
import Stepper from '../Stepper';

function adLabel(spend: number): string {
  if (spend === 0) return 'organic reach only';
  if (spend <= 15) return 'boosted story';
  if (spend <= 40) return 'micro-influencer seeding';
  if (spend <= 75) return 'TikTok campaign';
  return 'billboard on Sunset';
}

// Directional vibes only — the exact price band is yours to discover
// from the $-bubbles and reviews.
function priceHint(state: GameState): string {
  const loc = LOCATION_BY_ID[state.locationId];
  const weather = state.daily ? WEATHER_BY_ID[state.daily.weatherId] : undefined;
  const crowd =
    loc.wealth >= 26
      ? 'Money is not a concern around here.'
      : loc.wealth >= 21
        ? 'Solid disposable income in this crowd.'
        : 'Modest wallets around here — read the room.';
  if (!weather) return crowd;
  if (weather.payTolerance < 0.95)
    return `${weather.name} — people are feeling stingy today. ${crowd}`;
  if (weather.payTolerance > 1.05)
    return `${weather.name} — they'll pay up today. Don't be shy. ${crowd}`;
  return crowd;
}

export default function MarketingTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  const profit = state.price - costPerCup(state);
  return (
    <div className="panel">
      <h2 className="panel-title">Price</h2>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Read the room. Charge accordingly.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Stepper
          value={state.price}
          display={`${state.price.toFixed(2)} $`}
          onChange={(v) => {
            state.price = v;
            commit();
          }}
          step={0.5}
          min={5}
          max={40}
        />
        <div style={{ fontSize: 13 }}>
          <b>Profit: {profit.toFixed(2)} $ per smoothie.</b>
        </div>
      </div>
      <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', margin: '8px 0 14px' }}>
        {priceHint(state)}
      </div>

      <h2 className="panel-title">Advertising</h2>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        A few dollars into the algorithm. Charged daily.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Stepper
          value={state.adSpend}
          display={fmtMoney(state.adSpend)}
          onChange={(v) => {
            state.adSpend = v;
            commit();
          }}
          step={5}
          min={0}
          max={100}
        />
        <div style={{ fontSize: 12 }}>
          {adLabel(state.adSpend)} · +{Math.round((adBoost(state.adSpend) - 1) * 100)}% traffic
        </div>
      </div>
      <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 8 }}>
        Ads also push today's shelf item
        {state.daily?.shelfItem.category === 'merch' ? ' — and merch LIVES on the algorithm' : ''}.
      </div>
    </div>
  );
}
