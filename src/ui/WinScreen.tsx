import type { GameState } from '../game/types';
import { fmtMoney } from '../game/economy';

export default function WinScreen({
  state,
  onContinue,
}: {
  state: GameState;
  onContinue: () => void;
}) {
  const totalCups = state.results.reduce((s, r) => s + r.cupsSold, 0);
  return (
    <div className="fullscreen">
      <h1 className="wordmark" style={{ letterSpacing: 6 }}>THE FLAGSHIP</h1>
      <div className="subtitle">D R E A M &nbsp; · &nbsp; A C H I E V E D</div>
      <p className="quote">
        Day {state.day}. Flagship cart. Reserve-tier revenue. You sold {totalCups} smoothies
        and grossed {fmtMoney(state.lifetimeRevenue)}. Paparazzi photograph strangers holding
        your cups. A celebrity wants a collab. You may now charge whatever you want — you
        already were.
      </p>
      <p className="quote" style={{ fontSize: 11 }}>
        The season runs to Day 60 — the Empire Score will remember this day.
      </p>
      <button className="pixel-btn primary" onClick={onContinue}>
        Keep Blending
      </button>
    </div>
  );
}
