interface HLHelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HLHelpModal({ open, onClose }: HLHelpModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={onClose}>
      <div
        className="w-full max-w-sm mx-4 bg-card chunky-border chunky-shadow rounded-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-center mb-4">Spielanleitung</h2>

        <ul className="space-y-2 mb-4">
          <li className="font-body text-sm flex gap-2">
            <span className="text-rewe-red font-bold">1.</span>
            Wähle das Produkt aus, das deiner Meinung nach teurer ist.
          </li>
          <li className="font-body text-sm flex gap-2">
            <span className="text-rewe-red font-bold">2.</span>
            Richtige Tipps halten deine Serie am Leben, ein falscher Tipp beendet die Runde.
          </li>
          <li className="font-body text-sm flex gap-2">
            <span className="text-rewe-red font-bold">3.</span>
            Viel Glück!
          </li>
        </ul>

        <button
          onClick={onClose}
          className="w-full h-10 chunky-border rounded-sm bg-muted font-display text-sm btn-press chunky-shadow-sm"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
