import type { GameState } from '../../game/types';
import { STAFF } from '../../game/content/staff';
import { fmtMoney } from '../../game/economy';
import { PixelIcon } from '../icons';

export default function StaffTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  return (
    <div className="panel">
      <h2 className="panel-title">Staff</h2>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Paid daily at close of business. They stay until you fire them.
      </div>
      {STAFF.map((s) => {
        const hired = state.staff.includes(s.id);
        return (
          <div className={`shop-item ${hired ? 'owned' : ''}`} key={s.id}>
            <span className="icon"><PixelIcon name={s.icon} size={24} /></span>
            <div className="body">
              <div className="name">{s.name}</div>
              <div className="tagline">{s.tagline}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="price">{fmtMoney(s.wage)}/day</div>
              <button
                className="pixel-btn"
                style={{ fontSize: 10, padding: '4px 8px', marginTop: 4 }}
                onClick={() => {
                  state.staff = hired
                    ? state.staff.filter((id) => id !== s.id)
                    : [...state.staff, s.id];
                  commit();
                }}
              >
                {hired ? 'Fire' : 'Hire'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
