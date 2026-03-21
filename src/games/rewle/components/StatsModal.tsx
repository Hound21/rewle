import { Stats } from "@/games/rewle/logic/gameLogic";
import { t } from "@/games/rewle/logic/i18n";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: Stats;
}

export default function StatsModal({ open, onClose, stats }: StatsModalProps) {
  if (!open) return null;
  const strings = t();
  const winPct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const maxDist = Math.max(...stats.distribution, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={onClose}>
      <div
        className="w-full max-w-sm mx-4 bg-card chunky-border chunky-shadow rounded-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-center mb-4">{strings.stats}</h2>

        <div className="grid grid-cols-4 gap-2 text-center mb-5">
          {[
            [stats.played, strings.played],
            [winPct, strings.winRate],
            [stats.currentStreak, strings.currentStreak],
            [stats.maxStreak, strings.maxStreak],
          ].map(([val, label], i) => (
            <div key={i}>
              <div className="font-display text-2xl">{val}</div>
              <div className="text-xs font-body text-muted-foreground">{label as string}</div>
            </div>
          ))}
        </div>

        <h3 className="font-body font-semibold text-sm mb-2">{strings.guessDistribution}</h3>
        <div className="space-y-1">
          {stats.distribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-body text-sm w-3 text-right">{i + 1}</span>
              <div
                className="h-6 chunky-border rounded-sm bg-rewe-blue flex items-center justify-end px-2 text-primary-foreground font-body text-xs font-bold"
                style={{ width: `${Math.max((count / maxDist) * 100, 8)}%` }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full h-10 chunky-border rounded-sm bg-muted font-display text-sm btn-press chunky-shadow-sm"
        >
          {strings.close}
        </button>
      </div>
    </div>
  );
}
