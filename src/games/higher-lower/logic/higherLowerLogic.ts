export interface HLProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  promo: boolean;
}

export interface HLStats {
  bestStreak: number;
  totalGames: number;
  streakDistribution: Record<number, number>;
}

const HL_STATS_KEY = "hl_stats";

export function defaultHLStats(): HLStats {
  return { bestStreak: 0, totalGames: 0, streakDistribution: {} };
}

export function pickRandom(products: HLProduct[]): HLProduct {
  const index = Math.floor(Math.random() * products.length);
  return products[index];
}

export function evaluateGuess(chosen: HLProduct, other: HLProduct): "correct" | "wrong" {
  return chosen.price >= other.price ? "correct" : "wrong";
}

export function loadHLStats(): HLStats {
  try {
    const raw = localStorage.getItem(HL_STATS_KEY);
    if (raw) return JSON.parse(raw) as HLStats;
  } catch {}
  return defaultHLStats();
}

export function saveHLStats(stats: HLStats): void {
  localStorage.setItem(HL_STATS_KEY, JSON.stringify(stats));
}

export function updateHLStats(stats: HLStats, streak: number): HLStats {
  const streakCount = stats.streakDistribution[streak] ?? 0;
  const next = {
    ...stats,
    bestStreak: Math.max(stats.bestStreak, streak),
    totalGames: stats.totalGames + 1,
    streakDistribution: {
      ...stats.streakDistribution,
      [streak]: streakCount + 1,
    },
  };
  saveHLStats(next);
  return next;
}

export function getDistributionBuckets(
  distribution: Record<number, number>,
  bestStreak: number
): { label: string; count: number }[] {
  if (bestStreak <= 20) {
    return Array.from({ length: bestStreak + 1 }, (_, value) => ({
      label: String(value),
      count: distribution[value] ?? 0,
    }));
  }

  const buckets = Array.from({ length: 19 }, (_, value) => ({
    label: String(value),
    count: distribution[value] ?? 0,
  }));

  let overflow = 0;
  for (let streak = 19; streak <= bestStreak; streak++) {
    overflow += distribution[streak] ?? 0;
  }

  buckets.push({ label: "19+", count: overflow });
  return buckets;
}
