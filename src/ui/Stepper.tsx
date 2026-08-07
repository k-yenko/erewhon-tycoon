// Chunky arrow stepper, like the original's − [value] + controls.
export default function Stepper({
  value,
  display,
  onChange,
  step,
  min,
  max,
}: {
  value: number;
  display?: string;
  onChange: (v: number) => void;
  step: number;
  min: number;
  max: number;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100));
  return (
    <div className="stepper">
      <button
        className="step-arrow left"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - step))}
        aria-label="decrease"
      >
        −
      </button>
      <div className="step-value">{display ?? value}</div>
      <button
        className="step-arrow right"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + step))}
        aria-label="increase"
      >
        +
      </button>
    </div>
  );
}
