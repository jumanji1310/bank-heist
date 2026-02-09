import Card from "./Card";
import { Card as CardType } from "../../game/logic";

interface PlayerHandProps {
  hand: CardType[] | undefined;
}

export default function PlayerHand({ hand }: PlayerHandProps) {
  if (!hand || hand.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm">No cards in hand</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-2 font-semibold text-gray-700">
        Your Hand ({hand.length})
      </div>
      <div className="flex flex-wrap gap-3 overflow-auto max-h-48">
        {hand.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
