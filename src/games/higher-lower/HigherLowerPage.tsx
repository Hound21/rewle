import { useEffect, useMemo, useState } from "react";
import NavButton from "@/shared/components/NavButton";
import ProductCard from "@/games/higher-lower/components/ProductCard";
import VsCircle from "@/games/higher-lower/components/VsCircle";
import HLHelpModal from "@/games/higher-lower/components/HLHelpModal";
import HLStatsModal from "@/games/higher-lower/components/HLStatsModal";
import GameOverModal from "@/games/higher-lower/components/GameOverModal";
import {
  evaluateGuess,
  HLProduct,
  HLStats,
  loadHLStats,
  pickRandom,
  updateHLStats,
} from "@/games/higher-lower/logic/higherLowerLogic";
import { useProducts } from "@/shared/hooks/useProducts";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

interface HLGameState {
  leftProduct: HLProduct;
  rightProduct: HLProduct;
  nextProduct: HLProduct;
  currentStreak: number;
  isFirstRound: boolean;
  phase: "revealing" | "animating" | "gameover";
  leftPriceVisible: boolean;
  rightPriceVisible: boolean;
}

interface PendingAnimation {
  incoming: HLProduct;
  replacementNext: HLProduct;
}

function preloadImage(src: string) {
  const image = new Image();
  image.src = src;
}

const FIRST_REVEAL_START_MS = 500;
const SECOND_REVEAL_DELAY_MS = 1000;
const INDICATOR_VISIBLE_MS = 1000;
const HIDE_TO_SLIDE_DELAY_MS = 500;
const VS_REAPPEAR_DELAY_MS = 20;
const SLIDE_DURATION_MS = 1500;
const VS_TO_RESULT_DELAY_MS = 260;

export default function HigherLowerPage() {
  const allProducts = useProducts();
  const products = useMemo<HLProduct[]>(
    () =>
      allProducts.map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        promo: product.isPromo,
      })),
    [allProducts]
  );

  const buildInitialState = (): HLGameState => {
    const leftProduct = pickRandom(products);
    const rightProduct = pickRandom(products);
    const nextProduct = pickRandom(products);
    preloadImage(nextProduct.image);

    return {
      leftProduct,
      rightProduct,
      nextProduct,
      currentStreak: 0,
      isFirstRound: true,
      phase: "revealing",
      leftPriceVisible: false,
      rightPriceVisible: false,
    };
  };

  const [game, setGame] = useState<HLGameState>(() => buildInitialState());
  const [stats, setStats] = useLocalStorage<HLStats>("hl_stats", loadHLStats());
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [locked, setLocked] = useState(false);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const [pendingAnimation, setPendingAnimation] = useState<PendingAnimation | null>(null);
  const [centerIndicator, setCenterIndicator] = useState<"vs" | "correct" | "wrong" | "hidden">("vs");
  const [flipVsOnShow, setFlipVsOnShow] = useState(false);
  const [clickedSide, setClickedSide] = useState<"left" | "right" | null>(null);
  const [clickedBorderState, setClickedBorderState] = useState<"none" | "selected" | "correct" | "wrong">("none");

  useEffect(() => {
    preloadImage(game.nextProduct.image);
  }, [game.nextProduct.image]);

  if (products.length === 0) return null;

  const chooseSide = (side: "left" | "right") => {
    if (locked || game.phase === "gameover") return;

    const snapshot = game;
    const chosenIsLeft = side === "left";
    const firstRevealLeft = snapshot.isFirstRound ? true : chosenIsLeft;
    const chosenNow = chosenIsLeft ? snapshot.leftProduct : snapshot.rightProduct;
    const otherNow = chosenIsLeft ? snapshot.rightProduct : snapshot.leftProduct;
    const immediateResult = evaluateGuess(chosenNow, otherNow);

    setLocked(true);
    setFlipVsOnShow(false);
    setClickedSide(side);
    setClickedBorderState("selected");
    window.setTimeout(() => {
      setClickedBorderState(immediateResult === "correct" ? "correct" : "wrong");
    }, 1400);
    setGame((prev) => ({
      ...prev,
      isFirstRound: false,
      leftPriceVisible: firstRevealLeft ? true : prev.leftPriceVisible,
      rightPriceVisible: !firstRevealLeft ? true : prev.rightPriceVisible,
    }));

    window.setTimeout(() => {
      setGame((prev) => ({
        ...prev,
        leftPriceVisible: true,
        rightPriceVisible: true,
      }));

      window.setTimeout(() => {
        const chosen = chosenIsLeft ? snapshot.leftProduct : snapshot.rightProduct;
        const other = chosenIsLeft ? snapshot.rightProduct : snapshot.leftProduct;
        const result = evaluateGuess(chosen, other);

        setCenterIndicator("hidden");

        window.setTimeout(() => {
          setCenterIndicator(result === "wrong" ? "wrong" : "correct");

          window.setTimeout(() => {
            setCenterIndicator("hidden");

            if (result === "wrong") {
              window.setTimeout(() => {
                setGame((prev) => ({ ...prev, phase: "gameover" }));
                const nextStats = updateHLStats(stats, snapshot.currentStreak);
                setStats(nextStats);
                setLocked(false);
                setClickedSide(null);
                setClickedBorderState("none");
              }, HIDE_TO_SLIDE_DELAY_MS);
              return;
            }

            window.setTimeout(() => {
              setClickedSide(null);
              setClickedBorderState("none");
              const incoming = snapshot.nextProduct;
              const replacementNext = pickRandom(products);
              preloadImage(replacementNext.image);
              setPendingAnimation({ incoming, replacementNext });

              setGame((prev) => ({ ...prev, phase: "animating" }));
              setIncomingVisible(false);
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                  setIncomingVisible(true);
                });
              });
            }, HIDE_TO_SLIDE_DELAY_MS);
          }, INDICATOR_VISIBLE_MS);
        }, VS_TO_RESULT_DELAY_MS);
      }, SECOND_REVEAL_DELAY_MS);
    }, FIRST_REVEAL_START_MS);
  };

  const finishSlideAnimation = () => {
    if (!pendingAnimation) return;

    setGame((prev) => ({
      ...prev,
      leftProduct: prev.rightProduct,
      rightProduct: pendingAnimation.incoming,
      nextProduct: pendingAnimation.replacementNext,
      currentStreak: prev.currentStreak + 1,
      leftPriceVisible: true,
      rightPriceVisible: false,
      phase: "revealing",
    }));
    setPendingAnimation(null);
    setIncomingVisible(false);
    setLocked(false);
    setClickedSide(null);
    setClickedBorderState("none");
    window.setTimeout(() => {
      setFlipVsOnShow(true);
      setCenterIndicator("vs");
    }, VS_REAPPEAR_DELAY_MS);
  };

  const resetGame = () => {
    setLocked(false);
    setPendingAnimation(null);
    setIncomingVisible(false);
    setFlipVsOnShow(false);
    setClickedSide(null);
    setClickedBorderState("none");
    setCenterIndicator("vs");
    setGame(buildInitialState());
  };

  const animating = game.phase === "animating";

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="flex-1 flex flex-col">
        <header className="grid grid-cols-[1fr_auto_1fr] items-center sm:px-8 sm:py-3 chunky-border border-x-0 border-t-0">
          <div className="flex items-center gap-3 sm:gap-8 mx-3 my-3 sm:mx-0 sm:my-0">
            <NavButton icon="?" onClick={() => setShowHelp(true)} ariaLabel="Help" />
            <NavButton
              icon={<img src="/rewle/assets/rewle-small.png" className="h-6 w-6 object-contain" alt="" />}
              onClick={() => {
                window.location.href = "/rewle/";
              }}
              ariaLabel="Back to REWLE"
            />
          </div>
          <div className="text-center">
            <h1 className="font-lilita text-2xl sm:text-3xl leading-none">
              <span className="text-rewe-red">Higher</span>
              <span className="text-rewe-blue"> Lower</span>
            </h1>
            <p className="mt-1 font-body text-xs sm:text-sm text-muted-foreground">Streak: {game.currentStreak}</p>
          </div>
          <div className="flex justify-end mx-3 my-3 sm:mx-0 sm:my-0">
            <NavButton
              ariaLabel="Stats"
              onClick={() => setShowStats(true)}
              icon={<img src="/rewle/assets/stats.svg" className="w-full h-full" alt="" />}
            />
          </div>
        </header>

        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 flex flex-col md:flex-row">
            <div
              className={`relative flex-1 ${
                animating ? "transition-transform duration-500 ease-in-out" : "transition-none"
              } ${
                animating && incomingVisible
                  ? "-translate-y-full md:-translate-x-full md:translate-y-0"
                  : "translate-x-0 translate-y-0"
              }`}
              style={animating ? { transitionDuration: `${SLIDE_DURATION_MS}ms` } : undefined}
            >
              <ProductCard
                product={game.leftProduct}
                priceVisible={game.leftPriceVisible}
                canChoose={!locked && game.phase !== "gameover"}
                borderState={clickedSide === "left" ? clickedBorderState : "none"}
                onChoose={() => chooseSide("left")}
              />
            </div>

            <div
              className={`relative flex-1 ${
                animating ? "transition-transform duration-500 ease-in-out" : "transition-none"
              } ${
                animating && incomingVisible
                  ? "-translate-y-full md:-translate-x-full md:translate-y-0"
                  : "translate-x-0 translate-y-0"
              }`}
              style={animating ? { transitionDuration: `${SLIDE_DURATION_MS}ms` } : undefined}
            >
              <ProductCard
                product={game.rightProduct}
                priceVisible={game.rightPriceVisible}
                canChoose={!locked && game.phase !== "gameover"}
                borderState={clickedSide === "right" ? clickedBorderState : "none"}
                onChoose={() => chooseSide("right")}
              />
            </div>

            {animating && (
              <div className="absolute inset-0 pointer-events-none flex flex-col md:flex-row">
                <div className="relative flex-1" />
                <div
                  className={`relative flex-1 transition-transform duration-500 ease-in-out ${
                    incomingVisible
                      ? "translate-y-0 md:translate-y-0 md:translate-x-0"
                      : "translate-y-full md:translate-y-0 md:translate-x-full"
                  }`}
                  style={{ transitionDuration: `${SLIDE_DURATION_MS}ms` }}
                  onTransitionEnd={(event) => {
                    if (event.propertyName !== "transform") return;
                    if (!incomingVisible || game.phase !== "animating") return;
                    finishSlideAnimation();
                  }}
                >
                  <ProductCard
                    product={game.nextProduct}
                    priceVisible={false}
                    canChoose={false}
                    onChoose={() => undefined}
                  />
                </div>
              </div>
            )}
          </div>
          <VsCircle state={centerIndicator} flipVsOnShow={flipVsOnShow} />
        </main>
      </div>

      <HLHelpModal open={showHelp} onClose={() => setShowHelp(false)} />
      <HLStatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
      <GameOverModal
        open={game.phase === "gameover"}
        score={game.currentStreak}
        bestScore={Math.max(stats.bestStreak, game.currentStreak)}
        onPlayAgain={resetGame}
      />
    </div>
  );
}
