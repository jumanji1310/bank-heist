import UserBadge from "./UserBadge";
import { User } from "../../game/logic";

interface RolePhaseProps {
  userRole?: string;
  teammates: User[];
  onReady: () => void;
  isReady: boolean;
  readyCount: number;
  totalPlayers: number;
}

export default function RolePhase({
  userRole,
  teammates,
  onReady,
  isReady,
  readyCount,
  totalPlayers,
}: RolePhaseProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">Your Role</h1>
      {userRole && (
        <div className="text-6xl font-bold text-purple-600 mb-4">
          {userRole}
        </div>
      )}

      {(userRole === "Agent" || userRole === "Rival") &&
        teammates.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">
              Your {userRole} Partner{teammates.length > 1 ? "s" : ""}:
            </h2>
            <div className="flex justify-center gap-2">
              {teammates.map((teammate) => (
                <UserBadge
                  key={teammate.id}
                  userId={teammate.id}
                  color={teammate.color}
                />
              ))}
            </div>
          </div>
        )}

      <div className="mt-8">
        <button
          onClick={onReady}
          disabled={isReady}
          className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isReady ? "✓ Ready" : "Ready Up"}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {readyCount} / {totalPlayers} players ready
        </p>
      </div>
    </div>
  );
}
