import { useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { useRouter } from "next/dist/client/components/navigation";
import CopyRoomButton from "./CopyRoomButton";
import RolePhase from "./RolePhase";
import PlayerSidebar from "./PlayerSidebar";

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

  const handleReady = () => {
    dispatch({ type: "ready" });
  };

  // Render different content based on phase
  const renderPhaseContent = () => {
    if (!gameState.phase) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {gameState.hostId === username ? (
            <>
              <h1 className="text-4xl font-bold">
                Click "Start Game" to begin!
              </h1>
              <button
                onClick={handleStartGame}
                className="rounded-md bg-green-500 px-6 py-3 text-white hover:bg-green-600 font-semibold"
              >
                Start Game
              </button>
            </>
          ) : (
            <h1 className="text-4xl font-bold">
              Waiting for {gameState.hostId} to start...
            </h1>
          )}
        </div>
      );
    }

    switch (gameState.phase) {
      case "role":
        const teammates = gameState.users.filter(
          (u) =>
            u.id !== username &&
            u.role === userRole &&
            (userRole === "Agent" || userRole === "Rival"),
        );

        const readyCount = gameState.users.filter((u) => u.ready).length;
        const isReady = currentUser?.ready || false;

        return (
          <RolePhase
            userRole={userRole}
            teammates={teammates}
            onReady={handleReady}
            isReady={isReady}
            readyCount={readyCount}
            totalPlayers={gameState.users.length}
          />
        );

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
            <h1 className="text-4xl font-bold">Hideout</h1>
            <p className="text-gray-600">Divide the loot...</p>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold">Game Phase</h1>
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
        </div>

        <div className="flex-1 overflow-auto">{renderPhaseContent()}</div>
      </div>

      <PlayerSidebar
        roomId={roomId}
        users={gameState.users}
        log={gameState.log}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Game;
