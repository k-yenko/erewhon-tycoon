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
        {fmtMoney(state.lifetimeRevenue)}. You sold the Vitamix. You sold the sea moss BACK.
        It wasn't enough. The smoothie dream is over — the sublease on your driveway fell
        through, and Moon Juus sent a fruit basket. Of your fruit.
      </p>
      <button className="pixel-btn primary" onClick={onRestart}>
        Start Over
      </button>
    </div>
  );
}
