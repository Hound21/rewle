import { t } from "@/lib/i18n";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;
  const strings = t();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={onClose}>
      <div
        className="w-full max-w-sm mx-4 bg-card chunky-border chunky-shadow rounded-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-center mb-4">{strings.helpTitle}</h2>

        <ul className="space-y-2 mb-4">
          {strings.helpRules.map((rule, i) => (
            <li key={i} className="font-body text-sm flex gap-2">
              <span className="text-rewe-red font-bold">{i + 1}.</span>
              {rule}
            </li>
          ))}
        </ul>

        <h3 className="font-body font-semibold text-sm mb-2">{strings.helpArrows}</h3>
        <div className="space-y-1 mb-4 font-body text-sm">
          <p>{strings.helpArrowUp}</p>
          <p>{strings.helpArrowDown}</p>
          <p>{strings.helpColorGreen}</p>
          <p>{strings.helpColorYellow}</p>
          <p>{strings.helpColorRed}</p>
        </div>

        {/* Example rows */}
        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <div className="flex-1 h-9 chunky-border rounded-sm bg-feedback-red text-primary-foreground flex items-center px-3 font-body text-sm font-semibold">€3.50</div>
            <div className="w-9 h-9 chunky-border rounded-sm bg-feedback-red text-primary-foreground flex items-center justify-center font-display">↑</div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-9 chunky-border rounded-sm bg-feedback-yellow flex items-center px-3 font-body text-sm font-semibold">€5.20</div>
            <div className="w-9 h-9 chunky-border rounded-sm bg-feedback-yellow flex items-center justify-center font-display">↓</div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-9 chunky-border rounded-sm bg-feedback-green text-primary-foreground flex items-center px-3 font-body text-sm font-semibold">€4.99</div>
            <div className="w-9 h-9 chunky-border rounded-sm bg-feedback-green text-primary-foreground flex items-center justify-center font-display">✔</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-10 chunky-border rounded-sm bg-muted font-display text-sm btn-press chunky-shadow-sm"
        >
          {strings.close}
        </button>
      </div>
    </div>
  );
}
