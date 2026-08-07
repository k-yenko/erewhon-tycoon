import type { GameState } from '../game/types';
import { SUPPLIES } from '../game/content/supplies';
import { fmtMoney, C } from '../game/economy';
import { PixelIcon } from './icons';

const SHORT_NAMES: Record<string, string> = {
  strawberries: 'berries',
  coconutCream: 'coconut',
  seaMoss: 'sea moss',
  ice: 'ice',
  cups: 'cups',
};

export default function TopBar({
  state,
  simMinute,
  liveRevenue,
}: {
  state: GameState;
  simMinute: number | null; // null when not mid-day
  liveRevenue: number;
}) {
  return (
    <div className="topbar">
      {SUPPLIES.map((s) => (
        <div className="stock-item" key={s.id} title={s.name}>
          <PixelIcon name={s.icon} size={18} />
          <span>{state.stock[s.id]}</span>
          <span className="stock-label">{SHORT_NAMES[s.id]}</span>
        </div>
      ))}
      <div className="spacer" />
      {simMinute !== null && (
        <div className="timeleft">Time left : {C.DAY_TICKS - simMinute} min.</div>
      )}
      <div className="cash">{fmtMoney(state.cash + liveRevenue)}</div>
    </div>
  );
}
