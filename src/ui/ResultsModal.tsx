import type { DayResult } from '../game/types';
import { LOCATION_BY_ID } from '../game/content/locations';
import { fmtMoney } from '../game/economy';
import { PixelIcon } from './icons';

export default function ResultsModal({
  result,
  onContinue,
}: {
  result: DayResult;
  onContinue: () => void;
}) {
  const gross = result.revenue - result.stockUsedCost - result.stockLostCost;
  return (
    <div className="modal-overlay">
      <div className="panel modal">
        <h2 className="panel-title">
          Day {result.day} — {LOCATION_BY_ID[result.locationId]?.name}
        </h2>
        <div className="info-row">
          <span className="label">Smoothies sold</span>
          <span>{result.cupsSold}</span>
        </div>
        <div className="info-row">
          <span className="label">Revenue</span>
          <span>{fmtMoney(result.revenue)}</span>
        </div>
        <div className="info-row">
          <span className="label">Stock used</span>
          <span>-{fmtMoney(result.stockUsedCost)}</span>
        </div>
        <div className="info-row">
          <span className="label">Stock lost (melted/spoiled)</span>
          <span>-{fmtMoney(result.stockLostCost)}</span>
        </div>
        <div className="info-row">
          <span className="label">Gross profit</span>
          <span>{fmtMoney(gross)}</span>
        </div>
        <div className="info-row">
          <span className="label">Rent</span>
          <span>-{fmtMoney(result.rent)}</span>
        </div>
        <div className="info-row">
          <span className="label">Marketing</span>
          <span>-{fmtMoney(result.marketing)}</span>
        </div>
        <div className="info-row">
          <span className="label">Wages</span>
          <span>-{fmtMoney(result.wages)}</span>
        </div>
        <div className="info-row total">
          <span className="label">Earnings</span>
          <span>{fmtMoney(result.earnings)}</span>
        </div>
        <div className="bubble-counters">
          <span>
            <PixelIcon name="smile" size={18} /> {result.happy}
            <em className="b-label">happy</em>
          </span>
          <span>
            <PixelIcon name="frown" size={18} /> {result.complaints.taste}
            <em className="b-label">bad taste</em>
          </span>
          <span>
            <PixelIcon name="tag" size={18} /> {result.complaints.price}
            <em className="b-label">too pricey</em>
          </span>
          <span>
            <PixelIcon name="hourglass" size={18} /> {result.complaints.wait}
            <em className="b-label">slow line</em>
          </span>
        </div>
        {result.tips.map((t, i) => (
          <div key={i} className="tagline" style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
            » {t}
          </div>
        ))}
        <div style={{ marginTop: 14, textAlign: 'right' }}>
          <button className="pixel-btn primary" onClick={onContinue}>
            Next Morning
          </button>
        </div>
      </div>
    </div>
  );
}
