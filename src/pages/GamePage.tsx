import { useState, useCallback } from "react";
import Header from "@/components/GameHeader";
import GuessRows from "@/components/GuessRows";
import GuessInput from "@/components/GuessInput";
import StatsModal from "@/components/StatsModal";
import HelpModal from "@/components/HelpModal";
import { t } from "@/lib/i18n";
import {
  getDailyProduct,
  evaluateGuess,
  loadDailyState,
  saveDailyState,
  loadStats,
  updateStats,
  generateShareText,
  MAX_GUESSES,
  DailyState,
  Stats,
} from "@/lib/gameLogic";
import { toast } from "sonner";

export default function GamePage() {
  const [state, setState] = useState<DailyState>(loadDailyState);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const product = getDailyProduct();
  const strings = t();

  const handleGuess = useCallback(
    (value: number) => {
      if (state.finished) return;
      const result = evaluateGuess(value, product.price);
      const newGuesses = [...state.guesses, result];
      const won = result.color === "green";
      const finished = won || newGuesses.length >= MAX_GUESSES;

      const newState: DailyState = { ...state, guesses: newGuesses, finished, won };
      setState(newState);
      saveDailyState(newState);

      if (finished) {
        const newStats = updateStats(won, newGuesses.length);
        setStats(newStats);
      }
    },
    [state, product.price]
  );

  const handleShare = useCallback(() => {
    const text = generateShareText(state);
    navigator.clipboard.writeText(text).then(() => {
      toast(strings.copied, { duration: 2000 });
    });
  }, [state, strings]);

  const productName = product.name;

  // Status message
  let statusMessage = "";
  if (state.finished) {
    const priceStr = `${strings.currency}${product.price.toFixed(2)}`;
    statusMessage = state.won ? strings.win(priceStr) : strings.loss(priceStr);
  } else {
    statusMessage = strings.guessesLeft(MAX_GUESSES - state.guesses.length);
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-game flex flex-col min-h-screen">
        <Header
          onOpenHelp={() => setShowHelp(true)}
          onOpenStats={() => setShowStats(true)}
        />

        <main className="flex-1 flex flex-col px-4 py-4 gap-4">
          {/* Product */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-56 h-56 chunky-border chunky-shadow rounded-sm bg-card p-2 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={productName}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
            <h2 className="font-body font-bold text-lg text-center leading-tight">{productName}</h2>
          </div>

          {/* Status */}
          <p
            className={
              state.finished
                ? `font-display font-semibold text-base md:text-base text-center whitespace-pre-line leading-tight px-3 py-2 rounded-sm chunky-border chunky-shadow-sm ${
                    state.won
                      ? "bg-feedback-green/20 text-rewe-blue"
                      : "bg-feedback-red/20 text-rewe-red"
                  }`
                : "font-body text-sm text-center whitespace-pre-line text-muted-foreground"
            }
          >
            {statusMessage}
          </p>

          {/* Guess rows */}
          <GuessRows 
            guesses={state.guesses} 
            inputRow={
              !state.finished ? (
                <GuessInput onSubmit={handleGuess} disabled={state.finished} />
              ) : (
                <button
                  onClick={handleShare}
                  className="w-full h-12 chunky-border rounded-sm bg-rewe-red text-primary-foreground font-display text-base chunky-shadow btn-press"
                >
                  <div className="flex items-center justify-center gap-2">
                    {strings.share}
                    <img src="./assets/share-icon.svg"className="w-5 h-5" alt="" />
                  </div>
                </button>
              )
            }
          />
        </main>
      </div>

      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
