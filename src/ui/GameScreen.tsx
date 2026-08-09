import { useEffect, useRef, useState } from 'react';
import type { DayResult, GameState, SimState } from '../game/types';
import {
  activeEvent,
  createSim,
  createSimContext,
  overnight,
  settleDay,
  skipToEnd,
  stepSim,
  type SimContext,
} from '../game/simulation';
import { C, ERA_2_AT, ERA_3_AT, calendar, computeMods, era, fmtMoney, rentFor, rivalAt } from '../game/economy';
import { forecastRange } from '../game/simulation';
import { sfx, unlock } from '../game/audio';
import { weatherFor } from '../game/dailyContent';
import { LOCATION_BY_ID } from '../game/content/locations';
import { DROP_BY_ID } from '../game/content/products';
import TopBar from './TopBar';
import TabBar, { type TabId } from './TabBar';
import DayView from './DayView';
import IsoScene, { Cart, CartExtras } from './scene/IsoScene';
import { LAYOUTS } from './scene/layouts';
import ResultsModal from './ResultsModal';
import SeasonReport from './SeasonReport';
import { SEASON_DAYS } from '../game/hallOfFame';
import Meter from './Meter';
import { BubbleIcon, PixelIcon, PXFONT } from './icons';
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
  // null = the default Performance/Today's Setting view; a tab replaces it (like the original)
  const [tab, setTabRaw] = useState<TabId | null>(null);
  const [previewLocId, setPreviewLocId] = useState<string | null>(null);
  const setTab = (t: TabId) => {
    setTabRaw((cur) => (cur === t ? null : t)); // click again to close
    if (t !== 'rent') setPreviewLocId(null); // viewport follows the browser only on the rent tab
  };
  const [mode, setMode] = useState<'manage' | 'day'>('manage');
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [result, setResult] = useState<DayResult | null>(null);
  const [actBreak, setActBreak] = useState<2 | 3 | null>(null);
  const [showSeason, setShowSeason] = useState(false);
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
  const viewLayout = LAYOUTS[viewLoc.id] ?? LAYOUTS.silverlake;
  const cal = calendar(state.day);
  const weather = daily ? weatherFor(daily) : null;
  const todayNews = daily ? activeEvent(daily, state.locationId) : null;
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
    const eraBefore = era(state);
    const r = settleDay(state, simRef.current);
    overnight(state); // fills stock-lost on r, advances the calendar
    if (era(state) > eraBefore) setActBreak(era(state) as 2 | 3); // curtain up after the ledger
    commit();
    setResult(r);
    sfx('results');
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
    unlock();
    sfx('dayStart');
    if (daily?.viralShelf) sfx('viral');
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

  const proceedMorning = () => {
    if (state.day > SEASON_DAYS && !state.seasonScored) {
      setShowSeason(true);
      return; // the season report takes the stage before win/lose screens
    }
    if (state.gameOver) onGameOver();
    else onWin();
  };

  const nextMorning = () => {
    setResult(null);
    setMode('manage');
    refreshDaily();
    if (actBreak) return; // the act card takes the stage; its button continues
    proceedMorning();
  };

  const sim = simRef.current;
  const inDay = mode === 'day';

  return (
    <div className="game-root">
      <TopBar
        state={state}
        simMinute={inDay && sim ? sim.minute : null}
        liveRevenue={inDay && sim && !settledRef.current ? sim.revenue : 0}
        batchCups={inDay && sim ? sim.batchCupsLeft : null}
        stockUsed={inDay && sim && !settledRef.current ? sim.stockUsed : null}
      />

      <div className="game-columns">
        {/* ——— Left column ——— */}
        <div className="left-col">
          <TabBar active={tab} onSelect={setTab} disabled={inDay} />

          {/* one panel area: an open tab replaces the default view, like the original */}
          {!inDay && tab !== null ? (
            <div className="panel-area">
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
          ) : (
          <div className="panel-area">
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
            {sim && sim.reviews.length > 0 && (
              <div className="review-line">
                "{sim.reviews[sim.reviews.length - 1].text}"{' '}
                <span style={{ color: 'var(--kraft-dark)' }}>
                  {'★'.repeat(sim.reviews[sim.reviews.length - 1].stars) || '☆'}
                </span>
              </div>
            )}
            <div className="bubble-counters">
              <span>
                <BubbleIcon name="smile" size={22} /> {sim ? sim.happy : 0}
                <em className="b-label">happy</em>
              </span>
              <span>
                <BubbleIcon name="frown" size={22} /> {sim ? sim.complaints.taste : 0}
                <em className="b-label">bad taste</em>
              </span>
              <span>
                <BubbleIcon name="tag" size={22} /> {sim ? sim.complaints.price : 0}
                <em className="b-label">too pricey</em>
              </span>
              <span>
                <BubbleIcon name="hourglass" size={22} /> {sim ? sim.complaints.wait : 0}
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
              {daily && (
                <div className="info-row">
                  <span className="label">Forecast</span>
                  <span>
                    ~{forecastRange(state)[0]}–{forecastRange(state)[1]} customers
                    {rivalAt(state, state.locationId) ? ' (rival here)' : ''}
                  </span>
                </div>
              )}
              <div className="info-row">
                <span className="label">Rent</span>
                <span>
                  {loc.rent === 0 ? 'FREE' : fmtMoney(rentFor(state, loc.id))}
                  {rentFor(state, loc.id) > loc.rent ? ' ▲' : ''}
                </span>
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
            <div className="header-grid">
              <div>
                <div className="date-line">
                  {cal.monthName} {cal.dayOfMonth} · {cal.weekday.toUpperCase()} · Year {cal.year}
                </div>
                {(() => {
                  const e = era(state);
                  const next = e === 1 ? ERA_2_AT : e === 2 ? ERA_3_AT : null;
                  const name = e === 1 ? 'ACT I · THE HUSTLE' : e === 2 ? 'ACT II · THE LANDLORD ERA' : 'ACT III · THE JUICE WARS';
                  return (
                    <div style={{ fontFamily: PXFONT, fontSize: 7, color: 'var(--kraft-dark)', margin: '2px 0 4px' }}>
                      {name} ·{' '}
                      {next !== null
                        ? `${Math.round(state.lifetimeRevenue).toLocaleString()} / ${next.toLocaleString()} $`
                        : `${Math.round(state.lifetimeRevenue).toLocaleString()} $ lifetime`}
                    </div>
                  );
                })()}
                <div className="cw-label">Current Weather</div>
                {weather && (
                  <div className="weather-line">
                    <PixelIcon name={weather.icon} size={26} />
                    <span className="cw-temp">{daily!.tempF}°F</span>
                    <span style={{ fontSize: 12 }}>
                      {weather.name}
                      {daily!.liveWeather && (
                        <span style={{ fontSize: 10, color: 'var(--kraft-dark)' }}>
                          {' '}
                          (real LA rn)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              {todayNews && (
                <div className="news">
                  {todayNews.isLive && (
                    <span style={{ color: 'var(--alert)', fontWeight: 'bold' }}>REAL LA: </span>
                  )}
                  {todayNews.headline}
                </div>
              )}
            </div>
            {daily && (
              <div
                className="ticker"
                style={daily.viralShelf ? { color: 'var(--alert)' } : undefined}
              >
                {daily.viralShelf ? 'VIRAL RIGHT NOW: ' : 'NEW AT EREWHON TODAY: '}
                {daily.shelfItem.name} — ${daily.shelfItem.price}
                {daily.shelfItem.source === 'live' ? ' (live from the shelf)' : ''}
                {daily.viralShelf ? ' — everyone wants one' : ''}
              </div>
            )}
          </div>

          {inDay && sim ? (
            <DayView state={state} sim={sim} speed={speed} onSpeed={setSpeed} onSkip={skip} />
          ) : (
            <div className="scene">
              <IsoScene loc={viewLoc} weatherId={daily?.weatherId}>
                <Cart x={viewLayout.cart[0]} y={viewLayout.cart[1]} stage={mods.standTier} />
                <CartExtras x={viewLayout.cart[0]} y={viewLayout.cart[1]} upgrades={state.upgrades} />
                {rivalAt(state, viewLoc.id) && (
                  <Cart
                    x={viewLayout.cart[0] + 2.4}
                    y={viewLayout.cart[1]}
                    rival
                  />
                )}
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
              <Meter value={viewLoc.baseTraffic / 90} label="foot traffic" color="green" />
              <Meter value={(viewLoc.wealth - 14) / 16} label="spending power" color="gold" />
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
      {!result && actBreak && (
        <div className="modal-overlay">
          <div className="panel modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div style={{ fontFamily: PXFONT, fontSize: 22, margin: '10px 0 4px' }}>
              ACT {actBreak === 2 ? 'II' : 'III'}
            </div>
            <div style={{ fontFamily: PXFONT, fontSize: 11, color: 'var(--kraft-dark)', marginBottom: 12 }}>
              {actBreak === 2 ? 'THE LANDLORD ERA' : 'THE JUICE WARS'}
            </div>
            <div style={{ fontSize: 13, marginBottom: 14 }}>
              {actBreak === 2
                ? 'The city has noticed you. Rent follows fame now, neighborhoods get bored of you, and a teal truck just rolled into town. New equipment is waiting in the upgrades tab.'
                : 'Moon Juus knows your name and wants your corners. From here on, it parks where you park. Wartime equipment is unlocked in the upgrades tab.'}
            </div>
            <button
              className="pixel-btn primary"
              onClick={() => {
                setActBreak(null);
                proceedMorning();
              }}
            >
              Bring It On
            </button>
          </div>
        </div>
      )}
      {showSeason && (
        <SeasonReport
          state={state}
          onDone={() => {
            state.seasonScored = true;
            commit();
            setShowSeason(false);
            if (state.gameOver) onGameOver();
            else onWin();
          }}
        />
      )}
    </div>
  );
}
