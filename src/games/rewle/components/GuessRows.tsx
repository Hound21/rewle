import { GuessResult, MAX_GUESSES } from "@/games/rewle/logic/gameLogic";
import { t } from "@/games/rewle/logic/i18n";

interface GuessRowsProps {
  guesses: GuessResult[];
  inputRow?: React.ReactNode;
}

function colorClass(color: GuessResult["color"]) {
  if (color === "green") return "bg-feedback-green/70 text-foreground";
  if (color === "yellow") return "bg-feedback-yellow/75 text-foreground";
  return "bg-feedback-red/70 text-foreground";
}

function arrowSymbol(dir: GuessResult["direction"]) {
  if (dir === "up") return "↑";
  if (dir === "down") return "↓";
  return "✔";
}

export default function GuessRows({ guesses, inputRow }: GuessRowsProps) {
  const currency = t().currency;
  const rows = [];

  for (let i = 0; i < MAX_GUESSES; i++) {
    const guess = guesses[i];
    rows.push(
      <div key={i} className="flex gap-2 items-center">
        <div
          className={`flex-1 h-11 chunky-border rounded-sm flex items-center justify-center text-center px-2 font-body font-extrabold text-lg tracking-wide ${
            guess ? `${colorClass(guess.color)} chunky-shadow-sm animate-stamp` : "bg-muted"
          }`}
        >
          {guess ? `${currency}${guess.value.toFixed(2)}` : ""}
        </div>
        <div
          className={`w-24 h-11 chunky-border rounded-sm flex items-center justify-center font-display text-xl ${
            guess ? `${colorClass(guess.color)} chunky-shadow-sm animate-stamp` : "bg-muted"
          }`}
        >
          {guess ? arrowSymbol(guess.direction) : ""}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {rows}
      {inputRow}
    </div>
  );
}
