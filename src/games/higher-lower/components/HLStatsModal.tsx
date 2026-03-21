import { getDistributionBuckets, HLStats } from "@/games/higher-lower/logic/higherLowerLogic";

interface HLStatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: HLStats;
}

export default function HLStatsModal({ open, onClose, stats }: HLStatsModalProps) {
  if (!open) return null;

  const buckets = getDistributionBuckets(stats.streakDistribution, Math.max(stats.bestStreak, 1));
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);
  const weightedTotal = Object.entries(stats.streakDistribution).reduce(
    (sum, [streak, count]) => sum + Number(streak) * count,
    0
  );
  const avgStreak = stats.totalGames > 0 ? (weightedTotal / stats.totalGames).toFixed(1) : "0.0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 bg-card chunky-border chunky-shadow rounded-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-center mb-4">Statistik</h2>

        <div className="grid grid-cols-3 gap-2 text-center mb-6">
          <div>
            <div className="font-display text-xl">{stats.totalGames}</div>
            <div className="text-xs text-muted-foreground">Gespielt</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-xl">{stats.bestStreak}</div>
            <div className="text-xs font-extrabold text-foreground">Highscore</div>
          </div>
          <div>
            <div className="font-display text-xl">{avgStreak}</div>
            <div className="text-xs text-muted-foreground">Avg.Streak</div>
          </div>
        </div>

        <h3 className="font-body font-semibold text-sm mb-2">Verteilung</h3>
        <div className="mb-5">
          <div className="space-y-1 max-h-70 overflow-y-auto pr-1">
            {buckets.map((bucket) => {
              const isBest =
                bucket.label === String(stats.bestStreak) || (bucket.label === "19+" && stats.bestStreak > 20);

              return (
                <div key={bucket.label} className="flex items-center gap-2">
                  <span className="font-body text-sm w-8 text-right shrink-0">{bucket.label}</span>
                  <div
                    className={`h-6 chunky-border rounded-sm flex items-center justify-end px-2 text-primary-foreground font-body text-xs font-bold ${
                      isBest ? "bg-rewe-red" : "bg-rewe-blue"
                    }`}
                    style={{ width: `${Math.max((bucket.count / maxCount) * 100, 8)}%` }}
                    title={`${bucket.label}: ${bucket.count}`}
                  >
                    {bucket.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-1 w-full h-10 chunky-border rounded-sm bg-muted font-display text-sm btn-press chunky-shadow-sm"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
