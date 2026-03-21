interface GameOverModalProps {
  open: boolean;
  score: number;
  bestScore: number;
  onPlayAgain: () => void;
}

export default function GameOverModal({ open, score, bestScore, onPlayAgain }: GameOverModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center">
      <div className="w-full max-w-sm mx-4 bg-card chunky-border chunky-shadow p-5">
        <h2 className="font-display text-2xl text-center mb-5">Verloren!</h2>

        <div className="space-y-2 mb-6 text-center font-body text-lg">
          <p>
            Score: <strong>{score}</strong>
          </p>
          <p>
            Highscore: <strong>{bestScore}</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onPlayAgain}
            className="h-11 chunky-border chunky-shadow-sm rounded-sm bg-rewe-blue text-primary-foreground font-display btn-press"
          >
            Nochmal
          </button>
          <button
            onClick={() => {
              window.location.href = "/rewle/";
            }}
            className="h-11 chunky-border chunky-shadow-sm rounded-sm bg-muted font-display btn-press flex items-center justify-center gap-1"
          >
            <p>zu</p>
            <span className="font-lilita text-lg leading-none">
              <span className="text-rewe-red">REW</span>
              <span className="text-rewe-blue">LE</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
