import type { GameState } from '../game/types';
import { fmtMoney } from '../game/economy';

export default function GameOverScreen({
  state,
  onRestart,
}: {
  state: GameState;
  onRestart: () => void;
}) {
  return (
    <div className="fullscreen">
      <h1 className="wordmark" style={{ letterSpacing: 6 }}>PRICED OUT</h1>
      <div className="subtitle">OF LOS ANGELES</div>
      <p className="quote">
        Day {state.day}. Cash: {fmtMoney(state.cash)}. Lifetime revenue:{' '}
        {fmtMoney(state.lifetimeRevenue)}. The smoothie dream is over — the sublease on your
        driveway fell through and even the sea moss has gone home.
      </p>
      <button className="pixel-btn primary" onClick={onRestart}>
        Start Over
      </button>
    </div>
  );
}
