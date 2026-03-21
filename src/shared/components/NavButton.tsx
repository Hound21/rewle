interface NavButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

export default function NavButton({ icon, onClick, ariaLabel }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 sm:w-10 sm:h-10 chunky-border chunky-shadow-sm btn-press rounded-sm bg-card font-display text-sm sm:text-base flex items-center justify-center"
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}
