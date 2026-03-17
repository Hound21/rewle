import { t } from "@/lib/i18n";

interface HeaderProps {
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

export default function Header({ onOpenHelp, onOpenStats }: HeaderProps) {
  const strings = t();

  return (
    <header className="flex items-center justify-between px-4 py-3 chunky-border border-x-0 border-t-0">
      <button
        onClick={onOpenHelp}
        className="w-10 h-10 chunky-border chunky-shadow-sm btn-press rounded-sm bg-card font-display text-lg flex items-center justify-center"
        aria-label="Help"
      >
        ?
      </button>

      <h1 className="font-lilita text-6xl md:text-6xl tracking-wide select-none leading-none">
        <span className="text-rewe-red">REW</span>
        <span className="text-rewe-blue">LE</span>
      </h1>

      <button
        onClick={onOpenStats}
        className="w-10 h-10 chunky-border chunky-shadow-sm btn-press rounded-sm bg-card font-display text-base flex items-center justify-center"
        aria-label={strings.stats}
      >
        <img src="/rewle/assets/stats.svg" className="w-full h-full" alt="" />
      </button>
    </header>
  );
}
