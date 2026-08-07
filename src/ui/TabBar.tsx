import { PixelIcon, type IconName } from './icons';

export type TabId =
  | 'results'
  | 'rent'
  | 'upgrades'
  | 'staff'
  | 'marketing'
  | 'recipe'
  | 'supplies';

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'results', label: 'results', icon: 'ledger' },
  { id: 'rent', label: 'rent', icon: 'pin' },
  { id: 'upgrades', label: 'upgrades', icon: 'store' },
  { id: 'staff', label: 'staff', icon: 'person' },
  { id: 'marketing', label: 'marketing', icon: 'camera' },
  { id: 'recipe', label: 'recipe', icon: 'blender' },
  { id: 'supplies', label: 'supplies', icon: 'box' },
];

export default function TabBar({
  active,
  onSelect,
  disabled,
}: {
  active: TabId;
  onSelect: (t: TabId) => void;
  disabled: boolean;
}) {
  return (
    <div className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab-btn ${active === t.id ? 'active' : ''}`}
          onClick={() => onSelect(t.id)}
          disabled={disabled}
        >
          <PixelIcon name={t.icon} size={24} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
