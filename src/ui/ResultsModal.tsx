import type { DayResult } from '../game/types';
import { LOCATION_BY_ID } from '../game/content/locations';
import { fmtMoney } from '../game/economy';
import { BubbleIcon } from './icons';

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
        {result.shelfSold > 0 && (
          <div className="info-row">
            <span className="label" style={{ fontSize: 11 }}>
              incl. shelf: {result.shelfSold} × {result.shelfItemName}
            </span>
            <span style={{ fontSize: 11 }}>+{fmtMoney(result.shelfRevenue)}</span>
          </div>
        )}
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
            <BubbleIcon name="smile" size={22} /> {result.happy}
            <em className="b-label">happy</em>
          </span>
          <span>
            <BubbleIcon name="frown" size={22} /> {result.complaints.taste}
            <em className="b-label">bad taste</em>
          </span>
          <span>
            <BubbleIcon name="tag" size={22} /> {result.complaints.price}
            <em className="b-label">too pricey</em>
          </span>
          <span>
            <BubbleIcon name="hourglass" size={22} /> {result.complaints.wait}
            <em className="b-label">slow line</em>
          </span>
        </div>
        {result.bestReview && (
          <div className="tagline" style={{ fontSize: 12, marginTop: 6 }}>
            ★★★ "{result.bestReview.text}"
          </div>
        )}
        {result.worstReview && (
          <div className="tagline" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            ☆ "{result.worstReview.text}"
          </div>
        )}
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
