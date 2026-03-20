import { useState, useCallback } from "react";
import Header from "@/components/GameHeader";
import GuessRows from "@/components/GuessRows";
import GuessInput from "@/components/GuessInput";
import StatsModal from "@/components/StatsModal";
import HelpModal from "@/components/HelpModal";
import ImpressumDialog from "@/components/ImpressumDialog";
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
  const [showImpressum, setShowImpressum] = useState(false);
  const [productShakeTick, setProductShakeTick] = useState(0);

  const product = getDailyProduct();
  const strings = t();

  const handleGuess = useCallback(
    (value: number) => {
      if (state.finished) return;
      const result = evaluateGuess(value, product.price);
      const newGuesses = [...state.guesses, result];
      const won = result.color === "green";
      const finished = won || newGuesses.length >= MAX_GUESSES;

      if (!won) {
        setProductShakeTick((tick) => tick + 1);
      }

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
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-game mx-auto flex flex-1 flex-col">
        <Header
          onOpenHelp={() => setShowHelp(true)}
          onOpenStats={() => setShowStats(true)}
        />

        <main className="flex-1 flex flex-col px-4 py-4 gap-4">
          {/* Product */}
          <div className="flex flex-col items-center gap-4">
            <div
              key={productShakeTick}
              className={`relative w-56 h-56 chunky-border chunky-shadow rounded-sm bg-card p-2 flex items-center justify-center ${
                productShakeTick > 0 ? "animate-product-shake" : ""
              }`}
            >
              {product.isPromo && (
                <span className="absolute -right-4 -bottom-2 z-10 chunky-border chunky-shadow rounded-full bg-rewe-red px-2 py-0.5 text-[12px] font-medium tracking-wide text-primary-foreground">
                  Angebotspreis
                </span>
              )}
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
                      ? "bg-feedback-green/20 text-rewe-blue animate-win-message"
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
                    <img src="/rewle/assets/share-icon.svg" className="w-5 h-5" alt="" />
                  </div>
                </button>
              )
            }
          />
        </main>
      </div>

      <footer className="w-full mt-auto border-t border-x-0 border-b-0 bg-muted px-2 py-1">
        <div className="flex w-full items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground leading-tight">
            Inoffizielles Fanprojekt - Keine Verbindung zu REWE
          </p>
          <button
            onClick={() => setShowImpressum(true)}
            className="shrink-0 rounded-sm chunky-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground btn-press"
          >
            Impressum
          </button>
        </div>
      </footer>

      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
      <ImpressumDialog open={showImpressum} onClose={() => setShowImpressum(false)} />
    </div>
  );
}
