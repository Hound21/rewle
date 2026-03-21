interface FooterProps {
  onOpenImpressum: () => void;
}

export default function Footer({ onOpenImpressum }: FooterProps) {
  return (
    <footer className="w-full mt-auto border-t border-x-0 border-b-0 bg-muted px-2 py-1">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="text-[10px] text-muted-foreground leading-tight">
          Inoffizielles Fanprojekt - Keine Verbindung zu REWE
        </p>
        <button
          onClick={onOpenImpressum}
          className="shrink-0 rounded-sm chunky-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground btn-press"
        >
          Impressum
        </button>
      </div>
    </footer>
  );
}
