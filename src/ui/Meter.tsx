// Segmented pixel meter (popularity / satisfaction bars)
export default function Meter({
  value,
  label,
  color,
}: {
  value: number; // 0..1
  label?: string;
  color?: 'pink' | 'blue' | 'green';
}) {
  const SEGS = 10;
  const on = Math.round(Math.max(0, Math.min(1, value)) * SEGS);
  return (
    <div style={{ flex: 1 }}>
      {label && <div className="meter-label">{label}</div>}
      <div className={`meter ${color ?? ''}`}>
        {Array.from({ length: SEGS }, (_, i) => (
          <div key={i} className={`seg ${i < on ? 'on' : ''}`} />
        ))}
      </div>
    </div>
  );
}
