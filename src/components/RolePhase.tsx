import UserBadge from "./UserBadge";
import { User } from "../../game/logic";

interface RolePhaseProps {
  userRole?: string;
  teammates: User[];
}

export default function RolePhase({ userRole, teammates }: RolePhaseProps) {
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

      <p className="text-gray-600 mt-4">Prepare for the heist...</p>
    </div>
  );
}
