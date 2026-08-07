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
      <h1 className="wordmark" style={{ letterSpacing: 6 }}>YOU ARE</h1>
      <div className="subtitle">E R E W H O N &nbsp; N O W</div>
      <p className="quote">
        Flagship cart. Reserve-tier revenue. In {state.day} days you sold {totalCups} smoothies
        and grossed {fmtMoney(state.lifetimeRevenue)}. Paparazzi photograph strangers holding
        your cups. A celebrity wants a collab. You may now charge whatever you want — you
        already were.
      </p>
      <button className="pixel-btn primary" onClick={onContinue}>
        Keep Blending
      </button>
    </div>
  );
}
