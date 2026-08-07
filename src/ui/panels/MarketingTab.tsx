import type { GameState } from '../../game/types';
import { adBoost, fmtMoney } from '../../game/economy';
import { PixelIcon } from '../icons';

function adLabel(spend: number): string {
  if (spend === 0) return 'organic reach only';
  if (spend <= 15) return 'boosted story';
  if (spend <= 40) return 'micro-influencer seeding';
  if (spend <= 75) return 'TikTok campaign';
  return 'billboard on Sunset';
}

export default function MarketingTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  return (
    <div className="panel">
      <h2 className="panel-title">Marketing</h2>

      <div className="meter-label">smoothie price</div>
      <div className="slider-row">
        <PixelIcon name="tag" size={22} />
        <input
          type="range"
          min={5}
          max={40}
          step={0.5}
          value={state.price}
          onChange={(e) => {
            state.price = Number(e.target.value);
            commit();
          }}
        />
        <span className="val">${state.price.toFixed(2)}</span>
      </div>
      <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 14 }}>
        {state.price < 12
          ? 'Suspiciously affordable for this town.'
          : state.price <= 24
            ? 'Standard bougie. The sweet spot.'
            : 'Ambitious. Works on hot days in rich zip codes.'}
      </div>

      <div className="meter-label">daily ad spend (instagram / tiktok)</div>
      <div className="slider-row">
        <PixelIcon name="camera" size={22} />
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={state.adSpend}
          onChange={(e) => {
            state.adSpend = Number(e.target.value);
            commit();
          }}
        />
        <span className="val">{fmtMoney(state.adSpend)}</span>
      </div>
      <div className="info-row">
        <span className="label">{adLabel(state.adSpend)}</span>
        <span>+{Math.round((adBoost(state.adSpend) - 1) * 100)}% traffic</span>
      </div>
      <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>
        Charged each day you trade. The algorithm has no memory.
      </div>
    </div>
  );
}
