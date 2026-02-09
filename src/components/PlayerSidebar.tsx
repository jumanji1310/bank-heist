import UserBadge from "./UserBadge";
import ChatUI from "./ChatUI";
import PlayerHand from "./PlayerHand";
import { User } from "../../game/logic";

interface PlayerSidebarProps {
  roomId: string;
  users: User[];
  log: { dt: number; message: string }[];
  onSendMessage: (message: string) => void;
  currentUserHand: any[] | undefined;
}

export default function PlayerSidebar({
  roomId,
  users,
  log,
  onSendMessage,
  currentUserHand,
}: PlayerSidebarProps) {
  return (
    <div className="flex w-1/3 flex-col justify-end border-l border-gray-300 gap-4 overflow-y-auto">
      <div>
        <h2 className="text-lg p-4">
          Players in room <span className="font-bold">{roomId}</span>
        </h2>
        <div className="flex flex-col gap-2 px-4 pb-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <UserBadge userId={user.id} color={user.color} />
              {user.ready && (
                <span className="text-green-600 text-sm font-semibold">
                  ✓ Ready
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        <PlayerHand hand={currentUserHand} />
      </div>

      <div className="flex-1 min-h-0">
        <ChatUI log={log} onSendMessage={onSendMessage} users={users} />
      </div>
    </div>
  );
}
