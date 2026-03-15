import { useState } from "react";
import { t } from "@/lib/i18n";

interface GuessInputProps {
  onSubmit: (value: number) => void;
  disabled: boolean;
}

export default function GuessInput({ onSubmit, disabled }: GuessInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const strings = t();

  const handleSubmit = () => {
    const normalized = value.replace(",", ".");
    const num = parseFloat(normalized);
    if (isNaN(num) || num <= 0) {
      setError(strings.invalidInput);
      return;
    }
    setError("");
    onSubmit(Math.round(num * 100) / 100);
    setValue("");
  };

  const handleChange = (nextValue: string) => {
    const sanitized = nextValue.replace(/[^0-9.,]/g, "");
    setValue(sanitized);
    setError("");
  };

  return (
      <div className="flex gap-2 items-center">
        <div className="w-8 h-11 shrink-0 chunky-border rounded-sm flex items-center justify-center bg-card font-body font-bold text-base chunky-shadow-sm">
          {strings.currency}
        </div>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && handleSubmit()}
          placeholder={strings.placeholder}
          disabled={disabled}
          className="flex-1 h-11 px-3 min-w-0 chunky-border rounded-sm bg-card font-body text-base chunky-shadow-sm outline-none focus:ring-2 focus:ring-rewe-blue disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="w-24 h-11 shrink-0 chunky-border rounded-sm bg-rewe-blue text-primary-foreground font-display text-sm chunky-shadow-sm btn-press disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {strings.submit}
        </button>
      </div>
  );
}
