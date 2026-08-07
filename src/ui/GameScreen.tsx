import { useEffect, useRef, useState } from 'react';
import type { DayResult, GameState, SimState } from '../game/types';
import {
  createSim,
  createSimContext,
  overnight,
  settleDay,
  skipToEnd,
  stepSim,
  type SimContext,
} from '../game/simulation';
import { C, calendar, computeMods, fmtMoney } from '../game/economy';
import { weatherFor } from '../game/dailyContent';
import { EVENT_BY_ID } from '../game/content/events';
import { LOCATION_BY_ID } from '../game/content/locations';
import { DROP_BY_ID } from '../game/content/products';
import TopBar from './TopBar';
import TabBar, { type TabId } from './TabBar';
import DayView from './DayView';
import IsoScene, { Cart } from './scene/IsoScene';
import { LAYOUTS } from './scene/layouts';
import ResultsModal from './ResultsModal';
import Meter from './Meter';
import { PixelIcon } from './icons';
import ResultsTab from './panels/ResultsTab';
import RentTab from './panels/RentTab';
import UpgradesTab from './panels/UpgradesTab';
import StaffTab from './panels/StaffTab';
import MarketingTab from './panels/MarketingTab';
import RecipeTab from './panels/RecipeTab';
import SuppliesTab from './panels/SuppliesTab';

export default function GameScreen({
  state,
  commit,
  refreshDaily,
  onMainMenu,
  onGameOver,
  onWin,
}: {
  state: GameState;
  commit: () => void;
  refreshDaily: () => void;
  onMainMenu: () => void;
  onGameOver: () => void;
  onWin: () => void;
}) {
  const [tab, setTabRaw] = useState<TabId>('rent');
  const [previewLocId, setPreviewLocId] = useState<string | null>(null);
  const setTab = (t: TabId) => {
    setTabRaw(t);
    if (t !== 'rent') setPreviewLocId(null); // viewport follows the browser only on the rent tab
  };
  const [mode, setMode] = useState<'manage' | 'day'>('manage');
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [result, setResult] = useState<DayResult | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const ctxRef = useRef<SimContext | null>(null);
  const simRef = useRef<SimState | null>(null);
  const settledRef = useRef(false);
  const [, setTick] = useState(0);

  const daily = state.daily;
  const mods = computeMods(state);
  const loc = LOCATION_BY_ID[state.locationId];
  // While browsing the rent tab, the viewport previews the browsed location.
  const viewLoc =
    tab === 'rent' && mode === 'manage' && previewLocId
      ? (LOCATION_BY_ID[previewLocId] ?? loc)
      : loc;
  const viewLs = state.locations[viewLoc.id];
  const cal = calendar(state.day);
  const weather = daily ? weatherFor(daily) : null;
  const event = daily ? EVENT_BY_ID[daily.eventId] : null;
  const drop = daily ? DROP_BY_ID[daily.dropId] : null;

  const canStart =
    state.stock.cups > 0 &&
    state.stock.strawberries >= state.recipe.strawberries &&
    state.stock.coconutCream >= state.recipe.coconutCream &&
    state.stock.seaMoss >= state.recipe.seaMoss &&
    (mods.freeIce || state.stock.ice >= state.recipe.ice);

  const settle = () => {
    if (settledRef.current || !ctxRef.current || !simRef.current) return;
    settledRef.current = true;
    const r = settleDay(state, simRef.current);
    overnight(state); // fills stock-lost on r, advances the calendar
    commit();
    setResult(r);
  };

  const startDay = () => {
    if (!canStart) {
      setWarning('Not enough supplies for a single batch. Stock up in the supplies tab.');
      return;
    }
    setWarning(null);
    settledRef.current = false;
    ctxRef.current = createSimContext(state);
    simRef.current = createSim();
    setSpeed(1);
    setMode('day');
  };

  // Live sim loop
  useEffect(() => {
    if (mode !== 'day') return;
    const interval = setInterval(() => {
      const ctx = ctxRef.current;
      const sim = simRef.current;
      if (!ctx || !sim || sim.finished) return;
      stepSim(ctx, sim);
      setTick((t) => t + 1);
      if (sim.finished) settle();
    }, C.MS_PER_TICK / speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, speed]);

  const skip = () => {
    const ctx = ctxRef.current;
    const sim = simRef.current;
    if (!ctx || !sim) return;
    skipToEnd(ctx, sim);
    settle();
  };

  const nextMorning = () => {
    setResult(null);
    setMode('manage');
    refreshDaily();
    if (state.gameOver) onGameOver();
    else onWin();
  };

  const sim = simRef.current;
  const inDay = mode === 'day';

  return (
    <div className="game-root">
      <TopBar
        state={state}
        simMinute={inDay && sim ? sim.minute : null}
        liveRevenue={inDay && sim && !settledRef.current ? sim.revenue : 0}
      />

      <div className="game-columns">
        {/* ——— Left column ——— */}
        <div className="left-col">
          <TabBar active={tab} onSelect={setTab} disabled={inDay} />

          {!inDay && (
            <div>
              {tab === 'results' && <ResultsTab state={state} />}
              {tab === 'rent' && (
                <RentTab
                  state={state}
                  commit={commit}
                  onPreview={setPreviewLocId}
                  key={state.locationId}
                />
              )}
              {tab === 'upgrades' && <UpgradesTab state={state} commit={commit} />}
              {tab === 'staff' && <StaffTab state={state} commit={commit} />}
              {tab === 'marketing' && <MarketingTab state={state} commit={commit} />}
              {tab === 'recipe' && <RecipeTab state={state} commit={commit} />}
              {tab === 'supplies' && <SuppliesTab state={state} commit={commit} />}
            </div>
          )}

          <div className="panel">
            <h2 className="panel-title">Performance</h2>
            <div className="info-row">
              <span className="label">Smoothies sold</span>
              <span>{sim ? sim.cupsSold : 0}</span>
            </div>
            <div className="info-row">
              <span className="label">Revenue today</span>
              <span>{fmtMoney(sim ? sim.revenue : 0)}</span>
            </div>
            <div className="bubble-counters">
              <span>
                <PixelIcon name="smile" size={18} /> {sim ? sim.happy : 0}
                <em className="b-label">happy</em>
              </span>
              <span>
                <PixelIcon name="frown" size={18} /> {sim ? sim.complaints.taste : 0}
                <em className="b-label">bad taste</em>
              </span>
              <span>
                <PixelIcon name="tag" size={18} /> {sim ? sim.complaints.price : 0}
                <em className="b-label">too pricey</em>
              </span>
              <span>
                <PixelIcon name="hourglass" size={18} /> {sim ? sim.complaints.wait : 0}
                <em className="b-label">slow line</em>
              </span>
            </div>
          </div>

          {!inDay && (
            <div className="panel">
              <h2 className="panel-title">Today's Setting</h2>
              <div className="info-row">
                <span className="label">Location</span>
                <span>{loc.name.split(' (')[0]}</span>
              </div>
              <div className="info-row">
                <span className="label">Rent</span>
                <span>{loc.rent === 0 ? 'FREE' : fmtMoney(loc.rent)}</span>
              </div>
              <div className="info-row">
                <span className="label">Advertising</span>
                <span>{fmtMoney(state.adSpend)}</span>
              </div>
              <div className="info-row">
                <span className="label">Smoothie price</span>
                <span>{fmtMoney(state.price)}</span>
              </div>
              <div className="info-row">
                <span className="label">Recipe</span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <PixelIcon name="strawberry" size={14} />{state.recipe.strawberries}
                  <PixelIcon name="coconut" size={14} />{state.recipe.coconutCream}
                  <PixelIcon name="seamoss" size={14} />{state.recipe.seaMoss}
                  <PixelIcon name="ice" size={14} />{state.recipe.ice}
                </span>
              </div>
              {drop && (
                <div className="info-row">
                  <span className="label">Today's drop</span>
                  <span style={{ textAlign: 'right', fontSize: 12 }}>
                    {drop.by}'s {drop.name} — ${drop.price}
                  </span>
                </div>
              )}
            </div>
          )}

          {warning && (
            <div className="panel" style={{ borderColor: 'var(--alert)' }}>
              <div style={{ fontSize: 12 }}>{warning}</div>
            </div>
          )}
        </div>

        {/* ——— Right column ——— */}
        <div className="right-col">
          <div className="panel day-header">
            <div className="date-line">
              Year {cal.year} - Month {cal.month} - Day {cal.dayOfMonth}
            </div>
            {weather && (
              <div className="weather-line">
                <PixelIcon name={weather.icon} size={22} />
                <span>
                  {daily!.tempF}°F — {weather.name}
                </span>
              </div>
            )}
            {event && <div className="news">{event.headline}</div>}
            {daily && (
              <div className="ticker">
                NEW AT EREWHON TODAY: {daily.shelfItem.name} — ${daily.shelfItem.price}
                {daily.shelfItem.source === 'live' ? ' (live from the shelf)' : ''}
              </div>
            )}
          </div>

          {inDay && sim ? (
            <DayView state={state} sim={sim} speed={speed} onSpeed={setSpeed} onSkip={skip} />
          ) : (
            <div className="scene">
              <IsoScene loc={viewLoc} weatherId={daily?.weatherId}>
                <Cart
                  x={(LAYOUTS[viewLoc.id] ?? LAYOUTS.silverlake).cart[0]}
                  y={(LAYOUTS[viewLoc.id] ?? LAYOUTS.silverlake).cart[1]}
                />
              </IsoScene>
            </div>
          )}

          <div className="panel">
            <h2 className="panel-title" style={{ fontSize: 11 }}>
              {viewLoc.name}
              {viewLoc.id !== state.locationId && (
                <span style={{ fontSize: 9, color: 'var(--kraft-dark)' }}> · preview</span>
              )}
            </h2>
            <div className="tagline" style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>
              {viewLoc.blurb}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Meter value={viewLs.popularity} label="popularity" color="pink" />
              <Meter value={viewLs.satisfaction} label="satisfaction" color="blue" />
            </div>
          </div>

          {!inDay && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="pixel-btn" onClick={onMainMenu}>
                Main Menu
              </button>
              <button className="pixel-btn primary" onClick={startDay}>
                Start Day
              </button>
            </div>
          )}
        </div>
      </div>

      {result && <ResultsModal result={result} onContinue={nextMorning} />}
    </div>
  );
}
