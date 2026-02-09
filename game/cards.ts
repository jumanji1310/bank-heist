// Card System
export interface Card {
  id: string;
  name: string;
  type: "vault" | "alarm" | "handcuff";
  value?: number;
  description: string;
}

// Define card templates with quantities
export const VAULT_CARD_DEFINITIONS = [
  { name: "Adrenaline", description: "Quick energy boost", quantity: 8 },
  { name: "Cash Bag", description: "Bag full of cash", quantity: 10 },
  { name: "Chloroform", description: "Knockout chemical", quantity: 4 },
  { name: "Dye Pack", description: "Explosive dye marker", quantity: 2 },
  { name: "Knife", description: "Sharp blade", quantity: 4 },
  { name: "Lock Pick", description: "Open locks silently", quantity: 4 },
  { name: "Speedloader", description: "Quick reload", quantity: 4 },
  { name: "Zip Tie", description: "Restrain targets", quantity: 4 },
];

export const ALARM_CARD_DEFINITIONS = [
  { name: "Are You Loyal", description: "Question loyalty", quantity: 1 },
  { name: "Check These Out", description: "Examine cards", quantity: 3 },
  { name: "I'll Take That", description: "Steal a card", quantity: 2 },
  { name: "Hold It Right There", description: "Stop action", quantity: 2 },
  { name: "Let's Get Moving", description: "Speed things up", quantity: 3 },
  { name: "I Don't Like This", description: "Express suspicion", quantity: 3 },
  { name: "You Can Trust Me", description: "Build trust", quantity: 1 },
  // Attribute cards
  { name: "Guilty Conscience", description: "Attribute card", quantity: 1 },
  { name: "Gun Jammed", description: "Attribute card", quantity: 1 },
  { name: "Hostage", description: "Attribute card", quantity: 1 },
  { name: "Hush Money", description: "Attribute card", quantity: 1 },
  { name: "Loose Tongue", description: "Attribute card", quantity: 1 },
  { name: "Martial Skills", description: "Attribute card", quantity: 1 },
  { name: "Masked", description: "Attribute card", quantity: 1 },
  { name: "Poisoned", description: "Attribute card", quantity: 1 },
  { name: "Shotgun", description: "Attribute card", quantity: 1 },
  { name: "Trigger Happy", description: "Attribute card", quantity: 1 },
];

export const HANDCUFF_CARD_DEFINITIONS = [
  { name: "Handcuff", description: "Restrain a player", quantity: 4 },
];

// Build deck with multiple copies
export const buildDeck = (
  definitions: Array<{
    name: string;
    value?: number;
    description: string;
    quantity: number;
  }>,
  type: "vault" | "alarm" | "handcuff",
): Card[] => {
  const deck: Card[] = [];
  definitions.forEach((def) => {
    for (let i = 0; i < def.quantity; i++) {
      deck.push({
        id: `${type}-${def.name.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        name: def.name,
        type,
        value: def.value,
        description: def.description,
      });
    }
  });
  return deck;
};

// Shuffle function
export const shuffleDeck = <T>(deck: T[]): T[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
