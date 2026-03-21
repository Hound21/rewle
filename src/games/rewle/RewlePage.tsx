import { useCallback, useState } from "react";
import GameHeader from "@/games/rewle/components/GameHeader";
import GuessRows from "@/games/rewle/components/GuessRows";
import GuessInput from "@/games/rewle/components/GuessInput";
import StatsModal from "@/games/rewle/components/StatsModal";
import HelpModal from "@/games/rewle/components/HelpModal";
import ImpressumDialog from "@/games/rewle/components/ImpressumDialog";
import { t } from "@/games/rewle/logic/i18n";
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
} from "@/games/rewle/logic/gameLogic";
import { toast } from "sonner";
import Footer from "@/shared/components/Footer";
import { useProducts } from "@/shared/hooks/useProducts";

export default function RewlePage() {
  const products = useProducts();
  const product = getDailyProduct(products);

  const [state, setState] = useState<DailyState>(loadDailyState);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [productShakeTick, setProductShakeTick] = useState(0);

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
        <GameHeader
          onOpenHelp={() => setShowHelp(true)}
          onOpenStats={() => setShowStats(true)}
        />

        <main className="flex-1 flex flex-col px-4 py-4 gap-4">
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
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
            <h2 className="font-body font-bold text-lg text-center leading-tight">{product.name}</h2>
          </div>

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

      <Footer onOpenImpressum={() => setShowImpressum(true)} />

      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
      <ImpressumDialog open={showImpressum} onClose={() => setShowImpressum(false)} />
    </div>
  );
}
