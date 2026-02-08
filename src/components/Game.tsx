import { useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { useRouter } from "next/dist/client/components/navigation";
import CopyRoomButton from "./CopyRoomButton";
import ChatUI from "./ChatUI";
import UserBadge from "./UserBadge";
import RolePhase from "./RolePhase";

interface GameProps {
  username: string;
  roomId: string;
}

const Game = ({ username, roomId }: GameProps) => {
  const { gameState, dispatch } = useGameRoom(username, roomId);
  const router = useRouter();

  // Local state to use for the UI
  const [guess, setGuess] = useState<number>(0);

  // Indicated that the game is loading
  if (gameState === null) {
    return (
      <p>
        <span className="transition-all w-fit inline-block mr-4 animate-bounce">
          🎲
        </span>
        Waiting for server...
      </p>
    );
  }

  // Find the current user's role
  const currentUser = gameState.users.find((u) => u.id === username);
  const userRole = currentUser?.role;

  const handleGuess = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // Dispatch allows you to send an action!
    // Modify /game/logic.ts to change what actions you can send
    dispatch({ type: "guess", guess: guess });
  };

  const handleSendMessage = (message: string) => {
    // You'll need to add a chat action to your game logic
    dispatch({ type: "Chat", message });
  };

  const handleStartGame = () => {
    dispatch({ type: "startGame" });
  };

  // Render different content based on phase
  const renderPhaseContent = () => {
    if (!gameState.phase) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold mb-4">Waiting to start...</h1>
          <p className="text-gray-600">Click "Start Game" to begin!</p>
        </div>
      );
    }

    switch (gameState.phase) {
      case "role":
        // Find teammates based on role
        const teammates = gameState.users.filter(
          (u) =>
            u.id !== username &&
            u.role === userRole &&
            (userRole === "Agent" || userRole === "Rival"),
        );

        return <RolePhase userRole={userRole} teammates={teammates} />;

      case "robbery1":
      case "robbery2":
      case "robbery3":
      case "robbery4":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold mb-4">
              Robbery Phase {gameState.phase.slice(-1)}
            </h1>
            <p className="text-gray-600">Execute the heist!</p>
          </div>
        );

      case "getaway1":
      case "getaway2":
      case "getaway3":
      case "getaway4":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold mb-4">
              Getaway Phase {gameState.phase.slice(-1)}
            </h1>
            <p className="text-gray-600">Escape the scene!</p>
          </div>
        );

      case "hideout":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold mb-4">Hideout</h1>
            <p className="text-gray-600">Divide the loot...</p>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold mb-4">Game Phase</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/3 p-4 flex flex-col">
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-gray-200 p-2 hover:bg-gray-300"
            title="Return to home"
          >
            🏠
          </button>
          <h1 className="text-2xl font-bold">
            Welcome to room {roomId}, {username}!
          </h1>
          {userRole && (
            <span className="rounded-full bg-purple-500 px-3 py-1 text-sm font-semibold text-white">
              Role: {userRole}
            </span>
          )}
          {gameState.phase && (
            <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white">
              Phase: {gameState.phase}
            </span>
          )}
          <CopyRoomButton roomId={roomId} />
          <button
            onClick={handleStartGame}
            className="ml-auto rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Start Game
          </button>
        </div>

        <div className="flex-1 overflow-auto">{renderPhaseContent()}</div>
      </div>

      <div className="flex w-1/3 flex-col justify-end border-l border-gray-300">
        <h2 className="text-lg p-4">
          Players in room <span className="font-bold">{roomId}</span>
        </h2>
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {gameState.users.map((user) => (
            <UserBadge key={user.id} userId={user.id} color={user.color} />
          ))}
        </div>
        <div className="h-1/2">
          <ChatUI
            log={gameState.log}
            onSendMessage={handleSendMessage}
            users={gameState.users}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
