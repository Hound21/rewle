import products from "@/data/dataset_rewe.json";

interface RawProduct {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  detail_link?: string;
  grammage?: string;
  is_promo?: boolean;
  currency?: string;
  category?: string[];
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  detailLink: string;
  grammage: string;
  isPromo: boolean;
  currency: string;
  category: string[];
}

export interface GuessResult {
  value: number;
  direction: "up" | "down" | "exact";
  color: "green" | "yellow" | "red";
}

export interface DailyState {
  date: string;
  guesses: GuessResult[];
  finished: boolean;
  won: boolean;
}

export interface Stats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
}

const MAX_GUESSES = 6;

export function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDailyProduct(): Product {
  const index = (getPuzzleNumber() - 1) % products.length;

  const raw = products[index] as RawProduct;

  return {
    id: raw.id ?? String(index),
    name: raw.name ?? "Unbekanntes Produkt",
    image: raw.image ?? "",
    price: typeof raw.price === "number" ? raw.price : 0,
    detailLink: raw.detail_link ?? "",
    grammage: raw.grammage ?? "",
    isPromo: raw.is_promo ?? false,
    currency: raw.currency ?? "€",
    category: Array.isArray(raw.category) ? raw.category : [],
  };
}

export function getPuzzleNumber(): number {
  const start = new Date("2026-03-17").getTime();
  const now = new Date(getTodayString()).getTime();
  return Math.floor((now - start) / 86400000) + 1;
}

export function evaluateGuess(guess: number, target: number): GuessResult {
  const error = Math.abs(guess - target) / target;
  let color: GuessResult["color"];
  if (error <= 0.03) color = "green";
  else if (error <= 0.20) color = "yellow";
  else color = "red";

  let direction: GuessResult["direction"];
  if (color === "green") direction = "exact";
  else if (guess < target) direction = "up";
  else direction = "down";

  return { value: guess, direction, color };
}

const STATE_KEY = "rewle-daily";
const STATS_KEY = "rewle-stats";

export function loadDailyState(): DailyState {
  const today = getTodayString();
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyState;
      if (parsed.date === today) return parsed;
    }
  } catch {}
  return { date: today, guesses: [], finished: false, won: false };
}

export function saveDailyState(state: DailyState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as Stats;
  } catch {}
  return { played: 0, wins: 0, currentStreak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0] };
}

export function saveStats(stats: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStats(won: boolean, guessCount: number): Stats {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.distribution[guessCount - 1]++;
  } else {
    stats.currentStreak = 0;
  }
  saveStats(stats);
  return stats;
}

export function generateShareText(state: DailyState): string {
  const puzzleNum = getPuzzleNumber();
  const attempts = state.won ? `${state.guesses.length}/6` : "X/6";
  const lines = state.guesses.map((g) => {
    const arrow = g.direction === "up" ? "⬆️" : g.direction === "down" ? "⬇️" : "✅";
    const colorSquare = g.color === "green" ? "🟩" : g.color === "yellow" ? "🟨" : "🟥";
    return g.direction === "exact" ? "✅" : `${arrow}${colorSquare}`;
  });
  return `Rewle #${puzzleNum} ${attempts}\n${lines.join("\n")}\nhttps://hound21.github.io/rewle/`;
}

export { MAX_GUESSES };
