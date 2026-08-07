import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { GameState } from './game/types';
import { loadGame, newGame, saveGame, clearSave } from './game/save';
import { generateDaily, fetchLiveShelfItem } from './game/dailyContent';
import { todayKey } from './game/rng';
import { C } from './game/economy';
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
    if (!g.daily || g.daily.dateKey !== key || g.daily.gameDay !== g.day) {
      g.daily = generateDaily(key, g.day);
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
  }, [commit]);

  useEffect(() => {
    refreshDaily();
  }, [refreshDaily]);

  const startNewGame = () => {
    clearSave();
    gsRef.current = newGame();
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
    return <TitleScreen hasSave={hasSave} onNew={startNewGame} onContinue={continueGame} />;
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
