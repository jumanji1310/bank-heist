import { Card as CardType, User } from "../../game/logic";
import Card from "./Card";

interface CardOfferProps {
  card: CardType;
  otherPlayers: User[];
  onGiveCard: (recipientId: string) => void;
}

export default function CardOffer({
  card,
  otherPlayers,
  onGiveCard,
}: CardOfferProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">You drew a card!</h2>

        <div className="flex justify-center mb-6">
          <Card card={card} />
        </div>

        <p className="text-gray-700 mb-4 text-center">
          Choose a player to give this card to:
        </p>

        <div className="flex flex-col gap-2">
          {otherPlayers.length === 0 ? (
            <p className="text-gray-500 text-center">No other players</p>
          ) : (
            otherPlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => onGiveCard(player.id)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Give to {player.id}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
