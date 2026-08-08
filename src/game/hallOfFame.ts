// The season ends on Day 60 (Feb 30). The Empire Score is what you built,
// not just what you banked — worth + reputation + devotion, arcade rules.
import type { GameState } from './types';
import { hasWon, liquidationValue } from './economy';
import { LOCATIONS } from './content/locations';

export const SEASON_DAYS = 60;
const BOARD_KEY = 'erewhon-tycoon:hall-of-fame';

export interface ScoreBreakdown {
  netWorth: number;
  reputation: number;
  devotion: number;
  flagshipBonus: number;
  total: number;
}

export interface HallEntry {
  initials: string;
  total: number;
  cash: number;
  lifetimeRevenue: number;
  when: string; // real date the run was scored
}

export function empireScore(state: GameState): ScoreBreakdown {
  const netWorth = Math.round(state.cash + liquidationValue(state));
  const avg = (pick: (l: { popularity: number; satisfaction: number }) => number) =>
    LOCATIONS.reduce((s, l) => s + pick(state.locations[l.id] ?? { popularity: 0, satisfaction: 0 }), 0) /
    LOCATIONS.length;
  const reputation = Math.round(avg((l) => l.popularity) * 3000);
  const devotion = Math.round(avg((l) => l.satisfaction) * 3000);
  const flagshipBonus = hasWon(state) ? 2500 : 0;
  return {
    netWorth,
    reputation,
    devotion,
    flagshipBonus,
    total: netWorth + reputation + devotion + flagshipBonus,
  };
}

export function loadBoard(): HallEntry[] {
  try {
    return JSON.parse(localStorage.getItem(BOARD_KEY) ?? '[]') as HallEntry[];
  } catch {
    return [];
  }
}

export function addRun(entry: HallEntry): HallEntry[] {
  const board = [...loadBoard(), entry].sort((a, b) => b.total - a.total).slice(0, 10);
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(board));
  } catch {
    /* storage full — the glory lives in your heart */
  }
  return board;
}

export function runCard(initials: string, s: ScoreBreakdown, state: GameState): string {
  return [
    `EREWHON TYCOON — SEASON REPORT (${initials})`,
    `EMPIRE SCORE: ${s.total.toLocaleString()}`,
    `net worth ${s.netWorth.toLocaleString()} · reputation ${s.reputation.toLocaleString()} · devotion ${s.devotion.toLocaleString()}${s.flagshipBonus ? ' · FLAGSHIP +2,500' : ''}`,
    `lifetime revenue $${Math.round(state.lifetimeRevenue).toLocaleString()} over 60 days${state.wonDay ? ` · flagship dream achieved day ${state.wonDay}` : ''}`,
  ].join('\n');
}
