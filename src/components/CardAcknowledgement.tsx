import { Card as CardType } from "../../game/logic";
import Card from "./Card";

interface CardAcknowledgementProps {
  card: CardType;
  drawnBy: string;
  onAcknowledge: () => void;
}

export default function CardAcknowledgement({
  card,
  drawnBy,
  onAcknowledge,
}: CardAcknowledgementProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">You received a card!</h2>

        <p className="text-gray-700 mb-4 text-center">
          {drawnBy} gave you this card:
        </p>

        <div className="flex justify-center mb-6">
          <Card card={card} />
        </div>

        <button
          onClick={onAcknowledge}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}
