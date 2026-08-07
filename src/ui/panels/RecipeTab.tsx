import type { GameState } from '../../game/types';
import { idealIce } from '../../game/content/weather';
import { LOCATION_BY_ID } from '../../game/content/locations';
import { UNIT_VALUE } from '../../game/content/supplies';
import { tasteQuality, C } from '../../game/economy';
import { PixelIcon, type IconName } from '../icons';
import Stepper from '../Stepper';

// Cost per smoothie from the recipe (like the reference repo's costPerCup).
export function costPerCup(state: GameState): number {
  const r = state.recipe;
  const batch =
    r.strawberries * UNIT_VALUE.strawberries +
    r.coconutCream * UNIT_VALUE.coconutCream +
    r.seaMoss * UNIT_VALUE.seaMoss +
    r.ice * UNIT_VALUE.ice;
  return batch / C.CUPS_PER_BATCH + UNIT_VALUE.cups;
}

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
  const loc = LOCATION_BY_ID[state.locationId];
  const quality = tasteQuality(state.recipe, tempF, loc);
  const b = loc.tasteBias ?? {};
  const localNote =
    (b.ice ?? 0) > 0
      ? ' Out here they like it icier.'
      : (b.ice ?? 0) < 0
        ? ' Desk drinkers — go easy on the ice.'
        : (b.seaMoss ?? 0) > 0
          ? ' This is a sea moss neighborhood.'
          : (b.coconutCream ?? 0) > 0
            ? ' They like it rich here — more coconut cream.'
            : '';
  const ideal = idealIce(tempF);
  return (
    <div className="panel">
      <h2 className="panel-title">Recipe</h2>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Per blender batch ({C.CUPS_PER_BATCH} smoothies).
      </div>
      {SLIDERS.map((s) => (
        <div
          key={s.id}
          style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}
        >
          <PixelIcon name={s.icon} size={22} />
          <span className="ing-label" style={{ width: 110, fontSize: 11 }}>{s.label}</span>
          <Stepper
            value={state.recipe[s.id]}
            onChange={(v) => {
              state.recipe[s.id] = v;
              commit();
            }}
            step={1}
            min={0}
            max={s.max}
          />
        </div>
      ))}
      <div className="info-row">
        <span className="label">Cost per smoothie</span>
        <span>${costPerCup(state).toFixed(2)}</span>
      </div>
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
        It's {tempF}°F today — around {ideal + (b.ice ?? 0)} ice is right here.{localNote}
      </div>
    </div>
  );
}
