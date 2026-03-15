const translations = {
  guessesLeft: (n: number) => `Versuch: ${7 - n}/6`,
  win: (price: string) => `Gewonnen! Glückwunsch! \nDer Preis war ${price}`,
  loss: (price: string) => `Vielleicht nächstes Mal! \nDer Preis war ${price}`,
  submit: "Raten",
  share: "Teilen",
  copied: "In die Zwischenablage kopiert!",
  stats: "Statistik",
  played: "Gespielt",
  winRate: "Gewinn %",
  currentStreak: "Aktuelle Serie",
  maxStreak: "Beste Serie",
  guessDistribution: "Verteilung",
  helpTitle: "Spielanleitung",
  helpRules: [
    "Errate den Preis des Produkts in 6 Versuchen.",
    "Nach jedem Tipp siehst du einen Pfeil und eine Farbe.",
  ],
  helpArrows: "Pfeil-Legende",
  helpArrowUp: "↑ Dein Tipp ist zu niedrig",
  helpArrowDown: "↓ Dein Tipp ist zu hoch",
  helpColorGreen: "🟩 Innerhalb von 5% — gewonnen!",
  helpColorYellow: "🟨 Innerhalb von 25%",
  helpColorRed: "🟥 Mehr als 25% daneben",
  invalidInput: "Bitte gib einen gültigen Preis ein",
  currency: "€",
  placeholder: "0.00",
  close: "Schließen",
} as const;

export function t() {
  return translations;
}
