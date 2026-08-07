import type { GameState } from '../../game/types';
import { idealIce } from '../../game/content/weather';
import { tasteQuality, C } from '../../game/economy';
import { PixelIcon, type IconName } from '../icons';

const SLIDERS: { id: 'strawberries' | 'coconutCream' | 'seaMoss' | 'ice'; label: string; icon: IconName; max: number }[] = [
  { id: 'strawberries', label: 'strawberries', icon: 'strawberry', max: 10 },
  { id: 'coconutCream', label: 'coconut cream', icon: 'coconut', max: 6 },
  { id: 'seaMoss', label: 'sea moss', icon: 'seamoss', max: 5 },
  { id: 'ice', label: 'ice', icon: 'ice', max: 6 },
];

export default function RecipeTab({
  state,
  commit,
}: {
  state: GameState;
  commit: () => void;
}) {
  const tempF = state.daily?.tempF ?? 75;
  const quality = tasteQuality(state.recipe, tempF);
  const ideal = idealIce(tempF);
  return (
    <div className="panel">
      <h2 className="panel-title">Recipe</h2>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Per blender batch ({C.CUPS_PER_BATCH} smoothies).
      </div>
      {SLIDERS.map((s) => (
        <div className="slider-row labeled" key={s.id}>
          <PixelIcon name={s.icon} size={22} />
          <span className="ing-label">{s.label}</span>
          <input
            type="range"
            min={0}
            max={s.max}
            value={state.recipe[s.id]}
            onChange={(e) => {
              state.recipe[s.id] = Number(e.target.value);
              commit();
            }}
          />
          <span className="val">{state.recipe[s.id]}</span>
        </div>
      ))}
      <div className="info-row">
        <span className="label">Projected taste</span>
        <span>
          {quality >= 0.85
            ? 'immaculate'
            : quality >= 0.6
              ? 'decent'
              : quality >= 0.35
                ? 'questionable'
                : 'a problem'}
        </span>
      </div>
      <div className="tagline" style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>
        It's {tempF}°F today — around {ideal} ice is right. One or two sea moss is plenty.
      </div>
    </div>
  );
}
