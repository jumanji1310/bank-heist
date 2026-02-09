import CardOffer from "./CardOffer";
import CardAcknowledgement from "./CardAcknowledgement";
import { User, Card } from "../../game/logic";

interface RobberyPhaseProps {
  phaseNumber: string;
  currentUser:
    | {
        id: string;
        hasDrawnThisPhase?: boolean;
        hasDrawnAlarmThisPhase?: boolean;
      }
    | undefined;
  currentPlayer?: string;
  username: string;
  users: User[];
  pendingCard?: Card;
  pendingCardDrawnBy?: string;
  pendingCardRecipient?: string;
  onDrawVault: () => void;
  onDrawAlarm: () => void;
  onGiveCard: (recipientId: string) => void;
  onAcknowledge: () => void;
  vaultDeckSize: number;
  alarmDeckSize: number;
}

export default function RobberyPhase({
  phaseNumber,
  currentUser,
  currentPlayer,
  username,
  users,
  pendingCard,
  pendingCardDrawnBy,
  pendingCardRecipient,
  onDrawVault,
  onDrawAlarm,
  onGiveCard,
  onAcknowledge,
  vaultDeckSize,
  alarmDeckSize,
}: RobberyPhaseProps) {
  const hasDrawnVault = currentUser?.hasDrawnThisPhase || false;
  const hasDrawnAlarm = currentUser?.hasDrawnAlarmThisPhase || false;
  const isPhase1 = phaseNumber === "1";
  const needsAlarm = !isPhase1;
  const isCurrentPlayer = currentPlayer === username;
  const isWaitingToGiveCard =
    pendingCard && pendingCardDrawnBy === username && !pendingCardRecipient;

  const otherPlayers = users.filter((u) => u.id !== username);

  const isComplete = isPhase1 ? hasDrawnVault : hasDrawnAlarm && hasDrawnVault;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Robbery Phase {phaseNumber}</h1>
      <p className="text-gray-600">Execute the heist!</p>

      {isComplete ? (
        <div className="text-green-600 font-semibold text-lg">
          ✓ You have drawn this phase. Waiting for others...
        </div>
      ) : !isCurrentPlayer ? (
        <div className="text-gray-600 font-semibold text-lg">
          Waiting for {currentPlayer}'s turn...
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {needsAlarm && (
            <button
              onClick={onDrawAlarm}
              disabled={alarmDeckSize === 0 || hasDrawnAlarm}
              className="rounded-lg bg-red-600 px-6 py-3 text-lg font-semibold text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {hasDrawnAlarm ? "✓ Alarm Card Drawn" : "Draw Alarm Card 🚨"}
              <div className="text-xs mt-1">{alarmDeckSize} cards left</div>
            </button>
          )}
          <button
            onClick={onDrawVault}
            disabled={
              vaultDeckSize === 0 ||
              hasDrawnVault ||
              (needsAlarm && !hasDrawnAlarm)
            }
            className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {hasDrawnVault ? "✓ Vault Card Drawn" : "Draw Vault Card 🏦"}
            <div className="text-xs mt-1">{vaultDeckSize} cards left</div>
          </button>
          {needsAlarm && !hasDrawnAlarm && (
            <p className="text-sm text-gray-500">
              Draw alarm card first, then vault card
            </p>
          )}
        </div>
      )}

      {isWaitingToGiveCard && pendingCard && (
        <CardOffer
          card={pendingCard}
          otherPlayers={otherPlayers}
          onGiveCard={onGiveCard}
        />
      )}

      {pendingCardRecipient === username &&
        pendingCard &&
        pendingCardDrawnBy && (
          <CardAcknowledgement
            card={pendingCard}
            drawnBy={pendingCardDrawnBy}
            onAcknowledge={onAcknowledge}
          />
        )}
    </div>
  );
}
