import { HLProduct } from "@/games/higher-lower/logic/higherLowerLogic";

interface ProductCardProps {
  product: HLProduct;
  priceVisible: boolean;
  canChoose: boolean;
  onChoose: () => void;
  borderState?: "none" | "selected" | "correct" | "wrong";
}

export default function ProductCard({
  product,
  priceVisible,
  canChoose,
  onChoose,
  borderState = "none",
}: ProductCardProps) {
  const borderClass =
    borderState === "selected"
      ? "border-[6px] border-black"
      : borderState === "correct"
        ? "border-[6px] border-feedback-green"
        : borderState === "wrong"
          ? "border-[6px] border-feedback-red"
          : "";

  return (
    <button
      type="button"
      onClick={onChoose}
      disabled={!canChoose}
      className="group relative w-full h-full overflow-hidden bg-white chunky-border disabled:cursor-default"
    >
      <img src={product.image} alt={product.name} className="w-full h-full object-contain" loading="lazy" />

      <div className="absolute inset-0 bg-muted/0 transition-colors duration-150 md:group-hover:bg-muted/25" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
        <div className="relative w-full max-w-[72%] text-center">
          <h2 className="font-display text-base md:text-xl leading-tight text-foreground bg-white px-3 py-2 chunky-shadow">
            {product.name}
          </h2>
          {product.promo && (
            <span className="absolute -right-4 -bottom-4 z-20 chunky-border chunky-shadow-sm rounded-full bg-rewe-red px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              Angebot
            </span>
          )}
        </div>

        <div className="mt-2 h-14 flex items-center justify-center">
          {priceVisible && (
            <p className="font-lilita text-xl md:text-3xl text-rewe-blue animate-in fade-in zoom-in duration-1000 bg-white px-3 py-1 chunky-shadow min-w-[7ch] text-center">
              €{product.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {borderClass && (
        <div
          className={`pointer-events-none absolute inset-0 z-30 transition-colors duration-300 ease-out ${borderClass}`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
