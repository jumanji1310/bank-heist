import UserBadge from "./UserBadge";
import { User } from "../../game/logic";

interface PlayerTableProps {
  users: User[];
  currentUsername: string;
}

const CIRCLE_SIZE = 800;
const CIRCLE_RADIUS = 200;

export default function PlayerTable({
  users,
  currentUsername,
}: PlayerTableProps) {
  const currentUserIndex = users.findIndex((u) => u.id === currentUsername);

  // Reorder users so current player is at the bottom
  const reorderedUsers = [
    ...users.slice(currentUserIndex),
    ...users.slice(0, currentUserIndex),
  ];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-full max-w-4xl aspect-square">
        {/* Circle container */}
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
        >
          {/* Draw circle */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
        </svg>

        {/* Players positioned around circle */}
        <div className="absolute inset-0">
          {reorderedUsers.map((user, index) => {
            const angle = (index / reorderedUsers.length) * 360 - 90;
            const centerX = CIRCLE_SIZE / 2;
            const centerY = CIRCLE_SIZE / 2;
            const x =
              centerX + CIRCLE_RADIUS * Math.cos((angle * Math.PI) / 180);
            const y =
              centerY + CIRCLE_RADIUS * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={user.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(x / CIRCLE_SIZE) * 100}%`,
                  top: `${(y / CIRCLE_SIZE) * 100}%`,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <UserBadge userId={user.id} color={user.color} />
                  {user.ready && (
                    <span className="text-green-600 text-lg">✓</span>
                  )}
                  {/* Placeholder for cards */}
                  <div className="text-xs text-gray-400">Cards here</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
