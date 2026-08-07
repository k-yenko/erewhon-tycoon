import { useState } from 'react';
import type { GameState } from '../game/types';
import { SUPPLIES } from '../game/content/supplies';
import { fmtMoney, C } from '../game/economy';
import { isMuted, toggleMute, unlock } from '../game/audio';
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
  batchCups,
}: {
  state: GameState;
  simMinute: number | null; // null when not mid-day
  liveRevenue: number;
  batchCups: number | null; // cups ready in the blender, shown during the day
}) {
  const [muted, setMuted] = useState(isMuted);
  return (
    <div className="topbar">
      {SUPPLIES.map((s) => (
        <div className="stock-item" key={s.id} title={s.name}>
          <PixelIcon name={s.icon} size={18} />
          <span>{state.stock[s.id]}</span>
          <span className="stock-label">{SHORT_NAMES[s.id]}</span>
        </div>
      ))}
      {batchCups !== null && (
        <div className="stock-item" title="Smoothies ready in the blender">
          <PixelIcon name="blender" size={18} />
          <span>{batchCups}</span>
          <span className="stock-label">ready</span>
        </div>
      )}
      <div className="spacer" />
      {simMinute !== null && (
        <div className="timeleft">Time left : {C.DAY_TICKS - simMinute} min.</div>
      )}
      <div className="cash">{fmtMoney(state.cash + liveRevenue)}</div>
      <button
        className="pixel-btn"
        style={{ padding: '2px 8px', fontSize: 12, boxShadow: 'none' }}
        title={muted ? 'Unmute' : 'Mute'}
        onClick={() => {
          unlock();
          setMuted(toggleMute());
        }}
      >
        {muted ? '♪ off' : '♪ on'}
      </button>
    </div>
  );
}
