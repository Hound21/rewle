import { t } from "@/games/rewle/logic/i18n";
import NavButton from "@/shared/components/NavButton";

interface HeaderProps {
  onOpenHelp: () => void;
  onOpenStats: () => void;
}

export default function GameHeader({ onOpenHelp, onOpenStats }: HeaderProps) {
  const strings = t();

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center px-3 py-2 sm:px-3 sm:py-3 chunky-border border-x-0 border-t-0">
      <div className="flex items-center gap-3">
        <NavButton icon="?" onClick={onOpenHelp} ariaLabel="Help" />
        <NavButton
          icon={<img src="/rewle/assets/highlow-small.png" className="h-6 w-6 object-contain" alt="" />}
          onClick={() => {
            window.location.href = "/rewle/higher-lower.html";
          }}
          ariaLabel="Higher Lower"
        />
      </div>

      <h1 className="font-lilita text-4xl sm:text-5xl tracking-wide select-none leading-none">
        <span className="text-rewe-red">REW</span>
        <span className="text-rewe-blue">LE</span>
      </h1>

      <div className="flex justify-end">
        <NavButton
          onClick={onOpenStats}
          ariaLabel={strings.stats}
          icon={<img src="/rewle/assets/stats.svg" className="w-full h-full" alt="" />}
        />
      </div>
    </header>
  );
}
