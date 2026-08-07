import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { GameState } from './game/types';
import { loadGame, newGame, saveGame, clearSave } from './game/save';
import {
  generateDaily,
  fetchLiveShelfItem,
  fetchLiveLAEvent,
  fetchLiveLAWeather,
} from './game/dailyContent';
import { todayKey } from './game/rng';
import { C } from './game/economy';
import { sfx, unlock } from './game/audio';
import TitleScreen from './ui/TitleScreen';
import GameScreen from './ui/GameScreen';
import GameOverScreen from './ui/GameOverScreen';
import WinScreen from './ui/WinScreen';

type Screen = 'title' | 'game' | 'gameover' | 'win';

export default function App() {
  const gsRef = useRef<GameState>(loadGame() ?? newGame());
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [screen, setScreen] = useState<Screen>('title');
  const [hasSave] = useState(() => loadGame() !== null);

  const gs = gsRef.current;

  // Persist + re-render after any state mutation.
  const commit = useCallback(() => {
    saveGame(gsRef.current);
    force();
  }, []);

  // Ensure today's content exists (regenerated per in-game day and per real date).
  const refreshDaily = useCallback(() => {
    const g = gsRef.current;
    const key = todayKey();
    if (!g.daily || g.daily.dateKey !== key || g.daily.gameDay !== g.day || !g.daily.marketPrices) {
      const liveEvent = g.daily?.dateKey === key ? g.daily.liveEvent : undefined;
      g.daily = generateDaily(key, g.day, g.seedNonce);
      g.daily.liveEvent = liveEvent; // same real date keeps its real-LA headline
      commit();
    }
    // Try the real Erewhon new-arrivals feed (cached per date, silent fallback).
    fetchLiveShelfItem(key).then((item) => {
      const cur = gsRef.current.daily;
      if (item && cur && cur.dateKey === key && cur.shelfItem.source !== 'live') {
        cur.shelfItem = item;
        commit();
      }
    });
    // And the real-LA news bot (cached per date, silent fallback to the deck).
    fetchLiveLAEvent(key).then((event) => {
      const cur = gsRef.current.daily;
      if (event && cur && cur.dateKey === key && !cur.liveEvent) {
        cur.liveEvent = event;
        commit();
      }
    });
    // Real LA weather mirrors actual conditions — but only on the FIRST in-game
    // day of each real date; later days roll their own weather.
    fetchLiveLAWeather(key).then((weather) => {
      const cur = gsRef.current.daily;
      const appliedKey = 'erewhon-tycoon:la-weather-applied';
      const applied = localStorage.getItem(appliedKey);
      const mine = `${key}:${gsRef.current.day}`;
      const dateUsed = applied?.startsWith(`${key}:`) && applied !== mine;
      if (weather && cur && cur.dateKey === key && !cur.liveWeather && !dateUsed) {
        cur.weatherId = weather.weatherId;
        cur.tempF = weather.tempF;
        cur.liveWeather = true;
        localStorage.setItem(appliedKey, mine);
        commit();
      }
    });
  }, [commit]);

  useEffect(() => {
    refreshDaily();
  }, [refreshDaily]);

  // Any button press unlocks audio (starts the music loop) and ticks.
  useEffect(() => {
    const onPress = (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('button')) {
        unlock();
        sfx('click');
      }
    };
    document.addEventListener('pointerdown', onPress, true);
    return () => document.removeEventListener('pointerdown', onPress, true);
  }, []);

  const startNewGame = () => {
    const keepSettings = gsRef.current.settings;
    clearSave();
    gsRef.current = newGame();
    if (keepSettings) gsRef.current.settings = keepSettings;
    refreshDaily();
    setScreen('game');
  };

  const continueGame = () => {
    if (gsRef.current.gameOver) {
      setScreen('gameover');
    } else {
      refreshDaily();
      setScreen('game');
    }
  };

  if (screen === 'title') {
    return (
      <TitleScreen
        hasSave={hasSave}
        onNew={startNewGame}
        onContinue={continueGame}
        settings={gs.settings ?? { market: false, rival: false }}
        onToggle={(key) => {
          if (!gs.settings) gs.settings = { market: false, rival: false };
          gs.settings[key] = !gs.settings[key];
          commit();
        }}
      />
    );
  }
  if (screen === 'gameover') {
    return <GameOverScreen state={gs} onRestart={startNewGame} />;
  }
  if (screen === 'win') {
    return (
      <WinScreen
        state={gs}
        onContinue={() => {
          gs.wonShown = true;
          commit();
          setScreen('game');
        }}
      />
    );
  }
  return (
    <GameScreen
      state={gs}
      commit={commit}
      refreshDaily={refreshDaily}
      onMainMenu={() => setScreen('title')}
      onGameOver={() => setScreen('gameover')}
      onWin={() => {
        if (
          !gs.wonShown &&
          gs.lifetimeRevenue >= C.WIN_LIFETIME_REVENUE &&
          gs.upgrades.includes('stand3')
        )
          setScreen('win');
      }}
    />
  );
}
